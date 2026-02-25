import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';
import { getSessionUser } from '@/lib/auth';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const session = await getServerSession(authOptions);
  const user = await getSessionUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-teal-700">
          <Image src="/pk_logo.png" alt="PK" width={36} height={36} className="rounded-lg" />
          <span>PK yourself</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-slate-600 hover:text-teal-700">
                Dashboard
              </Link>
              <Link href="/goals" className="text-slate-600 hover:text-teal-700">
                目標
              </Link>
              <Link href="/coach" className="text-slate-600 hover:text-teal-700">
                Coach
              </Link>
              <Link href="/shop" className="text-slate-600 hover:text-teal-700">
                商城
              </Link>
              <Link href="/payment" className="text-slate-600 hover:text-teal-700">
                付款方式
              </Link>
              <Link href="/subscription" className="text-slate-600 hover:text-teal-700">
                訂閱方案
              </Link>
              <HeaderClient
                user={{ name: user?.name, email: user?.email, subscription: user?.subscription ?? 'FREE' }}
              />
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-teal-700">
                登入
              </Link>
              <Link href="/register" className="btn-primary text-sm">
                註冊
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
