import { withAuth } from '@/lib/next-auth-middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/goals/:path*', '/coach/:path*', '/payment/:path*', '/subscription/:path*', '/shop/:path*'],
};
