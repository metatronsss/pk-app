import Link from 'next/link';
import Image from 'next/image';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getLocale } from '@/lib/locale-server';
import { t } from '@/lib/i18n';
import CoachChat from './CoachChat';
import CoachSettings from './CoachSettings';
import CoachEquip from './CoachEquip';
import { COACH_TYPES, COACH_GENDERS, getGreeting, getCoachImageKey, getCoachReminders } from '@/lib/coach-dialogue';

export default async function CoachPage() {
  const [user, locale] = await Promise.all([getSessionUser(), getLocale()]);
  if (!user) {
    return (
      <div className="card">
        <p>{t('auth.pleaseLogin', locale)}</p>
      </div>
    );
  }

  const [coach, activeGoals, userItems] = await Promise.all([
    prisma.coachProfile.findUnique({ where: { userId: user.id } }),
    prisma.goal.findMany({
      where: { userId: user.id, status: 'ACTIVE', proof: null },
      select: { id: true, title: true, dueAt: true },
      orderBy: { dueAt: 'asc' },
    }),
    prisma.userItem.findMany({
      where: { userId: user.id },
      include: { shopItem: { select: { name: true, sortOrder: true, itemType: true } } },
    }),
  ]);

  const coachType = (coach?.coachType ?? 'friend') as 'family' | 'friend' | 'lover';
  const coachGender = (coach?.coachGender ?? 'male') as 'male' | 'female';
  const affinity = coach?.affinity ?? 0;
  const unlockedItems: string[] = coach
    ? (typeof coach.unlockedItems === 'string'
        ? (JSON.parse(coach.unlockedItems || '[]') as string[])
        : [])
    : [];

  const greeting = getGreeting(coachType, coachGender, affinity, locale);
  const reminders = getCoachReminders(activeGoals, coachType, coachGender, locale);
  const initialGreeting = reminders.length > 0
    ? `${greeting}\n\n${reminders.join('\n\n')}`
    : greeting;
  const imageSrc = getCoachImageKey(coachType, coachGender);
  const equippedIds: string[] = coach?.equippedShopItemIds
    ? (JSON.parse(coach.equippedShopItemIds) as string[]).filter(Boolean)
    : [];
  const ownedItems = userItems.map((ui) => ({
    id: ui.id,
    shopItemId: ui.shopItemId,
    shopItem: ui.shopItem!,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('coach.aiCoach', locale)}</h1>
      <div className="grid gap-6 md:grid-cols-3 min-w-0">
        <div className="card md:col-span-1 space-y-4">
          <h2 className="font-semibold text-slate-700">{t('coach.settings', locale)}</h2>
          <CoachSettings
            userId={user.id}
            coachType={coachType}
            coachGender={coachGender}
            locale={locale}
          />
          <div className="relative h-32 w-32 mx-auto">
            <Image
              src={imageSrc}
              alt={`${COACH_TYPES[coachType]} ${COACH_GENDERS[coachGender]}`}
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
          <p className="text-sm text-slate-500">
            {t('coach.affinity', locale)}：{affinity}{t('coach.affinityRange', locale)}
          </p>
          <p className="text-sm text-amber-600">
            {t('coach.pointsDaily', locale, { points: String(user.points) })}
          </p>
          <CoachEquip userId={user.id} equippedIds={equippedIds} ownedItems={ownedItems} locale={locale} />
          <Link href="/shop" className="block text-sm text-teal-600 hover:underline">
            {t('coach.equipItems', locale)}
          </Link>
          <Link href="/dashboard" className="block text-sm text-teal-600 hover:underline">
            {t('coach.backDashboard', locale)}
          </Link>
        </div>
        <div className="card md:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-700">{t('coach.chat', locale)}</h2>
          <CoachChat
            key={locale}
            userId={user.id}
            coachType={coachType}
            coachGender={coachGender}
            affinity={affinity}
            initialGreeting={initialGreeting}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
