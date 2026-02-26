import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 登出：清除 session cookie 並導向首頁
 * 重要：Safari 會忽略 302 回應中的 Set-Cookie，故改回 200 + HTML meta refresh
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === 'production';
  const prefix = isProd ? '__Secure-' : '';
  const sessionName = `${prefix}next-auth.session-token`;

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
  const toClear = allCookies.filter(
    (c) => c.name === sessionName || c.name.startsWith(sessionName + '.')
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
  response.cookies.set(sessionName, '', clearOpts);

  return response;
}
