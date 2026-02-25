import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default async function DashboardPage() {
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
  const balanceUsd = (user.balance / 100).toFixed(2);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">
        {user.name ? `${user.name}，歡迎回來` : 'Dashboard'}
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="text-sm text-slate-500">可退金額（已處罰）</p>
          <p className="text-2xl font-bold text-teal-700">$ {balanceUsd} USD</p>
          <Link href="/goals?filter=failed" className="mt-2 text-sm text-teal-600 hover:underline">
            完成目標拿回 →
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">積分</p>
          <p className="text-2xl font-bold text-amber-600">{user.points}</p>
          <Link href="/shop" className="mt-2 text-sm text-amber-600 hover:underline">
            商城兌換道具 →
          </Link>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">進行中目標</p>
          <p className="text-2xl font-bold text-slate-800">{activeGoals.length}</p>
          <Link href="/goals" className="mt-2 text-sm text-slate-600 hover:underline">
            管理目標 →
          </Link>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 font-semibold">本月目標</h2>
        {goals.length === 0 ? (
          <p className="text-slate-500">尚無目標，先設定一個吧。</p>
        ) : (
          <ul className="space-y-3">
            {goals.map((g) => (
              <li
                key={g.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <Link href={`/goals/${g.id}`} className="font-medium hover:text-teal-700">
                    {g.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    截止 {format(g.dueAt, 'MM/dd', { locale: zhTW })} · 處罰 $ {(g.penaltyCents / 100).toFixed(2)} USD
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    g.status === 'ACTIVE'
                      ? 'bg-amber-100 text-amber-800'
                      : g.status === 'COMPLETED'
                        ? 'bg-teal-100 text-teal-800'
                        : g.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {g.status === 'ACTIVE' && '進行中'}
                  {g.status === 'COMPLETED' && '已完成'}
                  {g.status === 'FAILED' && '未完成'}
                  {g.status === 'REFUNDED' && '已退款'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Link href="/goals/new" className="btn-primary">
            新增目標
          </Link>
        </div>
      </div>
    </div>
  );
}
