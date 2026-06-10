import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { serverEnv } from '@velora/config';
import { audit, brands } from '@velora/db';
import { enqueue, QUEUE_NAMES, type QueueName } from '@velora/queue';

export const runtime = 'nodejs';

const bodySchema = z.object({
  event: z.string().min(1),
  brandId: z.string().optional(),
  queue: z.string().optional(),
  data: z.record(z.unknown()).optional(),
});

/**
 * n8n orkestrasyon webhook'u. n8n workflow adımları bu ucu çağırır;
 * paylaşılan sır ile doğrulanır, denetim kaydı yazılır ve gerekiyorsa iş kuyruğa eklenir.
 */
export async function POST(req: NextRequest) {
  const env = serverEnv();
  if (!env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: 'N8N_WEBHOOK_SECRET yapılandırılmamış' },
      { status: 503 },
    );
  }

  const authz = req.headers.get('authorization') ?? '';
  const token = authz.startsWith('Bearer ')
    ? authz.slice(7)
    : (req.headers.get('x-velora-secret') ?? '');
  if (token !== env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Geçersiz istek' }, { status: 400 });
  }

  const brand = parsed.data.brandId
    ? await brands.getById(parsed.data.brandId)
    : await brands.getActive();
  if (!brand) {
    return NextResponse.json({ ok: false, error: 'Marka bulunamadı' }, { status: 404 });
  }

  let jobId: string | undefined;
  const queue = parsed.data.queue;
  if (queue && queue in QUEUE_NAMES) {
    // Marka-seviyesi işler için brandId otomatik enjekte edilir (workflow göndermek zorunda değil).
    const job = await enqueue(queue as QueueName, { brandId: brand.id, ...(parsed.data.data ?? {}) } as never);
    jobId = job.id;
  }

  await audit.log({
    brandId: brand.id,
    actor: 'n8n',
    action: `webhook.${parsed.data.event}`,
    entity: 'Webhook',
    payload: { queue, jobId },
    autonomyLevel: 2,
  });

  return NextResponse.json({ ok: true, jobId: jobId ?? null });
}
