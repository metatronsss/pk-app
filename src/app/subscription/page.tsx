import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import UpgradeButton from './UpgradeButton';

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const [{ success }, user, locale] = await Promise.all([
    searchParams.then((s) => s),
    getSessionUser(),
    getLocale(),
  ]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('subscription.pleaseLogin', locale)}</p>
      </div>
    );
  }

  const isPaid = user.subscription === 'PAID';

  return (
    <div className="max-w-2xl space-y-8">
      <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
        {t('subscription.backDashboard', locale)}
      </Link>
      {success === '1' && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-teal-800">
          {t('subscription.success', locale)}
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-800">{t('subscription.plans', locale)}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div
          className={`card ${!isPaid ? 'ring-2 ring-teal-500' : ''}`}
        >
          <h2 className="font-semibold text-slate-800">{t('subscription.free', locale)}</h2>
          <p className="mt-2 text-3xl font-bold text-slate-700">$0</p>
          <p className="mt-1 text-sm text-slate-500">{t('subscription.perMonth', locale)}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• {t('subscription.freeFeature1', locale)}</li>
            <li>• {t('subscription.freeFeature2', locale)}</li>
            <li>• {t('subscription.freeFeature3', locale)}</li>
            <li>• {t('subscription.freeRefund', locale)}</li>
            <li>• {t('subscription.freeCoach', locale)}</li>
          </ul>
          {!isPaid && (
            <p className="mt-4 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {t('subscription.currentPlan', locale)}
            </p>
          )}
        </div>

        <div
          className={`card ${isPaid ? 'ring-2 ring-amber-500' : ''}`}
        >
          <h2 className="font-semibold text-slate-800">{t('subscription.pro', locale)}</h2>
          <p className="mt-2 text-3xl font-bold text-amber-600">$10</p>
          <p className="mt-1 text-sm text-slate-500">{t('subscription.perMonth', locale)}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• {t('subscription.proFeature1', locale)}</li>
            <li>• {t('subscription.proRefund', locale)}</li>
            <li>• {t('subscription.proFeature3', locale)}</li>
            <li>• {t('subscription.proFeature4', locale)}</li>
          </ul>
          {isPaid ? (
            <p className="mt-4 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              {t('subscription.currentPlan', locale)}
            </p>
          ) : (
            <div className="mt-4">
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-medium">{t('subscription.stripeNote', locale)}</p>
        <p className="mt-1 text-sm">
          {t('subscription.stripeEnv', locale)} <code className="rounded bg-amber-100 px-1">.env</code>:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm">
          <li><code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code></li>
          <li><code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code></li>
          <li><code className="rounded bg-amber-100 px-1">STRIPE_PRICE_ID</code></li>
        </ul>
        <p className="mt-2 text-sm">
          {t('subscription.stripeHint', locale)}
        </p>
      </div>
    </div>
  );
}
