import type { Job } from 'bullmq';
import { enqueue, type JobDataMap } from '@velora/queue';
import { audit, prisma } from '@velora/db';
import { logger } from '../logger';
import { upcomingSpecialDays } from '../lib/special-days';

/** Trend/özel gün yoksa kullanılacak her-zaman-geçerli nişler. */
const EVERGREEN = [
  { label: 'evergreen', prompt: 'cute funny cat illustration "MEOW"' },
  { label: 'evergreen', prompt: 'JDM japanese sports car retro sunset illustration' },
  { label: 'evergreen', prompt: 'muscular arm dumbbell illustration "BEAST MODE"' },
  { label: 'evergreen', prompt: 'coffee cup steam illustration "BUT FIRST COFFEE"' },
  { label: 'evergreen', prompt: 'anime samurai wave aesthetic illustration' },
  { label: 'evergreen', prompt: 'mountain adventure illustration "EXPLORE"' },
];

/**
 * Otomatik tasarım üretimi (haftalık, n8n tetikli): yaklaşan ÖZEL GÜNLER + en iyi
 * TRENDLER'den temalar toplayıp tasarım kuyruğuna atar. Kaynak yoksa evergreen nişler.
 * Üretilen her tasarım skorlanır; L3'te skor eşiğini aşan tasarımlar otomatik yayınlanır.
 */
export async function processAutoDesign(job: Job<JobDataMap['autoDesign']>) {
  const { brandId, count = 4 } = job.data;
  const themes: { label: string; prompt: string }[] = [];

  // 1) Yaklaşan özel günler (30 gün) — öncelikli
  for (const sd of upcomingSpecialDays(30)) {
    for (const t of sd.themes) themes.push({ label: sd.name, prompt: t });
  }

  // 2) En iyi trendler
  const trends = await prisma.trend.findMany({
    where: { brandId },
    orderBy: { score: 'desc' },
    take: 6,
  });
  for (const tr of trends) {
    themes.push({ label: `trend:${tr.niche}`, prompt: `${tr.theme} ${tr.niche}`.trim() });
  }

  // 3) Hiç tema yoksa evergreen
  if (themes.length === 0) themes.push(...EVERGREEN);

  // Tekilleştir + ilk `count` tema
  const seen = new Set<string>();
  const picked = themes.filter((t) => {
    const k = t.prompt.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).slice(0, count);

  const created: string[] = [];
  for (const th of picked) {
    const d = await prisma.design.create({
      data: { brandId, prompt: th.prompt, status: 'GENERATING' },
    });
    await enqueue('design', { designId: d.id });
    created.push(d.id);
  }

  await audit.log({
    brandId,
    actor: 'autopilot',
    action: 'design.auto_generate',
    entity: 'Design',
    payload: { count: created.length, themes: picked.map((p) => p.label) },
    autonomyLevel: 3,
  });
  logger.info({ brandId, created: created.length }, 'otomatik tasarım üretimi tetiklendi');
  return { created: created.length, themes: picked.map((p) => p.label) };
}
