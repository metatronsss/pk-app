import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { penalizeOverdueGoals } from '@/lib/penalize';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { startOfMonth, subMonths } from 'date-fns';
import { stripe, isStripeEnabled, toStripeAmount } from '@/lib/stripe';
import { affinityGainFromGoalCompletion, clampAffinity } from '@/lib/affinity';

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const contentType = request.headers.get('content-type') ?? '';

  let goalId: string;
  let type: string;
  let url: string;

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    goalId = form.get('goalId') as string;
    type = form.get('type') as string;
    const file = form.get('file') as File;
    if (!goalId || !type || !file) {
      return NextResponse.json(
        { message: '缺少 goalId / type / file' },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const buf = Buffer.from(bytes);
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });
    const filename = `${goalId}-${Date.now()}-${file.name}`;
    const filepath = path.join(dir, filename);
    await writeFile(filepath, buf);
    url = `/uploads/${filename}`;
  } else {
    const body = await request.json();
    goalId = body.goalId;
    type = body.type ?? 'link';
    url = body.url ?? '';
    if (!goalId || !url) {
      return NextResponse.json(
        { message: '缺少 goalId 或 url' },
        { status: 400 }
      );
    }
  }

  await penalizeOverdueGoals();

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: { proof: true },
  });
  if (!goal) {
    return NextResponse.json({ message: '目標不存在' }, { status: 404 });
  }
  if (goal.status !== 'ACTIVE' && goal.status !== 'FAILED') {
    return NextResponse.json({ message: '目標已結束' }, { status: 400 });
  }
  if (goal.proof) {
    return NextResponse.json({ message: '已上傳過證明' }, { status: 400 });
  }

  const isFailed = goal.status === 'FAILED';

  if (isFailed) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true, balance: true },
    });
    if (!user) {
      return NextResponse.json({ message: '用戶不存在' }, { status: 404 });
    }
    const now = new Date();
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = startOfMonth(now);
    const isLastMonth = goal.dueAt >= lastMonthStart && goal.dueAt < lastMonthEnd;
    if (user.subscription === 'FREE' && !isLastMonth) {
      return NextResponse.json(
        { message: '免費用戶僅能退上個月遞延目標的款' },
        { status: 400 }
      );
    }
    if (isStripeEnabled && stripe && goal.stripeChargeId) {
      try {
        await stripe.refunds.create({
          charge: goal.stripeChargeId,
          amount: toStripeAmount(goal.penaltyCents),
        });
      } catch (e: unknown) {
        const err = e as { message?: string };
        return NextResponse.json(
          { message: err.message ?? 'Stripe 退款失敗' },
          { status: 500 }
        );
      }
    } else if (!goal.stripeChargeId) {
      if (user.balance < goal.penaltyCents) {
        return NextResponse.json({ message: '餘額不足，無法退款' }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: goal.penaltyCents } },
      });
    }
  }

  const proof = await prisma.proof.create({
    data: {
      goalId,
      userId,
      type,
      url,
      status: 'APPROVED',
      reviewedAt: new Date(),
    },
  });

  if (!isFailed && isStripeEnabled && stripe && goal.stripePaymentIntentId) {
    try {
      await stripe.paymentIntents.cancel(goal.stripePaymentIntentId);
    } catch {
      // PI may already be expired/cancelled
    }
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: { status: isFailed ? 'REFUNDED' : 'COMPLETED' },
  });

  const pointsEarned = Math.min(50, Math.floor(goal.penaltyCents / 100) + 10);
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: pointsEarned } },
  });

  const affinityGain = affinityGainFromGoalCompletion(goal.penaltyCents);
  const coach = await prisma.coachProfile.findUnique({
    where: { userId },
  });
  const newAffinity = clampAffinity((coach?.affinity ?? 0) + affinityGain);
  await prisma.coachProfile.upsert({
    where: { userId },
    update: { affinity: newAffinity },
    create: {
      userId,
      coachType: 'friend',
      coachGender: 'male',
      affinity: newAffinity,
      unlockedItems: '[]',
    },
  });

  return NextResponse.json(proof);
}
