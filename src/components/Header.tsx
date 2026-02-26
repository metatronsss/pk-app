import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';
import { getSessionUser } from '@/lib/auth';
import HeaderNav from './HeaderNav';

export default async function Header() {
  const session = await getServerSession(authOptions);
  const user = await getSessionUser();

  return (
    <header className="relative border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-teal-700 shrink-0">
          <Image src="/pk_logo.png" alt="PK" width={36} height={36} className="rounded-lg" />
          <span>PK yourself</span>
        </Link>
        <HeaderNav
          session={session}
          user={user ? { name: user.name, email: user.email, subscription: user.subscription ?? 'FREE' } : null}
        />
      </div>
    </header>
  );
}
