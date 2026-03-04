import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import PenalizeTrigger from '@/components/PenalizeTrigger';
import { LocaleProvider } from '@/components/LocaleProvider';
import { getLocale } from '@/lib/locale-server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PK yourself — Procrastination Killer',
  description: '不夠痛你就不會用。押金 + Refund + AI Coach',
  icons: { icon: '/pk_logo.png' },
};

const LANG_MAP = { zh: 'zh-Hant', en: 'en', ja: 'ja' } as const;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const htmlLang = LANG_MAP[locale] ?? 'zh-Hant';

  return (
    <html lang={htmlLang}>
      <body>
        <Providers>
          <LocaleProvider locale={locale}>
            <PenalizeTrigger />
            <Header />
            <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8 overflow-x-hidden">{children}</main>
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  );
}
