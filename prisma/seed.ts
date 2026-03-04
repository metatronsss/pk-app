import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { EFFECTIVE_ITEMS } from '../src/lib/shop-items';

const prisma = new PrismaClient();

async function main() {
  const existingItems = await prisma.shopItem.count();
  if (existingItems === 0) {
    for (const item of SHOP_ITEMS) {
      await prisma.shopItem.create({
        data: {
          name: item.name,
          itemType: item.itemType,
          effectValue: item.effectValue,
          pointsCost: item.pointsCost,
          affinityRequired: item.affinityRequired,
          sortOrder: item.sortOrder,
        },
      });
    }
    console.log('Created shop items:', SHOP_ITEMS.length);
  }

  const passwordHash = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@pk.app' },
    update: { passwordHash },
    create: {
      email: 'demo@pk.app',
      passwordHash,
      name: 'Demo User',
      subscription: 'FREE',
      balance: 0,
      points: 100,
    },
  });

  await prisma.coachProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      coachType: 'friend',
      coachGender: 'male',
      affinity: 0,
      unlockedItems: '[]',
    },
  });

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: '每週運動 3 次',
      description: '健身房或跑步，每次至少 30 分鐘',
      dueAt: endOfMonth,
      penaltyCents: 2000,
      status: 'ACTIVE',
      refundable: true,
    },
  });

  console.log('Seed done:', { user: user.email });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
