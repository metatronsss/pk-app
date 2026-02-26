import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Safari 專用登出：自訂清除 cookie 並導向
 * Safari 可能不正確處理 NextAuth signout 的 Set-Cookie，此 API 強制清除
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === 'production';
  const prefix = isProd ? '__Secure-' : '';
  const sessionName = `${prefix}next-auth.session-token`;

  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(origin + '/?_=' + Date.now());

  // 清除所有可能的 session cookie（含 chunked）
  const allCookies = cookieStore.getAll();
  const toClear = allCookies.filter(
    (c) => c.name === sessionName || c.name.startsWith(sessionName + '.')
  );

  const clearOpts = {
    path: '/',
    sameSite: 'lax' as const,
    secure: isProd,
    maxAge: 0,
    expires: new Date(0),
  };

  for (const c of toClear) {
    response.cookies.set(c.name, '', clearOpts);
  }

  // 若無 chunked，也強制清除主 cookie
  response.cookies.set(sessionName, '', clearOpts);

  return response;
}
