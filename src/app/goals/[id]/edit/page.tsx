import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GoalEditForm from './GoalEditForm';

export default async function GoalEditPage({
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

  const goal = await prisma.goal.findFirst({
    where: { id, userId: user.id },
  });

  if (!goal) notFound();
  if (goal.status !== 'ACTIVE') {
    return (
      <div className="card">
        <p>僅進行中的目標可編輯主題與描述。</p>
        <Link href={`/goals/${goal.id}`} className="btn-secondary mt-4">
          回目標詳情
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link href={`/goals/${goal.id}`} className="text-sm text-teal-600 hover:underline">
        ← 回目標詳情
      </Link>
      <h1 className="text-2xl font-bold text-slate-800">編輯目標</h1>
      <p className="text-sm text-slate-500">
        僅可修改目標主題與具體描述，截止日期與處罰金額無法變更。
      </p>
      <GoalEditForm goalId={goal.id} title={goal.title} description={goal.description} />
    </div>
  );
}
