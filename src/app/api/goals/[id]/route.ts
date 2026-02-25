import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUserId } from '@/lib/auth';
import { z } from 'zod';

const patchBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const parsed = patchBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid body', errors: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { title, description } = parsed.data;

  const goal = await prisma.goal.findFirst({
    where: { id, userId },
  });
  if (!goal) {
    return NextResponse.json({ message: '目標不存在' }, { status: 404 });
  }
  if (goal.status !== 'ACTIVE') {
    return NextResponse.json(
      { message: '僅進行中的目標可編輯' },
      { status: 400 }
    );
  }

  await prisma.goal.update({
    where: { id },
    data: { title, description },
  });

  return NextResponse.json({ success: true });
}
