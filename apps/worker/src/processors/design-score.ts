import type { Job } from 'bullmq';
import { enqueue, type JobDataMap } from '@velora/queue';
import { audit, prisma, products, settings, type Prisma } from '@velora/db';
import { ai } from '@velora/ai';
import { getObject, keyFromUrl } from '@velora/storage';
import { logger } from '../logger';

const SCORING_PROMPT = [
  'Bu print-on-demand tasarımını değerlendir.',
  'SADECE şu JSON formatında, her alan 0–100 tam sayı olacak şekilde döndür:',
  '{"sellability": n, "trend": n, "ad": n, "audience": n}',
  'sellability=satılabilirlik, trend=trend uyumu, ad=reklam uyumu, audience=hedef kitle uyumu.',
].join('\n');

interface DesignScores {
  sellability: number;
  trend: number;
  ad: number;
  audience: number;
}

/** Model yanıtından JSON skorları çıkarır; başarısızsa null. */
function parseScores(text: string): DesignScores | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]) as Partial<DesignScores>;
    const num = (v: unknown) => (typeof v === 'number' ? Math.max(0, Math.min(100, v)) : 0);
    return {
      sellability: num(obj.sellability),
      trend: num(obj.trend),
      ad: num(obj.ad),
      audience: num(obj.audience),
    };
  } catch {
    return null;
  }
}

/**
 * Tasarım skorlama işi: OpenAI Vision ile tasarımı değerlendirir.
 * OpenAI anahtarı yoksa açık hata fırlatır.
 */
export async function processDesignScore(job: Job<JobDataMap['designScore']>) {
  const { designId } = job.data;
  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design?.pngUrl) throw new Error(`Tasarım PNG yok: ${designId}`);

  // Görseli base64 data URL olarak ver (OpenAI Vision dış URL'e erişmek zorunda kalmaz).
  const key = keyFromUrl(design.pngUrl);
  let imageUrl = design.pngUrl;
  if (key) {
    const { buffer, contentType } = await getObject(key);
    imageUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
  }
  const text = await ai.vision.describe(design.brandId, {
    imageUrl,
    prompt: SCORING_PROMPT,
  });
  const scores = parseScores(text);
  if (!scores) throw new Error('Skor JSON ayrıştırılamadı');

  await prisma.design.update({
    where: { id: designId },
    data: { scores: scores as unknown as Prisma.InputJsonValue },
  });
  logger.info({ designId, scores }, 'tasarım skorlandı');

  // Talebe göre OTOMATİK YAYIN — yalnızca L3 (tam otonom) ve skor eşiği aşıldıysa.
  const overall = Math.round(scores.sellability * 0.5 + scores.trend * 0.3 + scores.ad * 0.2);
  const level = await settings.get<number>(design.brandId, 'autonomy.level', 1);
  const minScore = await settings.get<number>(design.brandId, 'autoPublish.minScore', 68);
  if (level >= 3 && overall >= minScore) {
    const product = await products.create({
      brandId: design.brandId,
      title: design.prompt.slice(0, 70),
      designId,
    });
    await enqueue('printifyPublish', { productId: product.id });
    await audit.log({
      brandId: design.brandId,
      actor: 'autopilot',
      action: 'design.autopublish',
      entity: 'Design',
      entityId: designId,
      payload: { overall, minScore },
      autonomyLevel: 3,
    });
    logger.info({ designId, overall }, 'L3: talebe göre Printify ürünü hazırlandı');
  }
  return { ...scores, overall, autoPublished: level >= 3 && overall >= minScore };
}
