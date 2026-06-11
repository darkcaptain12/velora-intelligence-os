import type { NextRequest } from 'next/server';
import { getObject } from '@velora/storage';

export const dynamic = 'force-dynamic';

/**
 * Asset proxy — MinIO nesnelerini uygulamanın kendi origin'inden sunar.
 * Panel görselleri buradan yüklenir (tünel gerektirmez, asla kırılmaz).
 * Kimlik gerektirmez (img src ile yüklenir).
 */
export async function GET(_req: NextRequest, { params }: { params: { key: string[] } }) {
  const key = params.key.map((p) => decodeURIComponent(p)).join('/');
  try {
    const { buffer, contentType } = await getObject(key);
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Bulunamadı', { status: 404 });
  }
}
