import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

export default async function GoalDetailPage({
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

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/goals" className="text-sm text-teal-600 hover:underline">
        {t('goals.backToList', locale)}
      </Link>
      <div className="card">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">{goal.title}</h1>
        <p className="mt-2 text-slate-600 break-words">{goal.description}</p>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="text-slate-500">{t('goals.dueDate', locale)}</dt>
            <dd>{format(goal.dueAt, 'yyyy/MM/dd HH:mm', { locale: zhTW })}</dd>
          </div>
          <div>
            <dt className="text-slate-500">{t('goals.penalty', locale)}</dt>
            <dd>$ {(goal.penaltyCents / 100).toFixed(2)} USD</dd>
          </div>
          <div>
            <dt className="text-slate-500">{t('goals.status', locale)}</dt>
            <dd>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  goal.status === 'ACTIVE'
                    ? 'bg-amber-100 text-amber-800'
                    : goal.status === 'COMPLETED'
                      ? 'bg-teal-100 text-teal-800'
                      : goal.status === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : goal.status === 'REFUND_PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : goal.status === 'REFUNDED'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-slate-100 text-slate-600'
                }`}
              >
                {goal.status === 'ACTIVE' && '進行中'}
                {goal.status === 'COMPLETED' && '已完成'}
                {goal.status === 'FAILED' && '未完成'}
                {goal.status === 'REFUND_PENDING' && '待退款（60 天後）'}
                {goal.status === 'REFUNDED' && '已退款'}
              </span>
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-slate-400">
          {t('goals.storageNote', locale)}
        </p>
        {goal.proof && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">{t('goals.proofUploaded', locale)}</p>
            <p className="text-xs text-slate-500">
              {t('goals.proofType', locale)}：{goal.proof.type} · {t('goals.proofStatus', locale)}：{goal.proof.status}
            </p>
            {goal.proof.url && (
              <a
                href={goal.proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-teal-600 hover:underline"
              >
                {t('goals.viewProof', locale)}
              </a>
            )}
          </div>
        )}
        <div className="mt-6 flex gap-2">
          {goal.status === 'ACTIVE' && (
            <Link href={`/goals/${goal.id}/edit`} className="btn-secondary">
              {t('goals.editThemeDescBtn', locale)}
            </Link>
          )}
          {(goal.status === 'ACTIVE' || goal.status === 'FAILED') && !goal.proof && (
            <Link href={`/goals/${goal.id}/proof`} className="btn-primary">
              {goal.status === 'FAILED' ? t('goals.uploadProofRefund', locale) : t('goals.uploadProof', locale)}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
