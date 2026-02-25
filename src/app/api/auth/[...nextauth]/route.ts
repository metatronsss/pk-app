import nextAuthModule from '@/lib/next-auth';
import { authOptions } from '@/lib/auth-options';

const NextAuth = ((nextAuthModule as { default?: (opts: typeof authOptions) => (req: Request, ctx: { params?: { nextauth?: string[] } }) => Promise<Response> }).default ?? nextAuthModule) as (opts: typeof authOptions) => (req: Request, ctx: { params?: { nextauth?: string[] } }) => Promise<Response>;
const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
