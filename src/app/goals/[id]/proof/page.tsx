import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import ProofUploadForm from './ProofUploadForm';

export default async function ProofUploadPage({
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
    include: { proof: true },
  });

  if (!goal) notFound();
  if (goal.status !== 'ACTIVE' && goal.status !== 'FAILED') {
    return (
      <div className="card">
        <p>{t('goals.goalEnded', locale)}</p>
        <Link href={`/goals/${goal.id}`} className="btn-secondary mt-4">
          {t('goals.backToDetail', locale)}
        </Link>
      </div>
    );
  }
  if (goal.proof) {
    return (
      <div className="card">
        <p>{t('goals.proofAlreadyUploaded', locale)}</p>
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
      <h1 className="text-2xl font-bold text-slate-800">{t('goals.uploadProofTitle', locale)}</h1>
      <p className="text-slate-600">{goal.title}</p>
      <ProofUploadForm goalId={goal.id} locale={locale} />
    </div>
  );
}
