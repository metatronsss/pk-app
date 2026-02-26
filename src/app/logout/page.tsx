'use client';

import { useEffect } from 'react';

/**
 * 登出頁：立即導向自訂 /api/logout
 * Safari 可能不處理 NextAuth signOut 的 cookie 清除，改用自訂 API 強制清除
 */
export default function LogoutPage() {
  useEffect(() => {
    window.location.href = '/api/logout';
  }, []);

  return (
    <div className="card max-w-sm text-center">
      <p className="text-slate-600">登出中…</p>
    </div>
  );
}
