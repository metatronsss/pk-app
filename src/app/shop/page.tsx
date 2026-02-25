import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getItemImageUrl } from '@/lib/shop-items';
import ShopGrid from './ShopGrid';

export default async function ShopPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
        <Link href="/login" className="btn-primary mt-4">
          登入
        </Link>
      </div>
    );
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { userId: user.id },
  });
  const affinity = coach?.affinity ?? 0;

  const rawItems = await prisma.shopItem.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  const items = rawItems.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || getItemImageUrl(item.name),
  }));

  const userItemIds = (
    await prisma.userItem.findMany({ where: { userId: user.id }, select: { shopItemId: true } })
  ).map((u) => u.shopItemId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">商城</h1>
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-amber-600 font-medium">積分：{user.points}</p>
        <p className="text-slate-600">好感度：{affinity}（解鎖更多道具）</p>
        <Link href="/coach" className="text-sm text-teal-600 hover:underline">
          回 Coach
        </Link>
      </div>
      <ShopGrid items={items} userPoints={user.points} userAffinity={affinity} userItemIds={userItemIds} />
    </div>
  );
}
