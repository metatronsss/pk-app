import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import GoalEditForm from './GoalEditForm';

export default async function GoalEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
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
        <p>{t('goals.onlyActiveEditable', locale)}</p>
        <Link href={`/goals/${goal.id}`} className="btn-secondary mt-4">
          {t('goals.backToDetail', locale)}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <Link href={`/goals/${goal.id}`} className="text-sm text-teal-600 hover:underline">
        {t('goals.backToDetail', locale)}
      </Link>
      <h1 className="text-2xl font-bold text-slate-800">{t('goals.editGoal', locale)}</h1>
      <p className="text-sm text-slate-500">
        {t('goals.editThemeDesc', locale)}
      </p>
      <GoalEditForm goalId={goal.id} title={goal.title} description={goal.description} locale={locale} />
    </div>
  );
}
