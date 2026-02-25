import Link from 'next/link';
import Image from 'next/image';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CoachChat from './CoachChat';
import CoachSettings from './CoachSettings';
import { COACH_TYPES, COACH_GENDERS, getGreeting, getCoachImageKey } from '@/lib/coach-dialogue';

export default async function CoachPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="card">
        <p>請先登入。</p>
      </div>
    );
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { userId: user.id },
  });
  const coachType = (coach?.coachType ?? 'friend') as 'family' | 'friend' | 'lover';
  const coachGender = (coach?.coachGender ?? 'male') as 'male' | 'female';
  const affinity = coach?.affinity ?? 0;
  const unlockedItems: string[] = coach
    ? (typeof coach.unlockedItems === 'string'
        ? (JSON.parse(coach.unlockedItems || '[]') as string[])
        : [])
    : [];

  const greeting = getGreeting(coachType, coachGender, affinity);
  const imageSrc = getCoachImageKey(coachType, coachGender);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">AI Coach</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card md:col-span-1 space-y-4">
          <h2 className="font-semibold text-slate-700">教練設定</h2>
          <CoachSettings
            userId={user.id}
            coachType={coachType}
            coachGender={coachGender}
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
            好感度：{affinity}（-100 ~ 100）
          </p>
          <p className="text-sm text-amber-600">
            積分：{user.points}（每日登入 +10）
          </p>
          <Link href="/shop" className="block text-sm text-teal-600 hover:underline">
            商城兌換道具 →
          </Link>
          <Link href="/dashboard" className="block text-sm text-teal-600 hover:underline">
            回 Dashboard
          </Link>
        </div>
        <div className="card md:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-700">與 Coach 對話</h2>
          <CoachChat
            userId={user.id}
            coachType={coachType}
            coachGender={coachGender}
            affinity={affinity}
            initialGreeting={greeting}
          />
        </div>
      </div>
    </div>
  );
}
