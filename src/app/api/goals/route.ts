import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { z } from 'zod';
import { stripe, isStripeEnabled, toStripeAmount } from '@/lib/stripe';

const createBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  dueAt: z.string().datetime(),
  penaltyCents: z.number().int().min(500).max(10000),
});

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { dueAt: 'desc' },
    include: { proof: true },
  });
  return NextResponse.json(goals);
}

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const body = await request.json();
  const parsed = createBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid body', errors: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { title, description, dueAt, penaltyCents } = parsed.data;

  if (new Date(dueAt) <= new Date()) {
    return NextResponse.json(
      { message: '截止時間不能早於現在' },
      { status: 400 }
    );
  }

  const currentMonthGoals = await prisma.goal.count({
    where: {
      userId,
      dueAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
      status: 'ACTIVE',
    },
  });
  if (currentMonthGoals >= 3) {
    return NextResponse.json(
      { message: '本月已達 3 個目標上限' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, stripePaymentMethodId: true },
  });

  let stripePaymentIntentId: string | null = null;

  if (isStripeEnabled && stripe && user?.stripePaymentMethodId && user?.stripeCustomerId) {
    const amount = toStripeAmount(penaltyCents);
    if (amount < 50) {
      return NextResponse.json(
        { message: '處罰金額至少 $0.50 USD（Stripe 最低限制）' },
        { status: 400 }
      );
    }
    try {
      const pi = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: user.stripeCustomerId,
        payment_method: user.stripePaymentMethodId,
        capture_method: 'manual',
        confirm: true,
        off_session: true,
        metadata: { userId },
      });
      if (pi.status !== 'requires_capture' && pi.status !== 'succeeded') {
        return NextResponse.json(
          { message: pi.last_payment_error?.message ?? '預授權失敗' },
          { status: 400 }
        );
      }
      stripePaymentIntentId = pi.id;
    } catch (e: unknown) {
      const err = e as { message?: string };
      return NextResponse.json(
        { message: err.message ?? '預授權失敗' },
        { status: 400 }
      );
    }
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      title,
      description,
      dueAt: new Date(dueAt),
      penaltyCents,
      status: 'ACTIVE',
      refundable: true,
      stripePaymentIntentId,
    },
  });
  return NextResponse.json(goal);
}
