/**
 * MVP 模擬登入：無真實 OAuth，僅用 session 存當前用戶 ID。
 * 正式版可換成 NextAuth / Clerk。
 */
export type MockUser = {
  id: string;
  email: string;
  name: string | null;
  subscription: string;
  balance: number;
  points: number;
};

const MOCK_USER_ID = 'mock-user-1';

export async function getMockUser(): Promise<MockUser | null> {
  const { prisma } = await import('./prisma');
  const user = await prisma.user.findUnique({
    where: { id: MOCK_USER_ID },
    select: {
      id: true,
      email: true,
      name: true,
      subscription: true,
      balance: true,
      points: true,
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
  };
}

export function getMockUserId(): string {
  return MOCK_USER_ID;
}
