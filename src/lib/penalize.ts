import { addDays } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';
import { affinityGainFromGoalCompletion, clampAffinity } from '@/lib/affinity';
import { getUserItemEffects } from '@/lib/shop-items';

/**
 * 將逾期且未上傳證明的目標標記為 FAILED。
 * - 若有 Stripe PaymentIntent：實際扣款（capture）
 * - 若無 Stripe：將 penaltyCents 加入 balance（模擬）
 * - 寬限期：用戶擁有寬限期道具時，逾期後多 N 天內仍可補傳
 * - 減輕處罰：用戶擁有減輕處罰道具時，實際扣款為原金額的 N%
 */
export async function penalizeOverdueGoals() {
  const now = new Date();
  const overdue = await prisma.goal.findMany({
    where: {
      status: 'ACTIVE',
      proof: null,
    },
    include: { user: true },
  });

  const toPenalize: typeof overdue = [];
  for (const goal of overdue) {
    const effects = await getUserItemEffects(goal.userId, prisma);
    const graceEnd = addDays(goal.dueAt, effects.gracePeriodDays);
    if (now < graceEnd) continue; // 仍在寬限期內
    if (goal.dueAt >= now) continue; // 未逾期（含寬限期前）
    toPenalize.push(goal);
  }

  for (const goal of toPenalize) {
    const effects = await getUserItemEffects(goal.userId, prisma);
    const actualPenalty = Math.round((goal.penaltyCents * effects.penaltyReduction) / 100);

    let stripeChargeId: string | null = null;
    const amountToCapture = actualPenalty > 0 ? actualPenalty : 0;

    if (isStripeEnabled && stripe && goal.stripePaymentIntentId) {
      try {
        if (amountToCapture > 0) {
          const pi = await stripe.paymentIntents.capture(goal.stripePaymentIntentId, {
            amount_to_capture: Math.min(amountToCapture, goal.penaltyCents),
          });
          const chargeId = typeof pi.latest_charge === 'string'
            ? pi.latest_charge
            : pi.latest_charge?.id;
          if (chargeId) stripeChargeId = chargeId;
        } else {
          await stripe.paymentIntents.cancel(goal.stripePaymentIntentId);
        }
      } catch {
        // 預授權可能已過期，fallback 到 balance
      }
    }

    const affinityLoss = affinityGainFromGoalCompletion(actualPenalty || goal.penaltyCents);
    const coach = await prisma.coachProfile.findUnique({ where: { userId: goal.userId } });
    const newAffinity = clampAffinity((coach?.affinity ?? 0) - affinityLoss);

    await prisma.$transaction([
      prisma.goal.update({
        where: { id: goal.id },
        data: {
          status: 'FAILED',
          stripeChargeId,
          penaltyCents: actualPenalty > 0 ? actualPenalty : goal.penaltyCents, // 若 0 則保留原值供退款邏輯
        },
      }),
      ...(stripeChargeId
        ? []
        : amountToCapture > 0
          ? [
              prisma.user.update({
                where: { id: goal.userId },
                data: { balance: { increment: amountToCapture } },
              }),
            ]
          : []),
      prisma.coachProfile.upsert({
        where: { userId: goal.userId },
        update: { affinity: newAffinity },
        create: {
          userId: goal.userId,
          coachType: 'friend',
          coachGender: 'male',
          affinity: newAffinity,
          unlockedItems: '[]',
        },
      }),
    ]);
  }

  return toPenalize.length;
}
