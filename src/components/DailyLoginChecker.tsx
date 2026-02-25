'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function DailyLoginChecker() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/user/daily-login', { method: 'POST' }).catch(() => {});
  }, [status]);

  return null;
}
