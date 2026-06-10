import type { Prisma, Provider } from '@prisma/client';
import { decryptSecret, encryptSecret, NotFoundError } from '@velora/shared';
import { prisma } from './client';

/**
 * Şifreli kimlik bilgisi (API anahtarı vb.) yönetimi.
 * Düz metin asla DB'ye yazılmaz; AES-256-GCM ile şifrelenir.
 */
export const credentials = {
  /** Marka + sağlayıcı için anahtarı şifreleyip kaydeder (varsa günceller). */
  async set(
    brandId: string,
    provider: Provider,
    plaintext: string,
    meta?: Record<string, unknown>,
  ): Promise<void> {
    const keyEncrypted = encryptSecret(plaintext);
    const metaInput =
      meta === undefined ? undefined : (meta as unknown as Prisma.InputJsonValue);
    await prisma.apiCredential.upsert({
      where: { brandId_provider: { brandId, provider } },
      create: { brandId, provider, keyEncrypted, meta: metaInput },
      update: { keyEncrypted, meta: metaInput },
    });
  },

  /** Çözülmüş anahtarı döner; yoksa null. */
  async get(brandId: string, provider: Provider): Promise<string | null> {
    const row = await prisma.apiCredential.findUnique({
      where: { brandId_provider: { brandId, provider } },
    });
    if (!row) return null;
    return decryptSecret(row.keyEncrypted);
  },

  /** Çözülmüş anahtarı döner; yoksa hata fırlatır. */
  async require(brandId: string, provider: Provider): Promise<string> {
    const value = await this.get(brandId, provider);
    if (!value) {
      throw new NotFoundError(`${provider} kimlik bilgisi bulunamadı (brand: ${brandId})`);
    }
    return value;
  },

  /** Sağlayıcı için kayıtlı meta verisini döner. */
  async getMeta(brandId: string, provider: Provider): Promise<Record<string, unknown> | null> {
    const row = await prisma.apiCredential.findUnique({
      where: { brandId_provider: { brandId, provider } },
      select: { meta: true },
    });
    return (row?.meta as Record<string, unknown> | null) ?? null;
  },

  async remove(brandId: string, provider: Provider): Promise<void> {
    await prisma.apiCredential.deleteMany({ where: { brandId, provider } });
  },

  /** Hangi sağlayıcıların ayarlı olduğunu döner (değer çözmeden). */
  async listStatus(brandId: string): Promise<Record<Provider, boolean>> {
    const rows = await prisma.apiCredential.findMany({
      where: { brandId },
      select: { provider: true },
    });
    const setProviders = new Set(rows.map((r) => r.provider));
    const all: Provider[] = [
      'OPENAI',
      'FAL',
      'ANTHROPIC',
      'SHOPIFY',
      'META',
      'SMTP',
      'ETSY',
      'PINTEREST',
    ];
    return Object.fromEntries(all.map((p) => [p, setProviders.has(p)])) as Record<
      Provider,
      boolean
    >;
  },
};
