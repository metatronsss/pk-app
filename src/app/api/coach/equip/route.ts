import { NextRequest, NextResponse } from 'next/server';
import { getSessionUserId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MAX_EQUIPPED = 5;

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: '請先登入' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const shopItemIds = body.shopItemIds as string[] | undefined;
  if (!Array.isArray(shopItemIds) || shopItemIds.length > MAX_EQUIPPED) {
    return NextResponse.json({ message: '最多裝備 5 個道具' }, { status: 400 });
  }

  const validIds = [...new Set(shopItemIds.slice(0, MAX_EQUIPPED).filter(Boolean))];
  const owned = await prisma.userItem.findMany({
    where: { userId, shopItemId: { in: validIds } },
    select: { shopItemId: true },
  });
  const ownedSet = new Set(owned.map((o) => o.shopItemId));
  const toEquip = validIds.filter((id) => ownedSet.has(id));

  await prisma.coachProfile.upsert({
    where: { userId },
    update: { equippedShopItemIds: JSON.stringify(toEquip) },
    create: {
      userId,
      coachType: 'friend',
      coachGender: 'male',
      affinity: 0,
      equippedShopItemIds: JSON.stringify(toEquip),
      unlockedItems: '[]',
    },
  });

  return NextResponse.json({ success: true, equipped: toEquip });
}
