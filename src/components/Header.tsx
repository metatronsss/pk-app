import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { penalizeOverdueGoals } from '@/lib/penalize';
import { hasCoachReminders } from '@/lib/coach-reminder';
import { getLocale } from '@/lib/locale-server';
import HeaderNav from './HeaderNav';
import LanguageSwitch from './LanguageSwitch';

export default async function Header() {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);
  const user = await getSessionUser();

  let hasCoachReminder = false;
  if (user) {
    const activeGoals = await prisma.goal.findMany({
      where: { userId: user.id, status: 'ACTIVE', proof: null },
      select: { dueAt: true },
    });
    hasCoachReminder = hasCoachReminders(activeGoals);
  }

  return (
    <header className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 min-w-0 overflow-hidden py-2 md:py-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-teal-700 shrink-0">
          <Image src="/pk_logo.png" alt="PK" width={36} height={36} className="rounded-lg" />
          <span>PK yourself</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap justify-end">
          <HeaderNav
            session={session}
            user={user ? { name: user.name, email: user.email, subscription: user.subscription ?? 'FREE' } : null}
            hasCoachReminder={hasCoachReminder}
          />
          <LanguageSwitch currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}
