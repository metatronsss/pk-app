import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

/**
 * 登出：1) 在 DB 標記 loggedOutAt 2) 清除 cookie 3) 導向首頁
 * Safari 可能不清除 cookie，故用 DB 在伺服器端使 session 失效
 */
export async function GET(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production';
  const sessionCookieName = isProd ? '__Secure-next-auth.session-token-v2' : 'next-auth.session-token';
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-at-least-32-characters-long' : undefined),
    cookieName: sessionCookieName,
  });
  if (token?.id) {
    await prisma.user.update({
      where: { id: token.id as string },
      data: { loggedOutAt: new Date() },
    });
  }

  const cookieStore = await cookies();
  const prefix = isProd ? '__Secure-' : '';
  const sessionNames = [
    `${prefix}next-auth.session-token`,
    `${prefix}next-auth.session-token-v2`,
  ];

  const origin = request.nextUrl.origin;
  const redirectUrl = origin + '/?_=' + Date.now();

  const clearOpts = {
    path: '/',
    sameSite: 'lax' as const,
    secure: isProd,
    maxAge: 0,
    expires: new Date(0),
  };

  const allCookies = cookieStore.getAll();
  const toClear = allCookies.filter((c) =>
    sessionNames.some((n) => c.name === n || c.name.startsWith(n + '.'))
  );

  const response = new NextResponse(
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${redirectUrl}"/><title>登出中…</title></head><body><p>登出中…</p></body></html>`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  );

  for (const c of toClear) {
    response.cookies.set(c.name, '', clearOpts);
  }
  for (const n of sessionNames) {
    response.cookies.set(n, '', clearOpts);
  }

  return response;
}
