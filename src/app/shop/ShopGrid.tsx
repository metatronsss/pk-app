'use client';

import { useState } from 'react';
import Image from 'next/image';
import { t, getItemDisplayName, getItemEffectTooltip } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

type ShopItem = {
  id: string;
  name: string;
  itemType?: string;
  effectValue?: number;
  pointsCost: number;
  affinityRequired: number;
  imageUrl: string | null;
  sortOrder: number;
};

export default function ShopGrid({
  items,
  userPoints,
  userAffinity,
  highestTier,
  userItemIds,
  locale,
}: {
  items: (ShopItem & { tier?: number })[];
  userPoints: number;
  userAffinity: number;
  highestTier: number;
  userItemIds: string[];
  locale: Locale;
}) {
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const ownedSet = new Set(userItemIds);

  const handlePurchase = async (item: ShopItem) => {
    if (ownedSet.has(item.id)) return;
    if (userPoints < item.pointsCost) return;
    if (userAffinity < item.affinityRequired) return;
    setPurchasing(item.id);
    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopItemId: item.id }),
      });
      const data = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        alert(data.message ?? t('shop.exchangeFailed', locale));
      }
    } catch {
      alert(t('shop.exchangeFailed', locale));
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:grid-cols-10">
      {items.map((item) => {
        const tier = item.tier ?? Math.floor((item.sortOrder ?? 0) / 5);
        const isVisible = tier <= highestTier;
        const isLocked = !isVisible;
        const isAffinityLocked = userAffinity < item.affinityRequired;
        const isOwned = ownedSet.has(item.id);
        const canBuy = isVisible && !isAffinityLocked && !isOwned && userPoints >= item.pointsCost;

        const types = (item.itemType || '').split(',').filter(Boolean);
        const showEffects = types.length > 0 && isVisible;
        const effectTooltip = getItemEffectTooltip(item.itemType ?? '', item.sortOrder ?? 0, locale);
        const displayName = getItemDisplayName(item.name, locale);
        const hoverTitle = effectTooltip ? `${displayName}：${effectTooltip}` : displayName;

        return (
          <div
            key={item.id}
            title={hoverTitle}
            className={`card flex flex-col items-center p-3 relative ${
              isLocked ? 'opacity-60' : isAffinityLocked && !isOwned ? 'opacity-80' : ''
            }`}
          >
            {isLocked && (
              <div
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/40 z-10"
                title={effectTooltip ? `${t('shop.locked', locale)} · ${effectTooltip}` : t('shop.locked', locale)}
              >
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm2-2v2h6V7a3 3 0 00-6 0z" clipRule="evenodd" /></svg>
              </div>
            )}
            <div className="relative h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden" title={hoverTitle}>
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={displayName} width={64} height={64} title={hoverTitle} />
              ) : (
                <span className="text-2xl text-slate-400">
                  {item.name === '?' ? '?' : item.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="mt-2 text-center text-xs sm:text-sm font-medium text-slate-700 break-words">
              {getItemDisplayName(item.name, locale)}
            </p>
            {showEffects && (
              <div className="text-xs text-slate-600 space-y-0.5">
                {types.includes('penalty_reduction') && (
                  <p>{t('shop.penaltyReduce', locale, { p: String(95 - tier * 2) })}</p>
                )}
                {types.includes('grace_period') && (
                  <p>{t('shop.gracePeriod', locale, { d: String(1 + tier) })}</p>
                )}
                {types.includes('affinity_boost') && (
                  <p>{t('shop.affinityBoost', locale, { a: String(5 + tier * 5) })}</p>
                )}
              </div>
            )}
            <p className="text-xs text-amber-600">{t('shop.pointsCost', locale, { n: String(item.pointsCost) })}</p>
            {item.affinityRequired > 0 && (
              <p className="text-xs text-slate-500">{t('shop.affinityRequired', locale, { n: String(item.affinityRequired) })}</p>
            )}
            {!isOwned && (
              isLocked ? (
                <span className="mt-2 text-xs text-slate-500 font-medium">{t('shop.locked', locale)}</span>
              ) : (
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canBuy || !!purchasing}
                  className="mt-2 btn-primary text-xs py-1 px-2 disabled:opacity-50"
                  title={!canBuy ? t('shop.affinityLockedTitle', locale) : undefined}
                >
                  {purchasing === item.id ? t('shop.exchanging', locale) : canBuy ? t('shop.exchange', locale) : t('shop.affinityLocked', locale)}
                </button>
              )
            )}
            {isOwned && (
              <span className="mt-2 text-xs text-teal-600 font-medium">{t('shop.owned', locale)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
