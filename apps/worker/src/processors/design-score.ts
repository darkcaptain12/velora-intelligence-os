import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, type Prisma } from '@velora/db';
import { ai } from '@velora/ai';
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

  const text = await ai.vision.describe(design.brandId, {
    imageUrl: design.pngUrl,
    prompt: SCORING_PROMPT,
  });
  const scores = parseScores(text);
  if (!scores) throw new Error('Skor JSON ayrıştırılamadı');

  await prisma.design.update({
    where: { id: designId },
    data: { scores: scores as unknown as Prisma.InputJsonValue },
  });
  logger.info({ designId, scores }, 'tasarım skorlandı');
  return scores;
}
