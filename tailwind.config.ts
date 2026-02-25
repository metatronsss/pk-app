import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pk: {
          primary: '#0f766e',
          accent: '#f59e0b',
          danger: '#dc2626',
          muted: '#64748b',
        },
      },
    },
  },
  plugins: [],
};
export default config;
