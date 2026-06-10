import crypto from 'node:crypto';

/** TS 5.9 + @types/node Buffer/ArrayBuffer köprüsü (bkz. @velora/shared crypto). */
const u8 = (b: Buffer): Uint8Array<ArrayBuffer> => b as unknown as Uint8Array<ArrayBuffer>;

/**
 * Shopify webhook HMAC doğrulaması (X-Shopify-Hmac-Sha256, base64).
 * Zamanlama-güvenli karşılaştırma kullanır.
 */
export function verifyShopifyWebhook(
  rawBody: string | Buffer,
  hmacHeader: string | null,
  secret: string,
): boolean {
  if (!hmacHeader || !secret) return false;
  const bytes = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : rawBody;
  const digest = crypto.createHmac('sha256', secret).update(u8(bytes)).digest('base64');
  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(u8(a), u8(b));
  } catch {
    return false;
  }
}
