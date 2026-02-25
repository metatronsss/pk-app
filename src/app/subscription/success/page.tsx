import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeEnabled } from '@/lib/stripe';

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const userId = await getSessionUserId();

  if (!userId) {
    redirect('/login');
  }

  if (!session_id || !isStripeEnabled || !stripe) {
    return (
      <div className="card">
        <p>無效的結帳 session。</p>
        <Link href="/subscription" className="btn-primary mt-4">
          回訂閱方案
        </Link>
      </div>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['subscription'],
  });

  if (session.customer_email) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (dbUser?.email !== session.customer_email) {
      return (
        <div className="card">
          <p>此結帳 session 與當前登入帳號不符。</p>
          <Link href="/subscription" className="btn-primary mt-4">
            回訂閱方案
          </Link>
        </div>
      );
    }
  }

  if (session.payment_status === 'paid' && session.subscription) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscription: 'PAID' },
    });
  }

  redirect('/subscription?success=1');
}
