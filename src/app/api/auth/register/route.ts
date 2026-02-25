import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, '密碼至少 6 碼'),
  name: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid input', errors: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
  });
  if (existing) {
    return NextResponse.json(
      { message: '此 Email 已註冊' },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || null,
      subscription: 'FREE',
    },
  });

  await prisma.coachProfile.create({
    data: {
      userId: user.id,
      persona: 'friend',
      affection: 50,
      unlockedItems: '[]',
    },
  });

  return NextResponse.json({
    message: '註冊成功',
    user: { id: user.id, email: user.email, name: user.name },
  });
}
