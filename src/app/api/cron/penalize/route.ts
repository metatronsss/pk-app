import { NextRequest, NextResponse } from 'next/server';
import { penalizeOverdueGoals } from '@/lib/penalize';

/**
 * 手動觸發 penalize（測試用）。
 * 正式運作改為頁面載入時呼叫 lib/penalize。
 */
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  const penalized = await penalizeOverdueGoals();
  return NextResponse.json({ message: 'Penalize done', penalized });
}
