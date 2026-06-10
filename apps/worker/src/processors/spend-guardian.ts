import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { adCampaigns, adMetrics, audit, prisma, tasks } from '@velora/db';
import { evaluateSpendLimits } from '@velora/core';
import { setCampaignStatus } from '@velora/integrations';
import { logger } from '../logger';

/**
 * Acil Durum Koruması: dönem harcamasını aktif limitlerle karşılaştırır.
 * Aşım varsa tüm AKTİF kampanyaları duraklatır (Meta), Görev Merkezi'ne uyarı açar
 * ve L3 denetim kaydı yazar. Limit değerlendirmesi Meta'sız çalışır (saf çekirdek).
 */
export async function processSpendGuardian(job: Job<JobDataMap['spendGuardian']>) {
  const { brandId } = job.data;

  const limits = await prisma.spendLimit.findMany({ where: { brandId, active: true } });
  const spend = await adMetrics.spendByPeriod(brandId);
  const violations = evaluateSpendLimits(
    spend,
    limits.map((l) => ({ period: l.period, amount: Number(l.amount) })),
  );

  if (violations.length === 0) {
    logger.info({ brandId, spend }, 'harcama limitleri içinde');
    return { ok: true, violations: [] };
  }

  let paused = 0;
  let metaError: string | undefined;
  try {
    const active = await prisma.adCampaign.findMany({ where: { brandId, status: 'ACTIVE' } });
    for (const c of active) {
      await setCampaignStatus(brandId, c.metaId, 'PAUSED');
      await adCampaigns.setStatus(c.id, 'PAUSED');
      paused += 1;
    }
  } catch (err) {
    metaError = (err as Error).message;
  }

  const summary = violations.map((v) => `${v.period}: ${v.spent}/${v.limit}`).join(', ');
  await tasks.create({
    brandId,
    title: 'ACİL DURUM: Harcama limiti aşıldı',
    description:
      `İhlaller — ${summary}. ${paused} aktif kampanya duraklatıldı.` +
      (metaError ? ` Meta hatası: ${metaError} (kampanyalar manuel durdurulmalı).` : ''),
    type: 'GENERIC',
    priority: 1,
  });
  await audit.log({
    brandId,
    actor: 'guardian',
    action: 'spend.limit.exceeded',
    entity: 'SpendLimit',
    payload: { violations, paused, metaError },
    autonomyLevel: 3,
  });

  logger.warn({ brandId, violations, paused, metaError }, 'ACİL DURUM: harcama limiti aşıldı');
  return { ok: false, violations, paused };
}
