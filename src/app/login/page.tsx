import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    redirect('/dashboard');
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="flex flex-col items-center">
        <Image
          src="/pk_logo.png"
          alt="PK"
          width={80}
          height={80}
          className="rounded-xl"
        />
        <h1 className="mt-4 text-2xl font-bold text-slate-800">登入</h1>
      </div>
      <Suspense fallback={<div className="card animate-pulse h-48 rounded-lg" />}>
        <LoginForm />
      </Suspense>
      <p className="text-center text-sm text-slate-600">
        還沒有帳號？{' '}
        <Link href="/register" className="text-teal-600 hover:underline">
          註冊
        </Link>
      </p>
    </div>
  );
}
