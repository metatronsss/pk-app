'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';

export default function SubscriptionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  return (
    <div className="card max-w-xl">
      <h2 className="text-lg font-semibold text-red-700">{t('subscription.loadError', locale)}</h2>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <div className="mt-4 flex gap-2">
        <button onClick={reset} className="btn-primary">
          {t('common.retry', locale)}
        </button>
        <Link href="/dashboard" className="btn-secondary">
          {t('subscription.backDashboard', locale)}
        </Link>
      </div>
    </div>
  );
}
