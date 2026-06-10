import { Client } from 'minio';
import { serverEnv } from '@velora/config';

/**
 * S3-uyumlu (MinIO) nesne deposu. Tasarım/mockup/video/baskı dosyaları burada tutulur.
 * Bucket (`velora-assets`) anonim okunabilir → publicUrl doğrudan <img src> olarak kullanılabilir.
 */
let _client: Client | null = null;

function getClient(): Client {
  if (_client) return _client;
  const env = serverEnv();
  const url = new URL(env.S3_ENDPOINT);
  _client = new Client({
    endPoint: url.hostname,
    port: Number(url.port) || (url.protocol === 'https:' ? 443 : 80),
    useSSL: url.protocol === 'https:',
    accessKey: env.S3_ACCESS_KEY,
    secretKey: env.S3_SECRET_KEY,
  });
  return _client;
}

/** Buffer'ı verilen anahtara yükler ve herkese açık URL döner. */
export async function putObject(key: string, body: Buffer, contentType: string): Promise<string> {
  const env = serverEnv();
  await getClient().putObject(env.S3_BUCKET, key, body, body.length, {
    'Content-Type': contentType,
  });
  return publicUrl(key);
}

/** Anahtar için herkese açık URL üretir. */
export function publicUrl(key: string): string {
  const env = serverEnv();
  return `${env.S3_ENDPOINT.replace(/\/$/, '')}/${env.S3_BUCKET}/${key}`;
}

/** İmzalı (geçici) okuma URL'si. */
export async function presignedUrl(key: string, expirySeconds = 3600): Promise<string> {
  return getClient().presignedGetObject(serverEnv().S3_BUCKET, key, expirySeconds);
}

/** Bir URL'yi indirip buffer döner (AI çıktısını depoya kopyalamak için). */
export async function fetchToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`İndirilemedi: ${url} (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}

/** Marka + tür bazlı tutarlı anahtar üretir. */
export function assetKey(
  brandId: string,
  kind: 'design' | 'mockup' | 'video' | 'print',
  filename: string,
): string {
  return `${brandId}/${kind}/${filename}`;
}
