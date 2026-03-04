'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { t, mapApiErrorToMessage } from '@/lib/i18n';

export default function RefundButton({ goalId }: { goalId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [error]);

  const handleRefund = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/refund/${goalId}`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const raw = (data.message as string) || '申請失敗';
        throw new Error(mapApiErrorToMessage(raw, locale));
      }
      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('goals.refundFailed', locale));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div ref={errorRef} role="alert" className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleRefund}
        disabled={loading}
        className="btn-secondary"
      >
        {loading ? t('goals.refundProcessing', locale) : t('goals.refundButton', locale)}
      </button>
    </div>
  );
}
