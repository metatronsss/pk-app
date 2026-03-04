import Link from 'next/link';
import { unstable_noStore } from 'next/cache';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  unstable_noStore();
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  const goals = await prisma.goal.findMany({
    where: { userId: user.id },
    orderBy: { dueAt: 'asc' },
    include: { proof: true },
  });

  const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
  const failedRefundable = goals.filter((g) => g.status === 'FAILED' && g.refundable);
  const refundPending = goals.filter((g) => g.status === 'REFUND_PENDING');
  const refundableCents =
    user.balance +
    failedRefundable
      .filter((g) => g.stripeChargeId)
      .reduce((sum, g) => sum + g.penaltyCents, 0) +
    refundPending
      .filter((g) => g.stripeChargeId)
      .reduce((sum, g) => sum + g.penaltyCents, 0);
  const balanceUsd = (refundableCents / 100).toFixed(2);

  return (
    <div className="space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
        {user.name ? `${user.name}，${t('dashboard.welcome', locale)}` : t('nav.dashboard', locale)}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">{t('dashboard.penalizedRefundable', locale)}</p>
          <p className="text-2xl font-bold text-teal-700">$ {balanceUsd} USD</p>
          <Link href="/goals?filter=failed" className="mt-2 text-sm text-teal-600 hover:underline">
            {t('dashboard.getBackByComplete', locale)}
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">{t('dashboard.points', locale)}</p>
          <p className="text-2xl font-bold text-amber-600">{user.points}</p>
          <Link href="/shop" className="mt-2 text-sm text-amber-600 hover:underline">
            {t('dashboard.shopExchange', locale)}
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">{t('dashboard.activeGoals', locale)}</p>
          <p className="text-2xl font-bold text-slate-800">{activeGoals.length}</p>
          <Link href="/goals" className="mt-2 text-sm text-slate-600 hover:underline">
            {t('dashboard.manageGoals', locale)}
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">{t('dashboard.thisMonthGoals', locale)}</h2>
        {goals.length === 0 ? (
          <p className="text-slate-500">{t('dashboard.noGoals', locale)}</p>
        ) : (
          <ul className="space-y-3">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-100 p-3"
              >
                <div className="min-w-0 flex-1">
                  <Link href={`/goals/${g.id}`} className="font-medium hover:text-teal-700 break-words">
                    {g.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {t('goals.deadline', locale)} {format(g.dueAt, 'MM/dd', { locale: dateLocale })} · {t('goals.penalty', locale)} $ {(g.penaltyCents / 100).toFixed(2)} USD
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${
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
                  {g.status === 'ACTIVE' && '進行中'}
                  {g.status === 'COMPLETED' && '已完成'}
                  {g.status === 'FAILED' && '未完成'}
                  {g.status === 'REFUND_PENDING' && '待退款'}
                  {g.status === 'REFUNDED' && '已退款'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Link href="/goals/new" className="btn-primary">
            {t('dashboard.addGoal', locale)}
          </Link>
        </div>
      </div>
    </div>
  );
}
