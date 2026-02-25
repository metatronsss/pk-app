import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import UpgradeButton from './UpgradeButton';

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  const isPaid = user.subscription === 'PAID';

  return (
    <div className="max-w-2xl space-y-8">
      <Link href="/dashboard" className="text-sm text-teal-600 hover:underline">
        ← 回 Dashboard
      </Link>
      {success === '1' && (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-teal-800">
          訂閱成功！您已是訂閱會員。
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-800">訂閱方案</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div
          className={`card ${!isPaid ? 'ring-2 ring-teal-500' : ''}`}
        >
          <h2 className="font-semibold text-slate-800">免費</h2>
          <p className="mt-2 text-3xl font-bold text-slate-700">$0</p>
          <p className="mt-1 text-sm text-slate-500">/ 月</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• 每月 1～3 個目標</li>
            <li>• 處罰押金機制</li>
            <li>• 完成可 100% Refund</li>
            <li>• 僅能退「上個月」遞延目標的款</li>
            <li>• AI Coach 基本功能</li>
          </ul>
          {!isPaid && (
            <p className="mt-4 rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
              目前方案
            </p>
          )}
        </div>

        <div
          className={`card ${isPaid ? 'ring-2 ring-amber-500' : ''}`}
        >
          <h2 className="font-semibold text-slate-800">訂閱會員</h2>
          <p className="mt-2 text-3xl font-bold text-amber-600">$10</p>
          <p className="mt-1 text-sm text-slate-500">/ 月</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• 免費方案全部功能</li>
            <li>• 可退「所有過往」遞延目標的款</li>
            <li>• 解鎖完整 Refund 歷史</li>
            <li>• 優先支援</li>
          </ul>
          {isPaid ? (
            <p className="mt-4 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              目前方案
            </p>
          ) : (
            <div className="mt-4">
              <UpgradeButton />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        <p className="font-medium">Stripe 設定說明</p>
        <p className="mt-1 text-sm">
          若「升級訂閱」按鈕無法使用，請在 <code className="rounded bg-amber-100 px-1">.env</code> 加入：
        </p>
        <ul className="mt-2 list-inside list-disc text-sm">
          <li><code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>（pk_test_ 開頭）</li>
          <li><code className="rounded bg-amber-100 px-1">STRIPE_SECRET_KEY</code>（sk_test_ 開頭）</li>
          <li><code className="rounded bg-amber-100 px-1">STRIPE_PRICE_ID</code>（訂閱價格 ID，見下方說明）</li>
        </ul>
        <p className="mt-2 text-sm">
          到 Stripe Dashboard → Products → 新增 Product「PK Pro」→ 新增 Price $10/月 → 複製 Price ID（price_xxx）到 STRIPE_PRICE_ID。
        </p>
      </div>
    </div>
  );
}
