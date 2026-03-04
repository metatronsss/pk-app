import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import { isStripeEnabled } from '@/lib/stripe';
import GoalForm from './GoalForm';

export default async function NewGoalPage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
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
      <h1 className="text-2xl font-bold text-slate-800">{t('goals.newGoal', locale)}</h1>
      {needsCard ? (
        <div className="card text-amber-800 bg-amber-50 border-amber-200">
          <p className="font-medium">{t('goals.paymentPrompt', locale)}</p>
          <p className="mt-1 text-sm">{t('goals.bindCardFirst', locale)}</p>
          <Link href="/payment" className="mt-3 inline-block btn-primary">
            {t('goals.goToPayment', locale)}
          </Link>
        </div>
      ) : !canAdd ? (
        <div className="card text-amber-800 bg-amber-50">
          <p>{t('goals.monthLimit', locale)}</p>
        </div>
      ) : (
        <GoalForm userId={user.id} />
      )}
    </div>
  );
}
