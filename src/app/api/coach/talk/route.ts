import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getKeywordReply, getDefaultReply } from '@/lib/coach-responses';

const KEYWORDS = ['完成', '證明', '退款', '拖延', '目標', '教練'];

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const message = (body.message ?? '').trim();
  if (!message) {
    return NextResponse.json({ reply: '說點什麼吧～' });
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { userId },
  });
  const coachType = (coach?.coachType ?? 'friend') as 'family' | 'friend' | 'lover';
  const coachGender = (coach?.coachGender ?? 'male') as 'male' | 'female';

  let reply = '';
  for (const keyword of KEYWORDS) {
    if (message.includes(keyword)) {
      reply = getKeywordReply(keyword, coachType, coachGender) ?? '';
      if (reply) break;
    }
  }
  if (!reply) {
    reply = getDefaultReply(coachType, coachGender);
  }

  await prisma.coachProfile.upsert({
    where: { userId },
    update: { lastGreetingAt: new Date() },
    create: {
      userId,
      coachType: 'friend',
      coachGender: 'male',
      affinity: 0,
      lastGreetingAt: new Date(),
      unlockedItems: '[]',
    },
  });

  return NextResponse.json({ reply });
}
