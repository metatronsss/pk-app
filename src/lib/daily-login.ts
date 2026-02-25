import { prisma } from './prisma';
import { startOfDay, differenceInDays } from 'date-fns';

const DAILY_POINTS = 10;
const STREAK_DAYS_FOR_AFFINITY = 30;

export async function processDailyLogin(userId: string): Promise<{ pointsAdded: number; affinityAdded: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastLoginDate: true, consecutiveLoginDays: true },
  });
  if (!user) return { pointsAdded: 0, affinityAdded: 0 };

  const today = startOfDay(new Date());
  const lastLogin = user.lastLoginDate ? startOfDay(user.lastLoginDate) : null;

  if (lastLogin && lastLogin.getTime() === today.getTime()) {
    return { pointsAdded: 0, affinityAdded: 0 };
  }

  let consecutiveDays = user.consecutiveLoginDays;
  if (!lastLogin) {
    consecutiveDays = 1;
  } else {
    const daysDiff = differenceInDays(today, lastLogin);
    if (daysDiff === 1) {
      consecutiveDays += 1;
    } else {
      consecutiveDays = 1;
    }
  }

  let affinityAdded = 0;
  if (consecutiveDays >= STREAK_DAYS_FOR_AFFINITY) {
    affinityAdded = 1;
    consecutiveDays = 0;
  }

  const userUpdate = prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginDate: new Date(),
      consecutiveLoginDays: consecutiveDays,
      points: { increment: DAILY_POINTS },
    },
  });

  if (affinityAdded > 0) {
    const profile = await prisma.coachProfile.findUnique({ where: { userId } });
    const newAffinity = Math.min(100, (profile?.affinity ?? 0) + affinityAdded);
    await prisma.$transaction([
      userUpdate,
      prisma.coachProfile.upsert({
        where: { userId },
        update: { affinity: newAffinity },
        create: {
          userId,
          coachType: 'friend',
          coachGender: 'male',
          affinity: newAffinity,
          unlockedItems: '[]',
        },
      }),
    ]);
  } else {
    await userUpdate;
  }

  return { pointsAdded: DAILY_POINTS, affinityAdded };
}
