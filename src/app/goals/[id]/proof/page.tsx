import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProofUploadForm from './ProofUploadForm';

export default async function ProofUploadPage({
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
    include: { proof: true },
  });

  if (!goal) notFound();
  if (goal.status !== 'ACTIVE') {
    return (
      <div className="card">
        <p>此目標已結束，無法上傳證明。</p>
        <Link href={`/goals/${goal.id}`} className="btn-secondary mt-4">
          回目標詳情
        </Link>
      </div>
    );
  }
  if (goal.proof) {
    return (
      <div className="card">
        <p>已上傳過證明，無需重複上傳。</p>
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
      <h1 className="text-2xl font-bold text-slate-800">上傳完成證明</h1>
      <p className="text-slate-600">{goal.title}</p>
      <ProofUploadForm goalId={goal.id} />
    </div>
  );
}
