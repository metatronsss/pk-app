'use client';

import { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';

export default function UpgradeButton() {
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? t('subscription.errorCheckout', locale));
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(t('subscription.errorNoUrl', locale));
    } catch {
      setError(t('subscription.errorNetwork', locale));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <p className="mb-2 text-sm text-red-600">{error}</p>
      )}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? t('subscription.processing', locale) : t('subscription.upgradeBtn', locale)}
      </button>
    </div>
  );
}
