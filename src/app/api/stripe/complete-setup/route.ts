import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';

/**
 * 當 Stripe redirect 回 /payment?success=1 時，client 會帶 setup_intent_id 呼叫此 API，
 * 將該 PaymentMethod 設為預設並存到 DB。
 */
export async function POST(request: NextRequest) {
  if (!isStripeEnabled || !stripe) {
    return NextResponse.json({ message: 'Stripe 未設定' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const setupIntentId = body.setupIntentId as string;
  if (!setupIntentId) {
    return NextResponse.json({ message: '缺少 setupIntentId' }, { status: 400 });
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const si = await stripe.setupIntents.retrieve(setupIntentId);
  if (si.status !== 'succeeded' || !si.payment_method) {
    return NextResponse.json({ message: 'SetupIntent 未完成' }, { status: 400 });
  }

  const pmId = typeof si.payment_method === 'string' ? si.payment_method : si.payment_method.id;
  const customerId = typeof si.customer === 'string' ? si.customer : si.customer?.id;
  if (!customerId) {
    return NextResponse.json({ message: '無 Customer' }, { status: 400 });
  }

  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: pmId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId, stripePaymentMethodId: pmId },
  });

  return NextResponse.json({ success: true });
}
