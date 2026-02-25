import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_TYPES = ['family', 'friend', 'lover'];
const VALID_GENDERS = ['male', 'female'];

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const coachType = body.coachType as string;
  const coachGender = body.coachGender as string;

  if (!VALID_TYPES.includes(coachType) || !VALID_GENDERS.includes(coachGender)) {
    return NextResponse.json({ message: '無效的設定' }, { status: 400 });
  }

  await prisma.coachProfile.upsert({
    where: { userId },
    update: { coachType, coachGender },
    create: {
      userId,
      coachType,
      coachGender,
      affinity: 0,
      unlockedItems: '[]',
    },
  });

  return NextResponse.json({ success: true });
}
