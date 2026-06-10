import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { enqueue, getQueue } from '@velora/queue';

export const runtime = 'nodejs';

const bodySchema = z.object({ message: z.string().min(1).max(280) });

/** Örnek iş kuyruğa ekler (Faz 0 sağlık testi). */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }

  const job = await enqueue('sample', { message: parsed.data.message });
  return NextResponse.json({ ok: true, jobId: job.id });
}

/** İş durumunu sorgular: ?id=<jobId> */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ ok: false, error: 'id gerekli' }, { status: 400 });

  const job = await getQueue('sample').getJob(id);
  if (!job) return NextResponse.json({ ok: false, error: 'İş bulunamadı' }, { status: 404 });

  const state = await job.getState();
  return NextResponse.json({
    ok: true,
    id: job.id,
    state,
    result: job.returnvalue ?? null,
    failedReason: job.failedReason ?? null,
  });
}
