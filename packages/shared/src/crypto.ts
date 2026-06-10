import crypto from 'node:crypto';
import { serverEnv } from '@velora/config';

/**
 * Hassas kimlik bilgileri için AES-256-GCM şifreleme.
 * Çıktı formatı:  base64(iv) : base64(authTag) : base64(ciphertext)
 *
 * Anahtar `CREDENTIAL_ENCRYPTION_KEY` (32 baytlık hex) çevre değişkeninden okunur.
 */
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM için önerilen
const SEPARATOR = ':';

/**
 * TS 5.9 + @types/node köprüsü: yeni lib'de `Buffer` = `Uint8Array<ArrayBufferLike>`,
 * `node:crypto` API'leri ise `Uint8Array<ArrayBuffer>` (paylaşımsız) bekler. Buffer
 * çalışma zamanında her zaman paylaşımsızdır; bu yardımcı yalnızca tip köprüsüdür.
 */
const u8 = (buf: Buffer): Uint8Array<ArrayBuffer> => buf as unknown as Uint8Array<ArrayBuffer>;

function getKey(): Uint8Array<ArrayBuffer> {
  return u8(Buffer.from(serverEnv().CREDENTIAL_ENCRYPTION_KEY, 'hex'));
}

/** Düz metni şifreler. */
export function encryptSecret(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), u8(iv));
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();
  return [iv.toString('base64'), authTag.toString('base64'), encrypted].join(SEPARATOR);
}

/** `encryptSecret` çıktısını çözer. Format/auth hatası durumunda fırlatır. */
export function decryptSecret(payload: string): string {
  const parts = payload.split(SEPARATOR);
  if (parts.length !== 3) {
    throw new Error('Geçersiz şifreli veri formatı');
  }
  const [ivB64, tagB64, dataB64] = parts as [string, string, string];
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), u8(Buffer.from(ivB64, 'base64')));
  decipher.setAuthTag(u8(Buffer.from(tagB64, 'base64')));
  let decrypted = decipher.update(dataB64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/** 32 baytlık yeni bir şifreleme anahtarı (hex) üretir — kurulum yardımcısı. */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
