import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { serverEnv } from '@velora/config';
import { getConnection } from '@velora/queue';

export const runtime = 'nodejs';

const STATE_KEY = 'jarvis:orb:state';
const STATE_TTL = 90; // saniye — inaktiflik sonrası SLEEP'e döner

export interface JarvisOrbState {
  status: 'SLEEP' | 'AWAKE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
  lastCommand: string | null;
  lastResult: string | null;
  durationMs: number | null;
  updatedAt: string;
}

const DEFAULT_STATE: JarvisOrbState = {
  status: 'SLEEP',
  lastCommand: null,
  lastResult: null,
  durationMs: null,
  updatedAt: new Date(0).toISOString(),
};

const postSchema = z.object({
  status: z.enum(['SLEEP', 'AWAKE', 'LISTENING', 'PROCESSING', 'SUCCESS', 'ERROR']),
  lastCommand: z.string().max(200).nullish(),
  lastResult: z.string().max(500).nullish(),
  durationMs: z.number().int().nonnegative().nullish(),
});

// GET — auth yok; dashboard layout zaten session korumalı, state verisi gizli değil
export async function GET() {
  try {
    const raw = await getConnection().get(STATE_KEY);
    if (!raw) return NextResponse.json(DEFAULT_STATE);
    return NextResponse.json(JSON.parse(raw) as JarvisOrbState);
  } catch {
    return NextResponse.json(DEFAULT_STATE);
  }
}

// POST — Python Jarvis AWAKE/LISTENING state'lerini gönderir; JARVIS_API_TOKEN gerekli
export async function POST(req: NextRequest) {
  const env = serverEnv();

  if (!env.JARVIS_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'JARVIS_API_TOKEN yapılandırılmamış' }, { status: 503 });
  }

  const authz = req.headers.get('authorization') ?? '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : '';
  if (!token || token !== env.JARVIS_API_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const parsed = postSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }

  const redis = getConnection();
  const raw = await redis.get(STATE_KEY).catch(() => null);
  const existing: JarvisOrbState = raw ? (JSON.parse(raw) as JarvisOrbState) : { ...DEFAULT_STATE };

  const next: JarvisOrbState = {
    status: parsed.data.status,
    lastCommand: parsed.data.lastCommand ?? existing.lastCommand,
    lastResult: parsed.data.lastResult ?? existing.lastResult,
    durationMs: parsed.data.durationMs ?? existing.durationMs,
    updatedAt: new Date().toISOString(),
  };

  await redis.setex(STATE_KEY, STATE_TTL, JSON.stringify(next));
  return NextResponse.json({ ok: true });
}
