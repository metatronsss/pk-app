import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';

export default async function HomePage() {
  const [session, locale] = await Promise.all([
    getServerSession(authOptions),
    getLocale(),
  ]);

  return (
    <div className="space-y-8 text-center">
      <Image
        src="/pk_logo.png"
        alt="Procrastination Killer"
        width={160}
        height={160}
        className="mx-auto rounded-2xl"
        priority
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 px-2">
        {t('home.headline', locale)}
      </h1>
      <p className="text-base sm:text-lg text-slate-600 px-2 break-words">
        {t('app.taglineShort', locale)}
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {session?.user?.email ? (
          <>
            <Link href="/dashboard" className="btn-primary">
              {t('home.enterDashboard', locale)}
            </Link>
            <Link href="/goals" className="btn-secondary">
              {t('home.setGoals', locale)}
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-primary">
              {t('home.login', locale)}
            </Link>
            <Link href="/register" className="btn-secondary">
              {t('home.register', locale)}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
