import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';

export async function POST() {
  if (!isStripeEnabled || !stripe) {
    return NextResponse.json(
      { message: 'Stripe 未設定，請在 .env 加入 STRIPE_SECRET_KEY' },
      { status: 503 }
    );
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, stripeCustomerId: true },
  });
  if (!user) {
    return NextResponse.json({ message: '用戶不存在' }, { status: 404 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  });

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  });
}
