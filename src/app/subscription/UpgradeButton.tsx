'use client';

import { useState } from 'react';

export default function UpgradeButton() {
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
        setError(data.message ?? '無法建立結帳連結');
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError('未取得結帳連結');
    } catch {
      setError('連線失敗');
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
        {loading ? '處理中…' : '升級訂閱 $10/月'}
      </button>
    </div>
  );
}
