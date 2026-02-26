import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8 text-center">
      <Image
        src="/pk_logo.png"
        alt="Procrastination Killer"
        width={160}
        height={160}
        className="mx-auto rounded-2xl"
        priority
      />
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 px-2">
        不夠痛 你就不會用
      </h1>
      <p className="text-base sm:text-lg text-slate-600 px-2 break-words">
        押金 + Refund + AI Coach — 用處罰機制逼自己完成目標，完成就能 100% 拿回。
      </p>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {session?.user?.email ? (
          <>
            <Link href="/dashboard" className="btn-primary">
              進入 Dashboard
            </Link>
            <Link href="/goals" className="btn-secondary">
              設定目標
            </Link>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-primary">
              登入
            </Link>
            <Link href="/register" className="btn-secondary">
              註冊
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
