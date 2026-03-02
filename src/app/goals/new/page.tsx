import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isStripeEnabled } from '@/lib/stripe';
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

  const needsCard = isStripeEnabled && !user.stripePaymentMethodId;

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
      {needsCard ? (
        <div className="card text-amber-800 bg-amber-50 border-amber-200">
          <p className="font-medium">請先綁定信用卡</p>
          <p className="mt-1 text-sm">建立目標需預授權處罰金額，請先至付款方式綁定信用卡。</p>
          <Link href="/payment" className="mt-3 inline-block btn-primary">
            前往綁定信用卡
          </Link>
        </div>
      ) : !canAdd ? (
        <div className="card text-amber-800 bg-amber-50">
          <p>本月已達 3 個目標上限，請下月再新增。</p>
        </div>
      ) : (
        <GoalForm userId={user.id} />
      )}
    </div>
  );
}
