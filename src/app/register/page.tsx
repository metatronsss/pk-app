import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from '@/lib/next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import RegisterForm from './RegisterForm';

export default async function RegisterPage() {
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
        <h1 className="mt-4 text-2xl font-bold text-slate-800">註冊</h1>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-slate-600">
        已有帳號？{' '}
        <Link href="/login" className="text-teal-600 hover:underline">
          登入
        </Link>
      </p>
    </div>
  );
}
