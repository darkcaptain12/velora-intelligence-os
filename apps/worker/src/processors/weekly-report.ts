import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import {
  adCampaigns,
  audit,
  decisions,
  events,
  finance,
  operationScores,
  opportunities,
  prisma,
  productIntelligence,
  products,
  settings,
  suppliers,
  trends,
  DecisionAction,
  type Prisma,
} from '@velora/db';
import { ai, prompts } from '@velora/ai';
import { evaluateProductDemand, computeBehaviorScore } from '@velora/core';
import { sendEmail } from '@velora/integrations';
import { logger } from '../logger';
import { isoWeek } from '../lib/iso-week';
import { buildReportHtml } from '../lib/report-html';

interface ValidatedDecision {
  title: string;
  rationale: string;
  action: DecisionAction;
  params: Record<string, unknown>;
  confidence?: number;
  expectedImpact?: string;
  riskLevel?: string;
}

interface DecisionContext {
  topOppId?: string;
  topOppValidated: boolean;
  weakestProductId?: string;
  nearestEventReady: boolean;
  campaignIds: Set<string>;
  unverifiedSupplierId?: string;
  exitNicheProductId?: string;
  supplierCostMatch?: { productId: string; supplierId: string };
  adDraftProductId?: string;
}

/** AI yanıtındaki ham kararı, gerçek DB id'lerine göre doğrular (ID uydurmayı engeller). */
function validateDecision(raw: unknown, ctx: DecisionContext): ValidatedDecision | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.title !== 'string' || typeof r.rationale !== 'string' || typeof r.action !== 'string') return null;
  if (!Object.values(DecisionAction).includes(r.action as DecisionAction)) return null;
  const action = r.action as DecisionAction;
  const params = (typeof r.params === 'object' && r.params !== null ? r.params : {}) as Record<string, unknown>;
  const confidence = typeof r.confidence === 'number' ? Math.min(100, Math.max(0, Math.round(r.confidence))) : undefined;
  const expectedImpact = ['LOW', 'MEDIUM', 'HIGH'].includes(r.expectedImpact as string) ? (r.expectedImpact as string) : undefined;
  const riskLevel = ['LOW', 'MEDIUM', 'HIGH'].includes(r.riskLevel as string) ? (r.riskLevel as string) : undefined;

  const q = { confidence, expectedImpact, riskLevel };
  const ok = (p: Record<string, unknown>): ValidatedDecision => ({
    title: r.title as string,
    rationale: r.rationale as string,
    action,
    params: p,
    ...q,
  });

  switch (action) {
    case 'CONVERT_OPPORTUNITY':
      if (!ctx.topOppValidated || !ctx.topOppId || params.opportunityId !== ctx.topOppId) return null;
      return ok({ opportunityId: ctx.topOppId });
    case 'GENERATE_INTELLIGENCE':
      if (!ctx.weakestProductId || params.productId !== ctx.weakestProductId) return null;
      return ok({ productId: ctx.weakestProductId });
    case 'PREP_EVENT_DESIGN':
      if (!ctx.nearestEventReady) return null;
      return ok({});
    case 'ADJUST_AD_BUDGET': {
      const campaignId = params.campaignId;
      const dailyBudget = Number(params.dailyBudget);
      if (typeof campaignId !== 'string' || !ctx.campaignIds.has(campaignId) || !(dailyBudget > 0)) return null;
      return ok({ campaignId, dailyBudget });
    }
    case 'PAUSE_CAMPAIGN': {
      const campaignId = params.campaignId;
      if (typeof campaignId !== 'string' || !ctx.campaignIds.has(campaignId)) return null;
      return ok({ campaignId });
    }
    case 'CONTACT_SUPPLIER':
      if (!ctx.unverifiedSupplierId || params.supplierId !== ctx.unverifiedSupplierId) return null;
      return ok({
        supplierId: ctx.unverifiedSupplierId,
        topic: typeof params.topic === 'string' && params.topic ? params.topic : 'İlk iletişim ve iş birliği teklifi',
      });
    case 'EXIT_NICHE':
      if (!ctx.exitNicheProductId || params.productId !== ctx.exitNicheProductId) return null;
      return ok({ productId: ctx.exitNicheProductId });
    case 'APPLY_SUPPLIER_COST': {
      const m = ctx.supplierCostMatch;
      if (!m || params.productId !== m.productId || params.supplierId !== m.supplierId) return null;
      return ok({ productId: m.productId, supplierId: m.supplierId });
    }
    case 'CREATE_AD_DRAFT':
      if (!ctx.adDraftProductId || params.productId !== ctx.adDraftProductId) return null;
      return ok({ productId: ctx.adDraftProductId });
    case 'GENERIC':
      return ok({});
    default:
      return null;
  }
}

/**
 * Bir kararın "hedefi" — aynı hedef için zaten PENDING bir karar varsa, haftalık rapor
 * tekrar çalıştığında aynı kararı yeniden açmamak için kullanılır (idempotency).
 * GENERIC kararlar serbest metin olduğundan dedup edilmez (her zaman null).
 */
function decisionKey(action: DecisionAction, params: Record<string, unknown>): string | null {
  const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);
  switch (action) {
    case 'CONVERT_OPPORTUNITY': {
      const id = str(params.opportunityId);
      return id ? `${action}:${id}` : null;
    }
    case 'GENERATE_INTELLIGENCE':
    case 'EXIT_NICHE':
    case 'CREATE_AD_DRAFT': {
      const id = str(params.productId);
      return id ? `${action}:${id}` : null;
    }
    case 'PREP_EVENT_DESIGN':
      return action;
    case 'ADJUST_AD_BUDGET':
    case 'PAUSE_CAMPAIGN': {
      const id = str(params.campaignId);
      return id ? `${action}:${id}` : null;
    }
    case 'CONTACT_SUPPLIER': {
      const id = str(params.supplierId);
      return id ? `${action}:${id}` : null;
    }
    case 'APPLY_SUPPLIER_COST': {
      const productId = str(params.productId);
      const supplierId = str(params.supplierId);
      return productId && supplierId ? `${action}:${productId}:${supplierId}` : null;
    }
    case 'GENERIC':
    default:
      return null;
  }
}

/**
 * AI CEO Haftalık Rapor: finans + operasyon skoru + trend + görevleri sentezler,
 * AIReport (CEO) oluşturur, HTML rapor üretip SMTP ile operatöre gönderir.
 * Ayrıca Karar Motoru: AI'nın önerdiği (veya deterministik fallback) kararları
 * AIDecision(PENDING) olarak kaydeder — /ceo "Kararlar" kartında "Uygula"/"Reddet" bekler.
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

  // --- Stratejik sinyaller: en iyi fırsat + yaklaşan etkinlik + ürün zekası (Opportunity-First sentezi) ---
  const topOpp = (await opportunities.top(brandId, 1))[0];
  const nearestEvent = (await events.upcoming(brandId, 1))[0];
  const piList = await productIntelligence.list(brandId, 100);
  const readyPI = piList.filter((p) => p.status === 'READY');
  const avgPIScore = readyPI.length
    ? readyPI.reduce((a, p) => a + (p.scoreTotal ?? 0), 0) / readyPI.length
    : undefined;
  const weakestPI = readyPI.length
    ? readyPI.reduce((min, p) => ((p.scoreTotal ?? 0) < (min.scoreTotal ?? 0) ? p : min))
    : undefined;

  let daysUntilEvent = 0;
  if (topOpp) {
    insights.push(
      `🎯 En öncelikli fırsat: "${topOpp.title}" (${topOpp.kind}, öncelik ${topOpp.priorityScore ?? '—'}/100${topOpp.validationScore != null ? `, doğrulama ${topOpp.validationScore}/100` : ''})`,
    );
  }
  if (nearestEvent) {
    daysUntilEvent = Math.ceil((nearestEvent.eventDate.getTime() - Date.now()) / 86_400_000);
    insights.push(`📅 Yaklaşan etkinlik: "${nearestEvent.name}" (${nearestEvent.category}) — ${daysUntilEvent} gün sonra`);
  }
  if (avgPIScore != null) {
    insights.push(`🧠 Ürün Zekası ortalama skoru: ${avgPIScore.toFixed(0)}/100 (${readyPI.length} ürün)`);
  }

  if (topOpp && topOpp.status === 'VALIDATED') {
    recommendations.push(
      `Fırsatı tasarıma dönüştür: "${topOpp.title}" doğrulamayı geçti (${topOpp.validationScore}/100) — Keşif panelinden dönüştür.`,
    );
  }
  const nearestEventReady = !!nearestEvent && daysUntilEvent <= nearestEvent.prepLeadDays;
  if (nearestEventReady) {
    recommendations.push(
      `"${nearestEvent!.name}" etkinliğine ${daysUntilEvent} gün kaldı — hazırlık penceresindesin, tasarım/kampanya hazırlığını başlat.`,
    );
  }
  if (weakestPI && (weakestPI.scoreTotal ?? 0) < 50) {
    recommendations.push(
      `"${weakestPI.product.title}" ürününün Ürün Zekası skoru düşük (${weakestPI.scoreTotal}/100) — SEO/içerik/kampanya paketini yeniden üret.`,
    );
  }

  // --- Karar Motoru bağlamı: Faz C/D/E sinyalleri + aktif kampanyalar + doğrulanmamış tedarikçi ---
  const [trendAlarmTasks, competitorChangeTasks, activeCampaignsRaw, allSuppliers] = await Promise.all([
    prisma.task.findMany({ where: { brandId, status: 'OPEN', title: { startsWith: '🔔' } }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.task.findMany({
      where: { brandId, status: 'OPEN', OR: [{ title: { startsWith: '📈' } }, { title: { startsWith: '📉' } }] },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    adCampaigns.list(brandId),
    suppliers.list(brandId),
  ]);
  const activeCampaigns = activeCampaignsRaw
    .filter((c) => c.status === 'ACTIVE')
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.name, dailyBudget: c.dailyBudget != null ? Number(c.dailyBudget) : undefined }));
  const unverifiedSuppliers = allSuppliers.filter((s) => !s.verified);
  const unverifiedSupplier = unverifiedSuppliers[0]
    ? { id: unverifiedSuppliers[0].id, company: unverifiedSuppliers[0].company }
    : undefined;

  // --- Karar Motoru ek sinyaller (v2): talep düşüşü / tedarikçi maliyeti / kampanya taslağı ---
  const decliningPI = readyPI.find((p) => {
    if (p.demandScore == null || p.previousDemandScore == null) return false;
    return evaluateProductDemand({ score: p.demandScore, previousScore: p.previousDemandScore }).level === 'DECLINING';
  });
  if (decliningPI) {
    insights.push(
      `📉 Talep düşüşü: "${decliningPI.product.title}" — talep skoru ${decliningPI.demandScore}/100 (önceki: ${decliningPI.previousDemandScore}/100)`,
    );
    recommendations.push(`"${decliningPI.product.title}" ürününde talep sert düşüyor — nişten çıkmayı değerlendir.`);
  }

  const allProducts = await products.list(brandId);
  const cheapestVerifiedSupplier = allSuppliers
    .filter((s) => s.verified && s.unitCost != null && (!s.costCurrency || s.costCurrency === currency))
    .sort((a, b) => Number(a.unitCost) - Number(b.unitCost))[0];
  const cheaperCostProduct = cheapestVerifiedSupplier
    ? allProducts.find((p) => p.cost != null && Number(p.cost) > Number(cheapestVerifiedSupplier.unitCost))
    : undefined;
  if (cheaperCostProduct && cheapestVerifiedSupplier) {
    const oldCost = Number(cheaperCostProduct.cost ?? 0);
    const newCost = Number(cheapestVerifiedSupplier.unitCost);
    insights.push(
      `💰 Maliyet fırsatı: "${cheaperCostProduct.title}" için "${cheapestVerifiedSupplier.company}" daha ucuz (${oldCost.toFixed(2)} → ${newCost.toFixed(2)} ${currency})`,
    );
    recommendations.push(
      `"${cheaperCostProduct.title}" maliyetini "${cheapestVerifiedSupplier.company}" tedarikçisine göre güncelle (${oldCost.toFixed(2)} → ${newCost.toFixed(2)} ${currency}).`,
    );
  }

  const draftCampaigns = await adCampaigns.listDrafts(brandId);
  const draftProductIds = new Set(draftCampaigns.map((c) => c.productId).filter((id): id is string => !!id));
  const adDraftCandidate = readyPI.find((p) => {
    if (draftProductIds.has(p.product.id)) return false;
    const prep = (p.campaignPrep ?? null) as { campaignName?: string } | null;
    return !!prep?.campaignName;
  });
  if (adDraftCandidate) {
    const campaignName = (adDraftCandidate.campaignPrep as { campaignName?: string } | null)?.campaignName ?? '';
    insights.push(`📣 Kampanya hazır: "${adDraftCandidate.product.title}" için Meta taslak kampanyası henüz oluşturulmadı.`);
    recommendations.push(
      `"${adDraftCandidate.product.title}" için hazırlanan kampanya paketini ("${campaignName}") Meta'da taslak olarak oluştur.`,
    );
  }

  // --- Sprint 5 Faz C: Davranış sinyali (Demand Validation V2) ---
  const behaviorMap = new Map(
    allProducts.map((p) => [
      p.id,
      computeBehaviorScore({ pageViews: p.pageViews, cartAdds: p.cartAdds, wishlistAdds: p.wishlistAdds }),
    ]),
  );
  const topBehaviorProduct = allProducts
    .filter((p) => behaviorMap.get(p.id)?.hasSignals ?? false)
    .sort((a, b) => (behaviorMap.get(b.id)?.score ?? 0) - (behaviorMap.get(a.id)?.score ?? 0))[0];
  if (topBehaviorProduct) {
    const bs = behaviorMap.get(topBehaviorProduct.id)!;
    insights.push(
      `📊 Davranış sinyali: "${topBehaviorProduct.title}" — ${bs.score}/100 (👁️${topBehaviorProduct.pageViews ?? 0} görüntülenme, 🛒${topBehaviorProduct.cartAdds ?? 0} sepet, ❤️${topBehaviorProduct.wishlistAdds ?? 0} istek)`,
    );
    if (bs.score >= 50) {
      recommendations.push(
        `"${topBehaviorProduct.title}" ürününe kullanıcı ilgisi yüksek (davranış skoru ${bs.score}/100) — kampanya/stok önceliklendir.`,
      );
    }
  }
  // Talep düşüşü + güçlü davranış çakışması → EXIT_NICHE'i doğrulama uyarısı
  if (decliningPI) {
    const bs = behaviorMap.get(decliningPI.product.id);
    if (bs && bs.score >= 50) {
      insights.push(
        `⚠️ Davranış-Talep çakışması: "${decliningPI.product.title}" trend düşüyor ama kullanıcı etkileşimi güçlü (${bs.score}/100) — nişten çıkmadan önce doğrula.`,
      );
    }
  }

  const decisionCtx: DecisionContext = {
    topOppId: topOpp?.id,
    topOppValidated: topOpp?.status === 'VALIDATED',
    weakestProductId: weakestPI?.product.id,
    nearestEventReady,
    campaignIds: new Set(activeCampaigns.map((c) => c.id)),
    unverifiedSupplierId: unverifiedSupplier?.id,
    exitNicheProductId: decliningPI?.product.id,
    supplierCostMatch:
      cheaperCostProduct && cheapestVerifiedSupplier
        ? { productId: cheaperCostProduct.id, supplierId: cheapestVerifiedSupplier.id }
        : undefined,
    adDraftProductId: adDraftCandidate?.product.id,
  };

  let narrative = `Bu hafta (${week}) özeti: ${insights.join(' · ')}.`;
  let validatedDecisions: ValidatedDecision[] = [];
  try {
    const raw = await ai.text.generate(brandId, {
      prompt: prompts.weeklyStrategy({
        week,
        currency,
        revenue,
        netProfit,
        orderCount,
        opScore: op?.overall,
        topOpportunity: topOpp
          ? {
              id: topOpp.id,
              title: topOpp.title,
              kind: topOpp.kind,
              niche: topOpp.niche,
              priorityScore: topOpp.priorityScore ?? undefined,
              validationScore: topOpp.validationScore ?? undefined,
              status: topOpp.status,
            }
          : undefined,
        nearestEvent: nearestEvent
          ? {
              name: nearestEvent.name,
              category: nearestEvent.category,
              daysUntil: daysUntilEvent,
              eventScore: (nearestEvent.eventScore as { total?: number } | null)?.total,
              prepLeadDays: nearestEvent.prepLeadDays,
            }
          : undefined,
        avgPIScore,
        weakestProduct: weakestPI
          ? { id: weakestPI.product.id, title: weakestPI.product.title, scoreTotal: weakestPI.scoreTotal ?? 0 }
          : undefined,
        activeCampaigns,
        unverifiedSupplier,
        decliningProduct: decliningPI
          ? {
              id: decliningPI.product.id,
              title: decliningPI.product.title,
              demandScore: decliningPI.demandScore ?? 0,
              previousDemandScore: decliningPI.previousDemandScore ?? 0,
            }
          : undefined,
        cheaperSupplierMatch:
          cheaperCostProduct && cheapestVerifiedSupplier
            ? {
                productId: cheaperCostProduct.id,
                productTitle: cheaperCostProduct.title,
                oldCost: Number(cheaperCostProduct.cost ?? 0),
                supplierId: cheapestVerifiedSupplier.id,
                supplierName: cheapestVerifiedSupplier.company,
                newCost: Number(cheapestVerifiedSupplier.unitCost),
              }
            : undefined,
        adDraftCandidate: adDraftCandidate
          ? {
              id: adDraftCandidate.product.id,
              title: adDraftCandidate.product.title,
              campaignName: (adDraftCandidate.campaignPrep as { campaignName?: string } | null)?.campaignName ?? '',
            }
          : undefined,
        signals: {
          trendAlarms: trendAlarmTasks.map((t) => t.title),
          competitorChanges: competitorChangeTasks.map((t) => t.title),
          unverifiedSupplierCount: unverifiedSuppliers.length,
        },
        baseRecommendations: recommendations,
      }),
      temperature: 0.5,
      maxTokens: 900,
    });
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]) as { narrative?: string; recommendations?: string[]; decisions?: unknown[] };
      if (parsed.narrative) narrative = parsed.narrative;
      if (Array.isArray(parsed.recommendations) && parsed.recommendations.length) {
        recommendations.length = 0;
        recommendations.push(...parsed.recommendations.map(String));
      }
      if (Array.isArray(parsed.decisions)) {
        validatedDecisions = parsed.decisions
          .map((d) => validateDecision(d, decisionCtx))
          .filter((d): d is ValidatedDecision => d !== null);
      }
    }
  } catch {
    // anahtar yoksa deterministik özet/öneriler/kararlar kullanılır
  }

  // --- Karar Motoru deterministik fallback (AI yoksa veya hiç geçerli karar üretmediyse) ---
  if (validatedDecisions.length === 0) {
    if (topOpp && topOpp.status === 'VALIDATED') {
      validatedDecisions.push({
        title: `Fırsatı tasarıma dönüştür: "${topOpp.title}"`,
        rationale: `Doğrulama skoru ${topOpp.validationScore}/100 ile eşiği geçti — tasarıma dönüştürülmeye hazır.`,
        action: 'CONVERT_OPPORTUNITY',
        params: { opportunityId: topOpp.id },
      });
    }
    if (weakestPI && (weakestPI.scoreTotal ?? 0) < 50) {
      validatedDecisions.push({
        title: `"${weakestPI.product.title}" için Ürün Zekasını yeniden üret`,
        rationale: `Ürün Zekası skoru ${weakestPI.scoreTotal}/100 ile düşük — SEO/içerik/kampanya paketi yeniden üretilmeli.`,
        action: 'GENERATE_INTELLIGENCE',
        params: { productId: weakestPI.product.id },
      });
    }
    if (decliningPI) {
      validatedDecisions.push({
        title: `"${decliningPI.product.title}" için nişten çıkmayı değerlendir`,
        rationale: `Talep skoru ${decliningPI.demandScore}/100'e düştü (önceki: ${decliningPI.previousDemandScore}/100) — sert düşüş.`,
        action: 'EXIT_NICHE',
        params: { productId: decliningPI.product.id },
      });
    }
    if (cheaperCostProduct && cheapestVerifiedSupplier) {
      validatedDecisions.push({
        title: `"${cheaperCostProduct.title}" maliyetini güncelle`,
        rationale: `"${cheapestVerifiedSupplier.company}" tedarikçisi daha ucuz birim maliyet sunuyor (${Number(cheapestVerifiedSupplier.unitCost).toFixed(2)} ${currency}).`,
        action: 'APPLY_SUPPLIER_COST',
        params: { productId: cheaperCostProduct.id, supplierId: cheapestVerifiedSupplier.id },
      });
    }
    if (adDraftCandidate) {
      validatedDecisions.push({
        title: `"${adDraftCandidate.product.title}" için Meta taslak kampanyası oluştur`,
        rationale: 'Kampanya hazırlık paketi mevcut ama henüz Meta\'da taslak oluşturulmadı.',
        action: 'CREATE_AD_DRAFT',
        params: { productId: adDraftCandidate.product.id },
      });
    }
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

  const pendingDecisions = await decisions.list(brandId, 'PENDING');
  const existingDecisionKeys = new Set(
    pendingDecisions
      .map((d) => decisionKey(d.action, (d.params ?? {}) as Record<string, unknown>))
      .filter((k): k is string => k !== null),
  );

  for (const d of validatedDecisions.slice(0, 5)) {
    const key = decisionKey(d.action, d.params);
    if (key && existingDecisionKeys.has(key)) continue; // aynı hedef için zaten bekleyen karar var
    await decisions.create({
      brandId,
      reportId: report.id,
      title: d.title,
      rationale: d.rationale,
      action: d.action,
      params: d.params,
      confidence: d.confidence,
      expectedImpact: d.expectedImpact,
      riskLevel: d.riskLevel,
    });
    if (key) existingDecisionKeys.add(key);
  }

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
    payload: { week, mailed, recipient, decisions: validatedDecisions.length },
    autonomyLevel: 1,
  });
  logger.info({ brandId, week, mailed, decisions: validatedDecisions.length }, 'haftalık rapor üretildi');
  return { reportId: report.id, mailed, week };
}
