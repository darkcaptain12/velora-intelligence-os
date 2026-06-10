import { IntegrationError } from '@velora/shared';
import { requireKey } from '../keys';
import { logUsage } from '../usage';

const FAL_BASE = 'https://fal.run';

async function run(
  brandId: string,
  model: string,
  input: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const key = await requireKey(brandId, 'FAL');
  const res = await fetch(`${FAL_BASE}/${model}`, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new IntegrationError('FAL', `Fal isteği başarısız (${res.status})`, detail);
  }
  const data = (await res.json()) as Record<string, unknown>;
  await logUsage({ brandId, provider: 'FAL', model, cost: 0 });
  return data;
}

export const falProvider = {
  /** Görsel üretir; üretilen görsel URL'lerini döner. */
  async generateImage(
    brandId: string,
    opts: { prompt: string; model?: string; imageSize?: string },
  ): Promise<string[]> {
    const model = opts.model ?? 'fal-ai/flux/schnell';
    const data = await run(brandId, model, {
      prompt: opts.prompt,
      image_size: opts.imageSize ?? 'square_hd',
    });
    const images = (data.images as { url?: string }[] | undefined) ?? [];
    return images.map((i) => i.url).filter((u): u is string => Boolean(u));
  },

  /** Video üretir; video URL'sini döner. */
  async generateVideo(
    brandId: string,
    opts: { prompt: string; model?: string },
  ): Promise<string | null> {
    const model = opts.model ?? 'fal-ai/ltx-video';
    const data = await run(brandId, model, { prompt: opts.prompt });
    const video = data.video as { url?: string } | undefined;
    return video?.url ?? (data.url as string | undefined) ?? null;
  },
};
