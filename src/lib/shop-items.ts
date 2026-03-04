/** 道具類型 */
export const ITEM_TYPES = {
  penalty_reduction: '減輕處罰',
  grace_period: '寬限期',
  affinity_boost: '增加好感度',
  cosmetic: '裝飾',
} as const;

export type ItemType = keyof typeof ITEM_TYPES;

/** 前 5 個已設計造型的裝飾名稱（對應 Coach 換裝） */
export const VISIBLE_ITEMS = ['手套', '圍巾', '皮鞭', '帽子', '量角器'] as const;

/** 等級羅馬數字（II～X） */
const TIER_SUFFIXES = ['', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII', ' IX', ' X'];

/**
 * 5 種裝飾對應效果（可多種）：
 * - 手套：減輕處罰
 * - 圍巾：寬限期
 * - 皮鞭：增加好感度 + 減輕處罰 + 寬限期（三種全有）
 * - 帽子：增加好感度
 * - 量角器：減輕處罰 + 寬限期
 */
const EFFECT_TYPES_BY_POS: Array<ItemType | ItemType[]> = [
  'penalty_reduction',           // 手套
  'grace_period',               // 圍巾
  ['affinity_boost', 'penalty_reduction', 'grace_period'], // 皮鞭
  'affinity_boost',             // 帽子
  ['penalty_reduction', 'grace_period'], // 量角器
];

/** 依 tier 計算效果值 */
function getEffectValue(itemType: ItemType, tier: number): number {
  if (itemType === 'penalty_reduction') return 95 - tier * 2;
  if (itemType === 'grace_period') return 1 + tier;
  return 5 + tier * 5; // affinity_boost
}

/**
 * 50 個道具：10 個等級 × 5 種裝飾
 * - 1-5：手套、圍巾、皮鞭、帽子、量角器（等級 1，好感度 0 可見可買）
 * - 6-50：隨好感度解鎖等級，解鎖後可見；購買需當前好感度達標
 */
export function buildShopItems(): Array<{
  name: string;
  itemType: string; // 單一用 "x"，多重用 "x,y,z"
  effectValue: number;
  pointsCost: number;
  affinityRequired: number;
  sortOrder: number;
}> {
  const items: Array<{
    name: string;
    itemType: string;
    effectValue: number;
    pointsCost: number;
    affinityRequired: number;
    sortOrder: number;
  }> = [];

  for (let i = 0; i < 50; i++) {
    const tier = Math.floor(i / 5);
    const pos = i % 5;
    const effectDef = EFFECT_TYPES_BY_POS[pos];
    const types = Array.isArray(effectDef) ? effectDef : [effectDef];
    const itemType = types.join(',');
    const primaryType = types[0];
    const effectValue = getEffectValue(primaryType, tier);

    const pointsCost = 20 + tier * 10;
    const affinityRequired = tier === 0 ? 0 : 20 + (tier - 1) * 10;

    const baseName = VISIBLE_ITEMS[pos];
    const name = baseName + TIER_SUFFIXES[tier];

    items.push({
      name,
      itemType,
      effectValue,
      pointsCost,
      affinityRequired,
      sortOrder: i,
    });
  }

  return items;
}

export const SHOP_ITEMS = buildShopItems();

/** 從裝備的 5 個道具計算效果（取最佳） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getUserItemEffects(userId: string, prisma: any) {
  const effects = {
    penaltyReduction: 100,
    gracePeriodDays: 0,
    affinityBoost: 0,
  };

  const coach = await prisma.coachProfile.findUnique({
    where: { userId },
    select: { equippedShopItemIds: true },
  });
  const equippedIds: string[] = coach?.equippedShopItemIds
    ? (JSON.parse(coach.equippedShopItemIds) as string[]).filter(Boolean)
    : [];
  if (equippedIds.length === 0) return effects;

  const userItems = await prisma.userItem.findMany({
    where: { userId, shopItemId: { in: equippedIds } },
    include: { shopItem: true },
  });

  for (const ui of userItems) {
    const s = ui.shopItem;
    const types = (s.itemType || '').split(',').filter(Boolean);
    const tier = Math.floor((s.sortOrder ?? 0) / 5);

    for (const t of types) {
      const val = getEffectValue(t as ItemType, tier);
      if (t === 'penalty_reduction' && val < effects.penaltyReduction) {
        effects.penaltyReduction = val;
      } else if (t === 'grace_period') {
        effects.gracePeriodDays += val;
      } else if (t === 'affinity_boost') {
        effects.affinityBoost += val;
      }
    }
  }

  return effects;
}

/** 依好感度取得對應等級（0-9） */
export function getTierFromAffinity(affinity: number): number {
  if (affinity < 20) return 0;
  for (let t = 9; t >= 1; t--) {
    if (affinity >= 20 + (t - 1) * 10) return t;
  }
  return 0;
}

/** 當 affinity 上升時，更新 highestAffinityTierReached（若新等級更高） */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateHighestTierIfNeeded(prisma: any, userId: string, newAffinity: number) {
  const coach = await prisma.coachProfile.findUnique({
    where: { userId },
    select: { highestAffinityTierReached: true },
  });
  const newTier = getTierFromAffinity(newAffinity);
  const current = coach?.highestAffinityTierReached ?? 0;
  if (newTier > current) {
    await prisma.coachProfile.update({
      where: { userId },
      data: { highestAffinityTierReached: newTier },
    });
  }
}

/** 道具名稱 → 圖片路徑 */
export const ITEM_IMAGE_PATHS: Record<string, string> = {
  手套: '/shop/Shop_Gloves.svg',
  圍巾: '/shop/Shop_Scarf.svg',
  皮鞭: '/shop/Shop_Whip.svg',
  帽子: '/shop/Shop_Hat.svg',
  量角器: '/shop/Shop_Protractor.svg',
};

export function getItemImageUrl(name: string): string | null {
  const baseName = name.split(' ')[0] || name;
  return ITEM_IMAGE_PATHS[baseName] ?? '/shop/Shop_Protractor.svg';
}
