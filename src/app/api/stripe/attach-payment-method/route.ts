import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  if (!isStripeEnabled || !stripe) {
    return NextResponse.json(
      { message: 'Stripe 未設定' },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const paymentMethodId = body.paymentMethodId as string;
  if (!paymentMethodId) {
    return NextResponse.json(
      { message: '缺少 paymentMethodId' },
      { status: 400 }
    );
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });
  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { message: '請先完成綁卡流程' },
      { status: 400 }
    );
  }

  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: user.stripeCustomerId,
  });

  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripePaymentMethodId: paymentMethodId },
  });

  return NextResponse.json({ success: true });
}
