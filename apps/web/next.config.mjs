import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Monorepo kökündeki tek .env dosyasını yükle.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: [
    '@velora/db',
    '@velora/queue',
    '@velora/config',
    '@velora/shared',
    '@velora/scraping',
    '@velora/core',
    '@velora/ai',
    '@velora/integrations',
    '@velora/storage',
  ],
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      'prisma',
      'bullmq',
      'ioredis',
      'bcryptjs',
      'playwright',
      'playwright-core',
      'chromium-bidi',
      'openai',
      'minio',
    ],
  },
  webpack: (config, { isServer }) => {
    // Playwright (tarayıcı scraping) yalnızca worker'da çalışır; web bundle'ından dışla.
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('playwright', 'playwright-core', 'chromium-bidi');
    }
    return config;
  },
};

export default nextConfig;
