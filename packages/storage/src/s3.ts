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

/**
 * Görsel URL'si — uygulamanın kendi `/api/asset` rotası üzerinden (kararlı, tünel gerektirmez).
 * Panel localhost:3000'den görüntülendiği için görseller her zaman erişilebilir; tünel URL'si
 * değişse/düşse bile panel kırılmaz. Shopify'a yükleme byte ile (staged upload) yapılır.
 */
export function publicUrl(key: string): string {
  const base = serverEnv().ASSET_PUBLIC_BASE.replace(/\/$/, '');
  return `${base}/api/asset/${key}`;
}

/** `/api/asset/<key>` URL'sinden nesne anahtarını çıkarır. */
export function keyFromUrl(url: string): string | null {
  const m = url.match(/\/api\/asset\/(.+)$/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/** Nesneyi MinIO'dan okur (web /api/asset rotası + Shopify staged upload için). */
export async function getObject(key: string): Promise<{ buffer: Buffer; contentType: string }> {
  const env = serverEnv();
  const stat = await getClient().statObject(env.S3_BUCKET, key).catch(() => null);
  const stream = await getClient().getObject(env.S3_BUCKET, key);
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk as Uint8Array);
  return {
    buffer: Buffer.concat(chunks as unknown as readonly Uint8Array[]),
    contentType: stat?.metaData?.['content-type'] ?? 'application/octet-stream',
  };
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
