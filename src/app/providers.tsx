'use client';

import { SessionProvider } from 'next-auth/react';
import DailyLoginChecker from '@/components/DailyLoginChecker';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DailyLoginChecker />
      {children}
    </SessionProvider>
  );
}
