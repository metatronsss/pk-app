import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GoalForm from './GoalForm';

export default async function NewGoalPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  const currentMonthGoals = await prisma.goal.count({
    where: {
      userId: user.id,
      dueAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
      status: 'ACTIVE',
    },
  });

  const canAdd = currentMonthGoals < 3;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">新增目標</h1>
      {!canAdd ? (
        <div className="card text-amber-800 bg-amber-50">
          <p>本月已達 3 個目標上限，請下月再新增。</p>
        </div>
      ) : (
        <GoalForm userId={user.id} />
      )}
    </div>
  );
}
