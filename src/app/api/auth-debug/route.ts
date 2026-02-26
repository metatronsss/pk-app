import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextResponse } from 'next/server';

/**
 * 除錯用：檢查 session 狀態
 * 造訪 GET /api/auth-debug 可查看目前伺服器端是否收到 session
 * 部署後可刪除此檔
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    hasSession: !!session,
    user: session?.user ? { email: session.user.email, name: session.user.name } : null,
    env: {
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
