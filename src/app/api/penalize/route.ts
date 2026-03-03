import { NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { penalizeOverdueGoals } from '@/lib/penalize';

/**
 * 登入後由 client 呼叫，背景執行 penalize，不阻塞頁面載入。
 */
export async function POST() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }
  const penalized = await penalizeOverdueGoals();
  return NextResponse.json({ penalized });
}
