import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import { getItemImageUrl } from '@/lib/shop-items';
import ShopGrid from './ShopGrid';

export default async function ShopPage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
        <Link href="/login" className="btn-primary mt-4">
          {t('auth.login', locale)}
        </Link>
      </div>
    );
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { userId: user.id },
  });
  const affinity = coach?.affinity ?? 0;
  const highestTier = coach?.highestAffinityTierReached ?? 0;

  const rawItems = await prisma.shopItem.findMany({
    orderBy: { sortOrder: 'asc' },
  });
  const items = rawItems.map((item) => ({
    ...item,
    imageUrl: item.imageUrl || getItemImageUrl(item.name),
    itemType: item.itemType ?? 'cosmetic',
    effectValue: item.effectValue ?? 0,
    tier: Math.floor((item.sortOrder ?? 0) / 5),
  }));

  const userItemIds = (
    await prisma.userItem.findMany({ where: { userId: user.id }, select: { shopItemId: true } })
  ).map((u) => u.shopItemId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('shop.title', locale)}</h1>
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-amber-600 font-medium">{t('shop.points', locale)}：{user.points}</p>
        <p className="text-slate-600">{t('shop.affinityUnlock', locale, { affinity })}</p>
        <Link href="/coach" className="text-sm text-teal-600 hover:underline">
          {t('shop.backCoach', locale)}
        </Link>
      </div>
      <ShopGrid
        items={items}
        userPoints={user.points}
        userAffinity={affinity}
        highestTier={highestTier}
        userItemIds={userItemIds}
        locale={locale}
      />
    </div>
  );
}
