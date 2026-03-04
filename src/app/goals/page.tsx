import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default async function GoalsPage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
      </div>
    );
  }

  const goals = await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: { dueAt: 'desc' },
    include: { proof: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{t('goals.myGoals', locale)}</h1>
        <Link href="/goals/new" className="btn-primary">
          {t('goals.addGoal', locale)}
        </Link>
      </div>

      <p className="text-slate-600">
        {t('goals.desc', locale)}
      </p>

      {goals.length === 0 ? (
        <div className="card text-center text-slate-500">
          <p>{t('goals.noGoals', locale)}</p>
          <Link href="/goals/new" className="btn-primary mt-4">
            {t('goals.setFirst', locale)}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {goals.map((g) => (
            <li key={g.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <Link href={`/goals/${g.id}`} className="text-lg font-semibold text-teal-800 hover:underline break-words">
                    {g.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{g.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {t('goals.dueLabel', locale)} {format(g.dueAt, 'yyyy/MM/dd HH:mm', { locale: zhTW })} · {t('goals.penalty', locale)} $ {(g.penaltyCents / 100).toFixed(2)} USD
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    g.status === 'ACTIVE'
                      ? 'bg-amber-100 text-amber-800'
                      : g.status === 'COMPLETED'
                        ? 'bg-teal-100 text-teal-800'
                        : g.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : g.status === 'REFUND_PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : g.status === 'REFUNDED'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {g.status === 'ACTIVE' && t('dashboard.statusActive', locale)}
                  {g.status === 'COMPLETED' && t('dashboard.statusCompleted', locale)}
                  {g.status === 'FAILED' && t('dashboard.statusFailed', locale)}
                  {g.status === 'REFUND_PENDING' && t('dashboard.statusRefundPending', locale)}
                  {g.status === 'REFUNDED' && t('dashboard.statusRefunded', locale)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/goals/${g.id}`} className="btn-secondary text-sm">
                  {t('common.detail', locale)}
                </Link>
                {g.status === 'ACTIVE' && (
                  <Link href={`/goals/${g.id}/edit`} className="btn-secondary text-sm">
                    {t('common.edit', locale)}
                  </Link>
                )}
                {(g.status === 'ACTIVE' || g.status === 'FAILED') && !g.proof && (
                  <Link href={`/goals/${g.id}/proof`} className="btn-primary text-sm">
                    {g.status === 'FAILED' ? t('goals.uploadProofRefund', locale) : t('goals.uploadProof', locale)}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
