import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, credentials, tasks, type Prisma, type Provider, type Source } from '@velora/db';
import { getAdapter } from '@velora/scraping';
import { scoreItems } from '@velora/core';
import { ScrapeBlockedError } from '@velora/shared';
import { logger } from '../logger';

/** Kaynak → credential sağlayıcısı (API anahtarı/token gerektiren kaynaklar). */
const SOURCE_PROVIDER: Partial<Record<Source, Provider>> = {
  ETSY: 'ETSY',
  PINTEREST: 'PINTEREST',
};

/** Kaynak → env fallback anahtarı (marka credential yoksa). */
const SOURCE_ENV: Partial<Record<Source, string>> = {
  ETSY: 'ETSY_API_KEY',
  PINTEREST: 'PINTEREST_ACCESS_TOKEN',
};

/**
 * Kaynak için API anahtarı/token çözer: önce markaya özel şifreli credential,
 * yoksa env fallback (AI Gateway `resolveKey` deseniyle aynı mantık).
 */
async function resolveSourceCredential(
  brandId: string,
  source: Source,
): Promise<string | undefined> {
  const provider = SOURCE_PROVIDER[source];
  if (provider) {
    const fromDb = await credentials.get(brandId, provider).catch(() => null);
    if (fromDb) return fromDb;
  }
  const envKey = SOURCE_ENV[source];
  const fromEnv = envKey ? process.env[envKey] : undefined;
  return fromEnv && fromEnv.length > 0 ? fromEnv : undefined;
}

/**
 * Ürün araştırma işi: kaynak adaptörü → normalize → skorla → ResearchResult'a yaz.
 * Heuristik skorlama (AI gerektirmez). Engelleme/CAPTCHA durumunda Görev Merkezi'ne
 * "manuel doğrulama" görevi açılır (CLAUDE.md: API > Playwright > Kullanıcı onayı).
 */
export async function processResearch(job: Job<JobDataMap['research']>) {
  const { runId } = job.data;
  const run = await prisma.researchRun.findUnique({ where: { id: runId } });
  if (!run) throw new Error(`ResearchRun bulunamadı: ${runId}`);

  await prisma.researchRun.update({ where: { id: runId }, data: { status: 'RUNNING' } });
  logger.info({ runId, source: run.source, query: run.query }, 'araştırma başladı');

  const query = run.query ?? '';
  try {
    const adapter = getAdapter(run.source);
    const credential = await resolveSourceCredential(run.brandId, run.source);
    const proxyUrl = process.env.SCRAPER_PROXY_URL || undefined;

    const items = await adapter.scrape(query, { limit: 30, credential, proxyUrl });
    const scored = scoreItems(items);

    if (scored.length > 0) {
      await prisma.researchResult.createMany({
        data: scored.map((s) => ({
          runId,
          title: s.title.slice(0, 500),
          url: s.url,
          demandScore: s.scores.demandScore,
          competitionScore: s.scores.competitionScore,
          salesPotential: s.scores.salesPotential,
          profitScore: s.scores.profitScore,
          raw: (s.raw ?? {}) as Prisma.InputJsonValue,
        })),
      });
    }

    await prisma.researchRun.update({
      where: { id: runId },
      data: { status: 'SUCCESS', finishedAt: new Date() },
    });
    logger.info({ runId, count: scored.length }, 'araştırma tamamlandı');
    return { count: scored.length };
  } catch (err) {
    await prisma.researchRun.update({
      where: { id: runId },
      data: { status: 'FAILED', finishedAt: new Date() },
    });

    // Engelleme/CAPTCHA → manuel doğrulama görevi. Yeniden DENENMEZ (kalıcı engel).
    if (err instanceof ScrapeBlockedError) {
      await tasks.create({
        brandId: run.brandId,
        title: `${run.source} manuel doğrulama gerekli`,
        description:
          `"${query}" araştırması ${run.source} kaynağında bot korumasına/CAPTCHA'ya takıldı. ` +
          `Tarayıcıda manuel olarak erişimi doğrulayın veya proxy (SCRAPER_PROXY_URL) ` +
          `yapılandırın, ardından araştırmayı tekrar başlatın. (Sebep: ${err.message})`,
        type: 'API_INPUT',
        priority: 1,
      });
      logger.warn(
        { runId, source: run.source, err: err.message },
        'araştırma engellendi → manuel doğrulama görevi açıldı',
      );
      return { blocked: true, taskCreated: true };
    }

    logger.error({ runId, err: (err as Error).message }, 'araştırma başarısız');
    throw err;
  }
}
