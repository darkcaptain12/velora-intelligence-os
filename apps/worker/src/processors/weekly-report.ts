import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { audit, finance, operationScores, prisma, settings, trends, type Prisma } from '@velora/db';
import { ai } from '@velora/ai';
import { sendEmail } from '@velora/integrations';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';
import { buildReportHtml } from '../lib/report-html';

/**
 * AI CEO Haftalık Rapor: finans + operasyon skoru + trend + görevleri sentezler,
 * AIReport (CEO) oluşturur, HTML rapor üretip SMTP ile operatöre gönderir.
 * AI anlatısı anahtar yoksa deterministik özete düşer (rapor yine üretilir).
 */
export async function processWeeklyReport(job: Job<JobDataMap['weeklyReport']>) {
  const { brandId } = job.data;
  const brand = await prisma.brand.findUnique({ where: { id: brandId } });
  const currency = brand?.currency ?? 'TRY';
  const week = isoWeek(new Date());

  const snaps = await finance.latest(brandId, 7);
  const revenue = snaps.reduce((a, s) => a + Number(s.revenue), 0);
  const netProfit = snaps.reduce((a, s) => a + Number(s.netProfit), 0);
  const orderCount = snaps.reduce((a, s) => a + s.orders, 0);
  const op = await operationScores.latest(brandId);
  const weekTrends = await trends.list(brandId, week);
  const openTasks = await prisma.task.count({ where: { brandId, status: 'OPEN' } });

  const insights = [
    `Haftalık ciro: ${revenue.toFixed(0)} ${currency}`,
    `Net kâr: ${netProfit.toFixed(0)} ${currency}`,
    `Sipariş sayısı: ${orderCount}`,
    `Operasyon skoru: ${op ? op.overall.toFixed(0) : '—'}/100`,
    `Açık görev: ${openTasks}`,
  ];

  const topTrend = weekTrends[0];
  const recommendations: string[] = [];
  if (topTrend) recommendations.push(`En güçlü trend sinyali: "${topTrend.theme}" (niş: ${topTrend.niche}). Bu kategoriye ağırlık ver.`);
  if (op && op.adScore < 50) recommendations.push("Reklam skoru düşük — ROAS'ı iyileştir veya zayıf kampanyaları durdur.");
  if (netProfit < 0) recommendations.push('Net kâr negatif — maliyet ve reklam harcamasını gözden geçir.');
  if (recommendations.length === 0) recommendations.push('Strateji sağlıklı görünüyor; kazanan ürünleri ölçeklemeyi değerlendir.');

  let narrative = `Bu hafta (${week}) özeti: ${insights.join(' · ')}.`;
  try {
    narrative = await ai.text.generate(brandId, {
      prompt: `Bir e-ticaret AI CEO'su gibi, şu haftalık verilerden KISA (3-4 cümle) Türkçe yönetici özeti yaz:\n${insights.join('\n')}\nEn güçlü trend: ${topTrend?.theme ?? 'yok'}`,
      temperature: 0.5,
      maxTokens: 400,
    });
  } catch {
    // anahtar yoksa deterministik özet kullanılır
  }

  const report = await prisma.aIReport.create({
    data: {
      brandId,
      type: 'CEO',
      period: week,
      summary: narrative,
      insights: insights as unknown as Prisma.InputJsonValue,
      recommendations: recommendations as unknown as Prisma.InputJsonValue,
    },
  });

  const html = buildReportHtml({ brandName: brand?.name ?? 'Velora', week, narrative, insights, recommendations });
  const recipient =
    (await settings.get<string>(brandId, 'report.recipientEmail', '')) ||
    process.env.SEED_OWNER_EMAIL ||
    'owner@velora.local';

  let mailed = false;
  try {
    await sendEmail({ to: recipient, subject: `VELORA Haftalık Rapor — ${week}`, html });
    mailed = true;
  } catch (err) {
    logger.warn({ brandId, err: (err as Error).message }, 'rapor maili gönderilemedi');
  }

  await audit.log({
    brandId,
    actor: 'ai-ceo',
    action: 'report.weekly',
    entity: 'AIReport',
    entityId: report.id,
    payload: { week, mailed, recipient },
    autonomyLevel: 1,
  });
  logger.info({ brandId, week, mailed }, 'haftalık rapor üretildi');
  return { reportId: report.id, mailed, week };
}
