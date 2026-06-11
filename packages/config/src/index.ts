import { z } from 'zod';

/**
 * Sunucu tarafı çevre değişkenleri şeması.
 * Yalnızca sunucu/worker bağlamında kullanılır — istemci bileşenlerinden import edilmez.
 *
 * Doğrulama LAZY'dir: ilk `serverEnv()` çağrısında parse edilir ve cache'lenir.
 * Böylece env eksik olan build adımları import anında patlamaz.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Veritabanı & kuyruk
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  // MinIO / S3
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().default('velora-assets'),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  // Genel erişilebilir asset taban adresi (tünel/CDN). Boşsa S3_ENDPOINT kullanılır.
  S3_PUBLIC_ENDPOINT: z.string().default(''),
  // Görsellerin panelde sunulduğu taban (uygulama origin'i). publicUrl bunu kullanır →
  // panel görselleri uygulamanın kendi /api/asset rotasından gelir, tünele gerek kalmaz.
  ASSET_PUBLIC_BASE: z.string().default('http://localhost:3000'),

  // Auth
  NEXTAUTH_SECRET: z.string().min(16, 'NEXTAUTH_SECRET en az 16 karakter olmalı'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),

  // Kimlik bilgisi şifreleme (AES-256-GCM) — 32 baytlık hex
  CREDENTIAL_ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/, 'CREDENTIAL_ENCRYPTION_KEY 64 karakterlik hex olmalı (32 bayt)'),

  // Seed
  SEED_OWNER_EMAIL: z.string().email().default('owner@velora.local'),
  SEED_OWNER_PASSWORD: z.string().min(6).default('velora1234'),
  SEED_BRAND_NAME: z.string().default('Velora'),
  SEED_BRAND_SLUG: z.string().default('velora'),

  // AI sağlayıcılar (entegrasyon fazlarında zorunlu olur)
  OPENAI_API_KEY: z.string().default(''),
  FAL_KEY: z.string().default(''),

  // Ürün araştırma kaynakları (marka credential yoksa env fallback)
  ETSY_API_KEY: z.string().default(''),
  PINTEREST_ACCESS_TOKEN: z.string().default(''),
  // Tarayıcı tabanlı scraping için opsiyonel proxy (TikTok/Amazon/Pinterest).
  // Örn: http://user:pass@host:port. fetch tabanlı adaptörler standart
  // HTTPS_PROXY/HTTP_PROXY env'ini Node yerleşik desteğiyle kullanır.
  SCRAPER_PROXY_URL: z.string().default(''),

  // Shopify
  SHOPIFY_STORE_DOMAIN: z.string().default(''),
  SHOPIFY_ADMIN_ACCESS_TOKEN: z.string().default(''),
  SHOPIFY_API_VERSION: z.string().default('2024-10'),
  SHOPIFY_WEBHOOK_SECRET: z.string().default(''),

  // Meta
  META_ACCESS_TOKEN: z.string().default(''),
  META_AD_ACCOUNT_ID: z.string().default(''),
  META_APP_SECRET: z.string().default(''),

  // SMTP
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().int().default(1025),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('velora@localhost'),

  // Worker / n8n
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  N8N_WEBHOOK_BASE: z.string().default('http://localhost:3000/api/webhooks/n8n'),
  // n8n -> app webhook'larını doğrulamak için paylaşılan sır (boşsa webhook reddedilir)
  N8N_WEBHOOK_SECRET: z.string().default(''),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

/** Doğrulanmış sunucu env'ini döner (lazy + cache). Geçersizse açıklayıcı hata fırlatır. */
export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Geçersiz çevre değişkenleri:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Test amaçlı cache sıfırlama. */
export function resetEnvCache(): void {
  cached = null;
}
