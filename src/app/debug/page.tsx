import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';

/**
 * 除錯頁：檢查 session 狀態
 * 造訪 /debug 可查看目前伺服器端是否收到 session
 * 部署後可刪除此檔
 */
export default async function DebugPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="card max-w-md space-y-4">
      <h1 className="text-lg font-bold">Auth Debug</h1>
      <pre className="overflow-auto rounded bg-slate-100 p-3 text-xs">
        {JSON.stringify(
          {
            hasSession: !!session,
            user: session?.user ? { email: session.user.email, name: session.user.name } : null,
            env: {
              hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
              nodeEnv: process.env.NODE_ENV,
            },
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}
