'use client';

import { useState } from 'react';
import Image from 'next/image';

type ShopItem = {
  id: string;
  name: string;
  pointsCost: number;
  affinityRequired: number;
  imageUrl: string | null;
  sortOrder: number;
};

export default function ShopGrid({
  items,
  userPoints,
  userAffinity,
  userItemIds,
}: {
  items: ShopItem[];
  userPoints: number;
  userAffinity: number;
  userItemIds: string[];
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
        alert(data.message ?? '兌換失敗');
      }
    } catch {
      alert('兌換失敗');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 sm:grid-cols-5 md:grid-cols-10">
      {items.map((item) => {
        const isLocked = userAffinity < item.affinityRequired;
        const isOwned = ownedSet.has(item.id);
        const canBuy = !isLocked && !isOwned && userPoints >= item.pointsCost;

        return (
          <div
            key={item.id}
            className={`card flex flex-col items-center p-3 ${
              isLocked ? 'opacity-60' : ''
            }`}
          >
            <div className="relative h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} width={64} height={64} />
              ) : (
                <span className="text-2xl text-slate-400">
                  {isLocked ? '?' : item.name === '?' ? '?' : item.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="mt-2 text-center text-xs sm:text-sm font-medium text-slate-700 break-words">
              {isLocked ? '? 鎖定中' : item.name}
            </p>
            {!isLocked && (
              <>
                <p className="text-xs text-amber-600">{item.pointsCost} 積分</p>
                {item.affinityRequired > 0 && (
                  <p className="text-xs text-slate-500">好感度 {item.affinityRequired}</p>
                )}
              </>
            )}
            {!isLocked && !isOwned && (
              <button
                onClick={() => handlePurchase(item)}
                disabled={!canBuy || !!purchasing}
                className="mt-2 btn-primary text-xs py-1 px-2 disabled:opacity-50"
              >
                {purchasing === item.id ? '兌換中...' : '兌換'}
              </button>
            )}
            {isOwned && (
              <span className="mt-2 text-xs text-teal-600 font-medium">已擁有</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
