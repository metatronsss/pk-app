import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';
import { affinityGainFromGoalCompletion, clampAffinity } from '@/lib/affinity';

/**
 * 定時任務：將逾期且未上傳證明的目標標記為 FAILED。
 * - 若有 Stripe PaymentIntent：實際扣款（capture），並儲存 chargeId 供退款用
 * - 若無 Stripe：僅增加 balance（模擬）
 */
export async function POST(request: NextRequest) {
  const now = new Date();
  const overdue = await prisma.goal.findMany({
    where: {
      status: 'ACTIVE',
      dueAt: { lt: now },
      proof: null,
    },
    include: { user: true },
  });

  for (const goal of overdue) {
    let stripeChargeId: string | null = null;

    if (isStripeEnabled && stripe && goal.stripePaymentIntentId) {
      try {
        const pi = await stripe.paymentIntents.capture(goal.stripePaymentIntentId);
        const chargeId = typeof pi.latest_charge === 'string'
          ? pi.latest_charge
          : pi.latest_charge?.id;
        if (chargeId) stripeChargeId = chargeId;
      } catch {
        // 預授權可能已過期，fallback 到 balance
      }
    }

    const affinityLoss = affinityGainFromGoalCompletion(goal.penaltyCents);
    const coach = await prisma.coachProfile.findUnique({ where: { userId: goal.userId } });
    const newAffinity = clampAffinity((coach?.affinity ?? 0) - affinityLoss);

    await prisma.$transaction([
      prisma.goal.update({
        where: { id: goal.id },
        data: { status: 'FAILED', stripeChargeId },
      }),
      ...(stripeChargeId
        ? []
        : [
            prisma.user.update({
              where: { id: goal.userId },
              data: { balance: { increment: goal.penaltyCents } },
            }),
          ]),
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

  return NextResponse.json({
    message: 'Penalize done',
    penalized: overdue.length,
    goalIds: overdue.map((g) => g.id),
  });
}
