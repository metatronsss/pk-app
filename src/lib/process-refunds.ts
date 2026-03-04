import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled, toStripeAmount } from '@/lib/stripe';

/**
 * 處理符合資格的延遲退款（非會員 60 天後）
 * 會員 1 日內退款在 proof 上傳時立即處理。
 */
export async function processEligibleRefunds() {
  const now = new Date();
  const eligible = await prisma.goal.findMany({
    where: {
      status: 'REFUND_PENDING',
      refundEligibleAt: { lte: now },
      proof: { isNot: null },
    },
    include: { proof: true, user: true },
  });

  let processed = 0;
  for (const goal of eligible) {
    const user = goal.user;
    if (!user) continue;

    try {
      if (isStripeEnabled && stripe && goal.stripeChargeId) {
        await stripe.refunds.create({
          charge: goal.stripeChargeId,
          amount: toStripeAmount(goal.penaltyCents),
        });
      } else if (!goal.stripeChargeId) {
        const balance = (await prisma.user.findUnique({ where: { id: user.id }, select: { balance: true } }))?.balance ?? 0;
        if (balance >= goal.penaltyCents) {
          await prisma.user.update({
            where: { id: user.id },
            data: { balance: { decrement: goal.penaltyCents } },
          });
        } else {
          continue; // 餘額不足，跳過
        }
      }

      await prisma.goal.update({
        where: { id: goal.id },
        data: { status: 'REFUNDED', refundEligibleAt: null },
      });
      processed++;
    } catch {
      // 單筆失敗不影響其他
    }
  }

  return processed;
}
