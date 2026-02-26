'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';

type Props = {
  user: { name?: string | null; email?: string | null; subscription: string };
};

export default function HeaderClient({ user }: Props) {
  const [loggingOut, setLoggingOut] = useState(false);
  const displayName = user.name ? `Hi, ${user.name}` : (user.email ?? '');

  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-sm font-medium text-slate-700 truncate max-w-[120px] sm:max-w-none">
        {displayName}
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            user.subscription === 'PAID'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {user.subscription === 'PAID' ? '訂閱會員' : '免費'}
        </span>
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loggingOut}
        className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer bg-transparent border-none disabled:opacity-50"
      >
        {loggingOut ? '登出中…' : '登出'}
      </button>
    </div>
  );
}
