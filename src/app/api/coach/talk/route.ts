import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getReply } from '@/lib/coach-responses';
import { getChatGPTReply } from '@/lib/openai-coach';
import type { CoachLocale } from '@/lib/coach-dialogue';

const EMPTY_REPLY: Record<CoachLocale, string> = {
  zh: '說點什麼吧～',
  en: 'Say something~',
  ja: '何か言ってね～',
};

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const message = (body.message ?? '').trim();
  const locale = (['zh', 'en', 'ja'].includes(body.locale) ? body.locale : 'zh') as CoachLocale;
  const history = Array.isArray(body.history) ? body.history : [];
  if (!message) {
    return NextResponse.json({ reply: EMPTY_REPLY[locale] });
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { userId },
  });
  const coachType = (coach?.coachType ?? 'friend') as 'family' | 'friend' | 'lover';
  const coachGender = (coach?.coachGender ?? 'male') as 'male' | 'female';

  // 有 OPENAI_API_KEY 時優先用 ChatGPT，否則用規則回覆
  let reply: string;
  const gptReply = await getChatGPTReply(message, coachType, coachGender, locale, history);
  if (gptReply) {
    reply = gptReply;
  } else {
    console.warn('[Coach talk] ChatGPT returned null, falling back to rules');
    reply = getReply(message, coachType, coachGender, locale);
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
