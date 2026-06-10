import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { adCampaigns, adMetrics, audit, settings } from '@velora/db';
import {
  fetchCampaignInsights,
  listCampaigns,
  setCampaignBudget,
  setCampaignStatus,
  type MetaInsight,
} from '@velora/integrations';
import { decideAdAction } from '@velora/core';
import { logger } from '../logger';

function parseRoas(ins: MetaInsight): number | null {
  const v = ins.purchase_roas?.[0]?.value;
  return v ? Number(v) : null;
}

function parseConversions(ins: MetaInsight): number {
  const purchase = ins.actions?.find(
    (a) => a.action_type === 'purchase' || a.action_type === 'offsite_conversion.fb_pixel_purchase',
  );
  return purchase ? Number(purchase.value) : 0;
}

/**
 * Meta reklam senkronu: kampanyaları + günlük insights'ı çeker → AdCampaign/AdMetric.
 * Otomatik mod açık + otonomi L3 ise performansa göre ölçekle/durdur uygular.
 * Meta token/ad account gerekir.
 */
export async function processAdSync(job: Job<JobDataMap['adSync']>) {
  const { brandId } = job.data;

  const campaigns = await listCampaigns(brandId);
  for (const c of campaigns) {
    await adCampaigns.upsert(brandId, c.id, {
      name: c.name,
      status: c.status,
      objective: c.objective,
      dailyBudget: c.daily_budget ? Number(c.daily_budget) / 100 : undefined,
    });
  }

  const insights = await fetchCampaignInsights(brandId, 'today');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const autoMode = await settings.get<boolean>(brandId, 'ads.autoMode', false);
  const level = await settings.get<number>(brandId, 'autonomy.level', 1);
  const autoApply = autoMode && level >= 3;
  const actions: { campaignId: string; action: string }[] = [];

  let count = 0;
  for (const ins of insights) {
    const spend = Number(ins.spend ?? 0);
    const clicks = Number(ins.clicks ?? 0);
    const impressions = Number(ins.impressions ?? 0);
    const conversions = parseConversions(ins);
    const roas = parseRoas(ins);
    const cpa = conversions > 0 ? spend / conversions : null;

    await adMetrics.upsert({
      brandId,
      level: 'CAMPAIGN',
      refId: ins.campaign_id,
      date: today,
      spend,
      roas,
      cpa,
      cpc: ins.cpc ? Number(ins.cpc) : null,
      ctr: ins.ctr ? Number(ins.ctr) : null,
      impressions,
      clicks,
      conversions,
    });
    count += 1;

    if (autoApply) {
      const decision = decideAdAction({ spend, roas, cpa });
      if (decision === 'PAUSE') {
        await setCampaignStatus(brandId, ins.campaign_id, 'PAUSED').catch(() => undefined);
        const local = await adCampaigns.findByMeta(brandId, ins.campaign_id);
        if (local) await adCampaigns.setStatus(local.id, 'PAUSED');
        actions.push({ campaignId: ins.campaign_id, action: 'PAUSE' });
      } else if (decision === 'SCALE') {
        const local = await adCampaigns.findByMeta(brandId, ins.campaign_id);
        if (local?.dailyBudget) {
          await setCampaignBudget(brandId, ins.campaign_id, Number(local.dailyBudget) * 1.2).catch(
            () => undefined,
          );
          actions.push({ campaignId: ins.campaign_id, action: 'SCALE' });
        }
      }
    }
  }

  if (actions.length > 0) {
    await audit.log({
      brandId,
      actor: 'ai',
      action: 'ads.autoMode',
      entity: 'AdCampaign',
      payload: { actions },
      autonomyLevel: 3,
    });
  }

  logger.info({ brandId, campaigns: campaigns.length, metrics: count, autoApply, actions: actions.length }, 'reklam senkron');
  return { campaigns: campaigns.length, metrics: count, actions };
}
