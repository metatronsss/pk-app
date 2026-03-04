'use client';

import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';

type Props = {
  user: { name?: string | null; email?: string | null; subscription: string };
};

export default function HeaderClient({ user }: Props) {
  const locale = useLocale();
  const hi = t('user.hi', locale);
  const displayName = user.name ? `${hi}, ${user.name}` : (user.email ?? '');

  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
      <span className="text-sm font-medium text-slate-700 truncate max-w-[90px] sm:max-w-[140px] md:max-w-[200px]">
        {displayName}
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            user.subscription === 'PAID'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {user.subscription === 'PAID' ? t('user.proMember', locale) : t('user.freeMember', locale)}
        </span>
      </span>
      <Link
        href="/logout"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        {t('user.logout', locale)}
      </Link>
    </div>
  );
}
