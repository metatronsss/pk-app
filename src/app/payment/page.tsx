import Link from 'next/link';
import { Suspense } from 'react';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import PaymentForm from './PaymentForm';
import PaymentSuccessHandler from './PaymentSuccessHandler';

export default async function PaymentPage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripePaymentMethodId: true },
  });

  const hasCard = !!dbUser?.stripePaymentMethodId;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
        {t('payment.backDashboard', locale)}
      </Link>
      <h1 className="text-2xl font-bold text-slate-800">{t('payment.title', locale)}</h1>
      <p className="text-slate-600">
        {t('payment.bindCard', locale)}
      </p>
      {!publishableKey ? (
        <div className="card rounded-lg border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">{t('payment.stripeNotSet', locale)}</p>
          <p className="mt-1 text-sm">
            {t('payment.addToEnv', locale)}
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            <li><code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></li>
            <li><code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code></li>
          </ul>
          <p className="mt-2 text-sm">
            <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="underline">{t('payment.stripeKeys', locale)}</a>
          </p>
          <Link href="/subscription" className="mt-3 inline-block text-sm text-amber-700 underline">
            {t('payment.subscriptionNeedsStripe', locale)}
          </Link>
        </div>
      ) : hasCard ? (
        <div className="card rounded-lg border-teal-200 bg-teal-50 p-4 text-teal-800">
          <p className="font-medium">{t('payment.cardBound', locale)}</p>
          <p className="mt-1 text-sm">{t('payment.cardNote', locale)}</p>
        </div>
      ) : (
        <>
          <Suspense fallback={null}>
            <PaymentSuccessHandler />
          </Suspense>
          <PaymentForm />
        </>
      )}
    </div>
  );
}
