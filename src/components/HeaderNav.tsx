'use client';

import Link from 'next/link';
import { useState } from 'react';
import HeaderClient from './HeaderClient';

type Props = {
  session: { user?: { name?: string | null; email?: string | null } } | null;
  user: { name?: string | null; email?: string | null; subscription: string } | null;
};

function CoachLink({ hasReminder }: { hasReminder?: boolean }) {
  return (
    <Link href="/coach" className="text-slate-600 hover:text-teal-700 whitespace-nowrap relative inline-flex items-center">
      Coach
      {hasReminder && (
        <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5" aria-label="有提醒">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 text-[10px] text-white items-center justify-center font-bold">!</span>
        </span>
      )}
    </Link>
  );
}

export default function HeaderNav({ session, user, hasCoachReminder }: Props) {
  const [open, setOpen] = useState(false);
  const isLoggedIn = !!session?.user?.email;

  return (
    <>
      {/* Hamburger - mobile only */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        aria-label="選單"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4 flex-wrap">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="text-slate-600 hover:text-teal-700 whitespace-nowrap">Dashboard</Link>
            <Link href="/goals" className="text-slate-600 hover:text-teal-700 whitespace-nowrap">目標</Link>
            <CoachLink hasReminder={hasCoachReminder} />
            <Link href="/shop" className="text-slate-600 hover:text-teal-700 whitespace-nowrap">商城</Link>
            <Link href="/payment" className="text-slate-600 hover:text-teal-700 whitespace-nowrap">付款</Link>
            <Link href="/subscription" className="text-slate-600 hover:text-teal-700 whitespace-nowrap">訂閱</Link>
            {user && <HeaderClient user={user} />}
          </>
        ) : (
          <>
            <Link href="/login" className="text-slate-600 hover:text-teal-700">登入</Link>
            <Link href="/register" className="btn-primary text-sm">註冊</Link>
          </>
        )}
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden z-50 py-4 px-4 flex flex-col gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">Dashboard</Link>
              <Link href="/goals" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">目標</Link>
              <Link href="/coach" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2 flex items-center gap-1" title={hasCoachReminder ? 'Coach 有提醒' : undefined}>
              Coach
              {hasCoachReminder && <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">!</span>}
            </Link>
              <Link href="/shop" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">商城</Link>
              <Link href="/payment" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">付款方式</Link>
              <Link href="/subscription" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">訂閱方案</Link>
              {user && (
                <div className="pt-2 border-t border-slate-100">
                  <HeaderClient user={user} />
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-slate-600 hover:text-teal-700 py-2">登入</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="btn-primary">註冊</Link>
            </>
          )}
        </nav>
      )}
    </>
  );
}
