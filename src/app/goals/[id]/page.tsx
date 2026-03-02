import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { penalizeOverdueGoals } from '@/lib/penalize';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import RefundButton from './RefundButton';

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  await penalizeOverdueGoals();

  const goal = await prisma.goal.findFirst({
    where: { id, userId: user.id },
    include: { proof: true },
  });

  if (!goal) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/goals" className="text-sm text-teal-600 hover:underline">
        ← 回目標列表
      </Link>
      <div className="card">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{goal.title}</h1>
        <p className="mt-2 text-slate-600 break-words">{goal.description}</p>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="text-slate-500">截止時間</dt>
            <dd>{format(goal.dueAt, 'yyyy/MM/dd HH:mm', { locale: zhTW })}</dd>
          </div>
          <div>
            <dt className="text-slate-500">處罰金額</dt>
            <dd>$ {(goal.penaltyCents / 100).toFixed(2)} USD</dd>
          </div>
          <div>
            <dt className="text-slate-500">狀態</dt>
            <dd>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  goal.status === 'ACTIVE'
                    ? 'bg-amber-100 text-amber-800'
                    : goal.status === 'COMPLETED'
                      ? 'bg-teal-100 text-teal-800'
                      : goal.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-600'
                }`}
              >
                {goal.status === 'ACTIVE' && '進行中'}
                {goal.status === 'COMPLETED' && '已完成'}
                {goal.status === 'FAILED' && '未完成'}
                {goal.status === 'REFUNDED' && '已退款'}
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-slate-400">
          儲存後日期與處罰金額無法調整
        </p>
        {goal.proof && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">已上傳證明</p>
            <p className="text-xs text-slate-500">
              類型：{goal.proof.type} · 狀態：{goal.proof.status}
            </p>
            {goal.proof.url && (
              <a
                href={goal.proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-teal-600 hover:underline"
              >
                查看證明
              </a>
            )}
          </div>
        )}
        <div className="mt-6 flex gap-2">
          {goal.status === 'ACTIVE' && (
            <Link href={`/goals/${goal.id}/edit`} className="btn-secondary">
              編輯主題與描述
            </Link>
          )}
          {goal.status === 'ACTIVE' && !goal.proof && (
            <Link href={`/goals/${goal.id}/proof`} className="btn-primary">
              上傳證明
            </Link>
          )}
          {goal.status === 'FAILED' && goal.refundable && (
            <RefundButton goalId={goal.id} />
          )}
        </div>
      </div>
    </div>
  );
}
