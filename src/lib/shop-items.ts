export const VISIBLE_ITEMS = ['手套', '圍巾', '皮鞭', '帽子', '量角器'] as const;

/** 道具名稱 → 圖片路徑（對應 public/shop/ 內的檔名） */
export const ITEM_IMAGE_PATHS: Record<string, string> = {
  手套: '/shop/Shop_Gloves.svg',
  圍巾: '/shop/Shop_Scarf.svg',
  皮鞭: '/shop/Shop_Whip.svg',
  帽子: '/shop/Shop_Hat.svg',
  量角器: '/shop/Shop_Protractor.svg',
};

export function getItemImageUrl(name: string): string | null {
  return ITEM_IMAGE_PATHS[name] ?? null;
}

export function getAffinityRequiredForIndex(index: number): number {
  if (index < 5) return 0;
  return 20 + Math.floor((index - 5) / 5) * 10;
}

