import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PK yourself — Procrastination Killer',
  description: '不夠痛你就不會用。押金 + Refund + AI Coach',
  icons: { icon: '/pk_logo.png' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <Providers>
          <Header />
          <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 overflow-x-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
