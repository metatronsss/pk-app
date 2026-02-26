import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from '@/lib/next-auth-providers-credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-at-least-32-characters-long' : undefined),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  cookies: {
    sessionToken: {
      // v2: 強制舊 cookie 失效，解決 Safari 殘留 session 問題（部署後所有人需重新登入一次）
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token-v2' : 'next-auth.session-token',
      options: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { subscription: true },
        });
        token.subscription = dbUser?.subscription ?? 'FREE';
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.id) return session;
      const iat = (token.iat as number) || 0;
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { subscription: true, loggedOutAt: true },
      });
      if (dbUser?.loggedOutAt && new Date(dbUser.loggedOutAt) > new Date(iat * 1000)) {
        return { ...session, user: { ...session.user, id: '', email: '', name: null } };
      }
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.subscription = (dbUser?.subscription ?? token.subscription ?? 'FREE') as string;
      return session;
    },
  },
};
