'use client';

import { getCsrfToken } from 'next-auth/react';
import { useState, useEffect } from 'react';

type Props = {
  user: { name?: string | null; email?: string | null; subscription: string };
};

export default function HeaderClient({ user }: Props) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? null));
  }, []);

  const displayName = user.name ? `Hi, ${user.name}` : (user.email ?? '');
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
      {csrfToken ? (
        <form method="POST" action="/api/auth/signout" className="inline">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <input type="hidden" name="callbackUrl" value="/" />
          <button
            type="submit"
            className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer bg-transparent border-none"
          >
            登出
          </button>
        </form>
      ) : (
        <span className="text-sm text-slate-400">登出</span>
      )}
    </div>
  );
}
