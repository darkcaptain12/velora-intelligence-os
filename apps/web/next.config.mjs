import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Monorepo kökündeki tek .env dosyasını yükle.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../../.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
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
    // NOT: @prisma/client + neon adapter'ları DIŞARIDA BIRAKMIYORUZ.
    // queryCompiler WASM tabanlı (native binary yok) → Next.js bundle'a
    // gömülür, böylece pnpm monorepo "iki @prisma/client kopyası" sorunu
    // çözülür (serverless function tek, doğru client'ı kullanır).
    serverComponentsExternalPackages: [
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
