'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Global client error:', error);
    }
  }, [error]);

  return (
    <html lang="zh-Hant">
      <body className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md rounded-lg border border-amber-200 bg-white p-6 shadow-lg text-center">
          <h1 className="text-xl font-semibold text-slate-800">發生錯誤</h1>
          <p className="mt-2 text-slate-600">
            應用程式發生問題，請重新整理頁面。
          </p>
          <button
            onClick={reset}
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            重新整理
          </button>
        </div>
      </body>
    </html>
  );
}
