import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { startOfMonth, subMonths } from 'date-fns';
import { stripe, isStripeEnabled, toStripeAmount } from '@/lib/stripe';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  const { goalId } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: { proof: true },
  });
  if (!goal) {
    return NextResponse.json({ message: '目標不存在' }, { status: 404 });
  }
  if (goal.status !== 'FAILED') {
    return NextResponse.json({ message: '僅未完成目標可申請退款' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: true, balance: true },
  });
  if (!user) {
    return NextResponse.json({ message: '用戶不存在' }, { status: 404 });
  }

  const now = new Date();
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = startOfMonth(now);
  const isLastMonth =
    goal.dueAt >= lastMonthStart && goal.dueAt < lastMonthEnd;

  if (user.subscription === 'FREE' && !isLastMonth) {
    return NextResponse.json(
      { message: '免費用戶僅能退上個月遞延目標的款' },
      { status: 400 }
    );
  }

  if (isStripeEnabled && stripe && goal.stripeChargeId) {
    try {
      await stripe.refunds.create({
        charge: goal.stripeChargeId,
        amount: toStripeAmount(goal.penaltyCents),
      });
    } catch (e: unknown) {
      const err = e as { message?: string };
      return NextResponse.json(
        { message: err.message ?? 'Stripe 退款失敗' },
        { status: 500 }
      );
    }
  } else {
    if (user.balance < goal.penaltyCents) {
      return NextResponse.json(
        { message: '餘額不足，無法退款' },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: goal.penaltyCents } },
    });
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: { status: 'REFUNDED' },
  });

  return NextResponse.json({ success: true, message: '已退款' });
}
