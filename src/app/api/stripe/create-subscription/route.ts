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

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { message: '請在 .env 加入 STRIPE_PRICE_ID（Stripe 訂閱價格 ID）' },
      { status: 503 }
    );
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, subscription: true, stripeCustomerId: true },
  });
  if (!user) {
    return NextResponse.json({ message: '用戶不存在' }, { status: 404 });
  }
  if (user.subscription === 'PAID') {
    return NextResponse.json({ message: '您已是訂閱會員' }, { status: 400 });
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

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/subscription`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return NextResponse.json({ url: session.url });
}
