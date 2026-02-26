import Link from 'next/link';
import { Suspense } from 'react';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import PaymentForm from './PaymentForm';
import PaymentSuccessHandler from './PaymentSuccessHandler';

export default async function PaymentPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripePaymentMethodId: true },
  });

  const hasCard = !!dbUser?.stripePaymentMethodId;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="max-w-xl space-y-6">
      <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
        ← 回 Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-slate-800">付款方式</h1>
      <p className="text-slate-600">
        綁定信用卡後，設定目標時會預授權處罰金額；未完成才會實際扣款，完成則釋放預授權。
      </p>
      {!publishableKey ? (
        <div className="card rounded-lg border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">Stripe 未設定</p>
          <p className="mt-1 text-sm">
            請在 <code className="rounded bg-amber-100 px-1">.env</code> 加入：
          </p>
          <ul className="mt-2 list-inside list-disc text-sm">
            <li><code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>（pk_test_ 開頭）</li>
            <li><code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code>（sk_test_ 開頭）</li>
          </ul>
          <p className="mt-2 text-sm">
            到 <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard → API Keys</a> 複製測試金鑰。
          </p>
          <Link href="/subscription" className="mt-3 inline-block text-sm text-amber-700 underline">
            訂閱方案也需要 Stripe
          </Link>
        </div>
      ) : hasCard ? (
        <div className="card rounded-lg border-teal-200 bg-teal-50 p-4 text-teal-800">
          <p className="font-medium">已綁定信用卡</p>
          <p className="mt-1 text-sm">設定目標時將使用此卡進行預授權。</p>
        </div>
      ) : (
        <>
          <Suspense fallback={null}>
            <PaymentSuccessHandler />
          </Suspense>
          <PaymentForm />
        </>
      )}
    </div>
  );
}
