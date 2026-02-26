'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Client error:', error);
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
      <h2 className="text-lg font-semibold text-amber-800">發生錯誤</h2>
      <p className="mt-2 text-sm text-amber-700">
        頁面載入時發生問題，請重新整理試試。
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
      >
        再試一次
      </button>
    </div>
  );
}
