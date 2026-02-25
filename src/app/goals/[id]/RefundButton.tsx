'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RefundButton({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefund = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/refund/${goalId}`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || '申請失敗');
      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '申請失敗');
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
        type="button"
        onClick={handleRefund}
        disabled={loading}
        className="btn-secondary"
      >
        {loading ? '處理中…' : '補完成並申請退款'}
      </button>
    </div>
  );
}
