import { serverEnv } from '@velora/config';
import { credentials } from '@velora/db';
import { IntegrationError } from '@velora/shared';

const GRAPH_VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

interface MetaCreds {
  token: string;
  adAccountId: string;
}

/** Meta kimlik bilgisi çözümü: marka credential (token + meta.adAccountId) → env. */
async function resolveMeta(brandId: string): Promise<MetaCreds> {
  const env = serverEnv();
  const token = (await credentials.get(brandId, 'META').catch(() => null)) || env.META_ACCESS_TOKEN;
  const meta = await credentials.getMeta(brandId, 'META').catch(() => null);
  const adAccountId = (meta?.adAccountId as string | undefined) || env.META_AD_ACCOUNT_ID;
  if (!token || !adAccountId) {
    throw new IntegrationError('META', 'Meta access token / ad account ID yapılandırılmamış');
  }
  return { token, adAccountId: adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}` };
}

async function metaGet<T>(token: string, path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  if (!res.ok) {
    throw new IntegrationError('META', `Meta GET ${path} (${res.status})`, await res.text().catch(() => ''));
  }
  return (await res.json()) as T;
}

async function metaPost(token: string, path: string, body: Record<string, string>): Promise<unknown> {
  const form = new URLSearchParams({ ...body, access_token: token });
  const res = await fetch(`${BASE}/${path}`, { method: 'POST', body: form });
  if (!res.ok) {
    throw new IntegrationError('META', `Meta POST ${path} (${res.status})`, await res.text().catch(() => ''));
  }
  return res.json();
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
}

export async function listCampaigns(brandId: string): Promise<MetaCampaign[]> {
  const { token, adAccountId } = await resolveMeta(brandId);
  const data = await metaGet<{ data: MetaCampaign[] }>(token, `${adAccountId}/campaigns`, {
    fields: 'id,name,status,objective,daily_budget',
    limit: '100',
  });
  return data.data;
}

/** Kampanya durumu (aç/durdur). */
export async function setCampaignStatus(
  brandId: string,
  campaignId: string,
  status: 'ACTIVE' | 'PAUSED',
): Promise<void> {
  const { token } = await resolveMeta(brandId);
  await metaPost(token, campaignId, { status });
}

/** Günlük bütçe (ana para birimi tutarı; Meta minor birim/cent ister). */
export async function setCampaignBudget(
  brandId: string,
  campaignId: string,
  dailyBudgetMajor: number,
): Promise<void> {
  const { token } = await resolveMeta(brandId);
  await metaPost(token, campaignId, { daily_budget: String(Math.round(dailyBudgetMajor * 100)) });
}

export interface MetaInsight {
  campaign_id: string;
  campaign_name?: string;
  spend?: string;
  cpc?: string;
  ctr?: string;
  impressions?: string;
  clicks?: string;
  purchase_roas?: { action_type: string; value: string }[];
  actions?: { action_type: string; value: string }[];
}

export async function fetchCampaignInsights(
  brandId: string,
  datePreset = 'today',
): Promise<MetaInsight[]> {
  const { token, adAccountId } = await resolveMeta(brandId);
  const data = await metaGet<{ data: MetaInsight[] }>(token, `${adAccountId}/insights`, {
    level: 'campaign',
    fields: 'campaign_id,campaign_name,spend,cpc,ctr,impressions,clicks,purchase_roas,actions',
    date_preset: datePreset,
  });
  return data.data;
}

export interface MetaCampaignDraft {
  id: string;
  name: string;
  status: string;
  objective: string;
}

/**
 * Yeni kampanya oluşturur — DAİMA `status: 'PAUSED'` (taslak, kullanıcı onayı ile
 * Meta Ads Manager'dan elle yayınlanır; otomatik yayın YOK — Meta Taslak Kampanya, D5).
 */
export async function createCampaign(
  brandId: string,
  input: { name: string; objective?: string; dailyBudget?: number },
): Promise<MetaCampaignDraft> {
  const { token, adAccountId } = await resolveMeta(brandId);
  const objective = input.objective ?? 'OUTCOME_ENGAGEMENT';
  const body: Record<string, string> = {
    name: input.name,
    objective,
    status: 'PAUSED',
    special_ad_categories: '[]',
  };
  if (input.dailyBudget != null) {
    body.daily_budget = String(Math.round(input.dailyBudget * 100));
  }
  const res = (await metaPost(token, `${adAccountId}/campaigns`, body)) as { id: string };
  return { id: res.id, name: input.name, status: 'PAUSED', objective };
}

export interface MetaInterest {
  id: string;
  name: string;
  audienceSize?: number;
}

/** Ad Set hedeflemesi için ilgi alanı önerisi arar (`GET /search?type=adinterest`). */
export async function searchInterests(brandId: string, query: string): Promise<MetaInterest[]> {
  const { token } = await resolveMeta(brandId);
  const data = await metaGet<{ data: { id: string; name: string; audience_size_lower_bound?: number }[] }>(
    token,
    'search',
    { type: 'adinterest', q: query, limit: '5' },
  );
  return data.data.map((d) => ({ id: d.id, name: d.name, audienceSize: d.audience_size_lower_bound }));
}

export interface MetaAdSetDraft {
  id: string;
  name: string;
  status: string;
}

/**
 * Yeni ad set oluşturur — DAİMA `status: 'PAUSED'` (taslak). Hedefleme: Türkiye +
 * verilen ilgi alanı ID'leri (flexible_spec). Kampanya `PAUSED` olduğundan bu da
 * yayına çıkmaz, sadece Meta Ads Manager'da taslak olarak görünür.
 */
export async function createAdSet(
  brandId: string,
  input: {
    campaignId: string;
    name: string;
    dailyBudget: number;
    interestIds: string[];
    optimizationGoal?: string;
    billingEvent?: string;
  },
): Promise<MetaAdSetDraft> {
  const { token, adAccountId } = await resolveMeta(brandId);
  const targeting: Record<string, unknown> = { geo_locations: { countries: ['TR'] } };
  if (input.interestIds.length > 0) {
    targeting.flexible_spec = [{ interests: input.interestIds.map((id) => ({ id })) }];
  }
  const body: Record<string, string> = {
    name: input.name,
    campaign_id: input.campaignId,
    daily_budget: String(Math.round(input.dailyBudget * 100)),
    billing_event: input.billingEvent ?? 'IMPRESSIONS',
    optimization_goal: input.optimizationGoal ?? 'LINK_CLICKS',
    targeting: JSON.stringify(targeting),
    status: 'PAUSED',
  };
  const res = (await metaPost(token, `${adAccountId}/adsets`, body)) as { id: string };
  return { id: res.id, name: input.name, status: 'PAUSED' };
}
