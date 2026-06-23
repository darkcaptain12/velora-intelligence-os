import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { serverEnv } from '@velora/config';
import { brands } from '@velora/db';
import { executeJarvisCommand } from '@/lib/jarvis-executor';

export const runtime = 'nodejs';

const bodySchema = z.object({
  command: z.string().min(1).max(500),
});

/**
 * Jarvis Python köprüsü — Python uygulamasından Bearer token ile çağrılır.
 * `JARVIS_API_TOKEN` env değişkeni ayarlı olmalı (boşsa endpoint reddeder).
 * n8n webhook deseniyle aynı güvenlik modeli.
 */
export async function POST(req: NextRequest) {
  const env = serverEnv();

  if (!env.JARVIS_API_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'JARVIS_API_TOKEN yapılandırılmamış' },
      { status: 503 },
    );
  }

  const authz = req.headers.get('authorization') ?? '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : '';
  if (!token || token !== env.JARVIS_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek — "command" alanı gerekli' }, { status: 400 });
  }

  const brand = await brands.getActive();
  if (!brand) {
    return NextResponse.json({ ok: false, error: 'Aktif marka bulunamadı' }, { status: 404 });
  }

  const result = await executeJarvisCommand(brand.id, 'jarvis-python', parsed.data.command);
  return NextResponse.json(result);
}
