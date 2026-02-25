import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const shopItemId = body.shopItemId as string | undefined;
  if (!shopItemId) {
    return NextResponse.json({ message: '缺少道具 ID' }, { status: 400 });
  }

  const [user, item, coach] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { points: true } }),
    prisma.shopItem.findUnique({ where: { id: shopItemId } }),
    prisma.coachProfile.findUnique({ where: { userId }, select: { affinity: true } }),
  ]);

  if (!user || !item) {
    return NextResponse.json({ message: '道具不存在' }, { status: 404 });
  }

  const affinity = coach?.affinity ?? 0;
  if (affinity < item.affinityRequired) {
    return NextResponse.json({ message: '好感度不足' }, { status: 400 });
  }

  if (user.points < item.pointsCost) {
    return NextResponse.json({ message: '積分不足' }, { status: 400 });
  }

  const existing = await prisma.userItem.findUnique({
    where: { userId_shopItemId: { userId, shopItemId } },
  });
  if (existing) {
    return NextResponse.json({ message: '已擁有此道具' }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: item.pointsCost } },
    }),
    prisma.userItem.create({
      data: { userId, shopItemId },
    }),
  ]);

  return NextResponse.json({ success: true });
}
