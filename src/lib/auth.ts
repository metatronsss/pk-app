import { getServerSession } from '@/lib/next-auth';
import { prisma } from './prisma';
import { authOptions } from './auth-options';

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  subscription: string;
  balance: number;
  points: number;
  stripePaymentMethodId: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      subscription: true,
      balance: true,
      points: true,
      stripePaymentMethodId: true,
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    subscription: user.subscription,
    balance: user.balance,
    points: user.points,
    stripePaymentMethodId: user.stripePaymentMethodId,
  };
}

export async function getSessionUserId(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.id ?? null;
}
