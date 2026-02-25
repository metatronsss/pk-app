import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { processDailyLogin } from '@/lib/daily-login';

export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const result = await processDailyLogin(userId);
  return NextResponse.json(result);
}
