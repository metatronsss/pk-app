'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getItemImageUrl } from '@/lib/shop-items';
import { t, getItemDisplayName, getItemEffectTooltip } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const MAX_SLOTS = 5;

type OwnedItem = { id: string; shopItemId: string; shopItem: { name: string; sortOrder: number; itemType?: string | null } };

export default function CoachEquip({
  userId,
  equippedIds,
  ownedItems,
  locale,
}: {
  userId: string;
  equippedIds: string[];
  ownedItems: OwnedItem[];
  locale: Locale;
}) {
  const [slots, setSlots] = useState<string[]>(equippedIds.slice(0, MAX_SLOTS));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSlots(equippedIds.slice(0, MAX_SLOTS));
  }, [equippedIds]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/coach/equip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopItemIds: slots.filter(Boolean) }),
      });
      if (res.ok) window.location.reload();
    } finally {
      setSaving(false);
    }
  };

  const setSlot = (idx: number, shopItemId: string) => {
    const next = [...slots];
    next[idx] = shopItemId;
    setSlots(next);
  };

  const ownedById = new Map(ownedItems.map((o) => [o.shopItemId, o]));
  /** 每個 slot 可選的項目：已選在其他 slot 的不可再選（同一道具不能重複裝備）；當前 slot 已選的仍要顯示以便保留 */
  const getOptionsForSlot = (idx: number) =>
    ownedItems.filter(
      (o) => slots[idx] === o.shopItemId || !slots.some((id, j) => j !== idx && id === o.shopItemId)
    );

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-700">{t('coach.equipTitle', locale)}</h3>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: MAX_SLOTS }, (_, i) => {
          const item = slots[i] ? ownedById.get(slots[i]) : null;
          const tooltip = item?.shopItem
            ? getItemEffectTooltip(item.shopItem.itemType ?? '', item.shopItem.sortOrder ?? 0, locale)
            : '';
          return (
            <div
              key={i}
              className="relative h-14 w-14 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center"
              title={tooltip ? `${getItemDisplayName(item?.shopItem?.name ?? '', locale)}：${tooltip}` : undefined}
            >
              {slots[i] ? (
                <Image
                  src={getItemImageUrl(ownedById.get(slots[i])?.shopItem?.name || '') || '/shop/Shop_Protractor.svg'}
                  alt=""
                  width={48}
                  height={48}
                />
              ) : (
                <span className="text-slate-400 text-xs">{t('coach.equipEmpty', locale)}</span>
              )}
              <select
                value={slots[i] || ''}
                onChange={(e) => setSlot(i, e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                <option value="">— {t('coach.equipEmpty', locale)} —</option>
                {getOptionsForSlot(i).map((o) => (
                  <option key={o.id} value={o.shopItemId}>
                    {getItemDisplayName(o.shopItem?.name ?? o.shopItemId, locale)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="btn-secondary text-sm py-1 px-2"
      >
        {saving ? t('coach.saving', locale) : t('coach.saveEquip', locale)}
      </button>
    </div>
  );
}
