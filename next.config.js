/** @type {import('next').NextConfig} */
const nextConfig = {
  // 讓 next-auth client 能正確解析 signOut 等 API 的 base URL
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
    serverComponentsExternalPackages: ['next-auth'],
  },
};

module.exports = nextConfig;
