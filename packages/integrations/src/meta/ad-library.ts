import { serverEnv } from '@velora/config';
import { credentials } from '@velora/db';
import { IntegrationError } from '@velora/shared';

const GRAPH_VERSION = 'v21.0';
const BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

/** Ad Library (`ads_archive`) herkese açık şeffaflık API'sidir — reklam hesabı gerekmez, sadece token. */
async function resolveAdLibraryToken(brandId: string): Promise<string> {
  const env = serverEnv();
  const token = (await credentials.get(brandId, 'META').catch(() => null)) || env.META_ACCESS_TOKEN;
  if (!token) {
    throw new IntegrationError('META', 'Meta access token yapılandırılmamış');
  }
  return token;
}

export interface MetaLibraryAd {
  id: string;
  pageName?: string;
  body?: string;
  snapshotUrl?: string;
  startTime?: string;
}

interface AdLibraryResponseItem {
  id: string;
  page_name?: string;
  ad_creative_bodies?: string[];
  ad_snapshot_url?: string;
  ad_delivery_start_time?: string;
}

/**
 * Meta Ad Library'den bir sayfanın (rakip) yayınladığı reklamları getirir
 * (Rakip İzleme — Faz C). Reklam hesabı/izni gerektirmez, herkese açık şeffaflık
 * API'sidir; yalnızca geçerli bir Meta erişim token'ı gerekir.
 */
export async function fetchPageAds(brandId: string, pageId: string, limit = 10): Promise<MetaLibraryAd[]> {
  const token = await resolveAdLibraryToken(brandId);
  const url = new URL(`${BASE}/ads_archive`);
  url.searchParams.set('access_token', token);
  url.searchParams.set('search_page_ids', JSON.stringify([pageId]));
  url.searchParams.set('ad_reached_countries', JSON.stringify(['TR']));
  url.searchParams.set('ad_active_status', 'ALL');
  url.searchParams.set('fields', 'id,page_name,ad_creative_bodies,ad_snapshot_url,ad_delivery_start_time');
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url);
  if (!res.ok) {
    throw new IntegrationError('META', `Meta Ad Library GET ads_archive (${res.status})`, await res.text().catch(() => ''));
  }
  const data = (await res.json()) as { data: AdLibraryResponseItem[] };
  return data.data.map((a) => ({
    id: a.id,
    pageName: a.page_name,
    body: a.ad_creative_bodies?.[0],
    snapshotUrl: a.ad_snapshot_url,
    startTime: a.ad_delivery_start_time,
  }));
}
