import type { ResearchSource } from '@velora/shared';
import type { SourceAdapter } from './types';
import { redditAdapter } from './adapters/reddit';
import { hackerNewsAdapter } from './adapters/hackernews';
import { etsyAdapter } from './adapters/etsy';
import { pinterestAdapter } from './adapters/pinterest';
import { tiktokAdapter } from './adapters/tiktok';
import { amazonAdapter } from './adapters/amazon';
import { googleTrendsAdapter } from './adapters/google-trends';
import { sikayetvarAdapter } from './adapters/sikayetvar';
import { trendyolAdapter } from './adapters/trendyol';

/**
 * Uygulanmış kaynak adaptörleri. Yeni kaynaklar buraya eklenir.
 * NOT: Tarayıcı tabanlı adaptörler (Pinterest/TikTok/Amazon/Şikayetvar/Trendyol) `browser-pool`'u
 * DİNAMİK import eder; bu yüzden bu modülü import eden web bundle'ına Playwright sızmaz.
 * Google Trends fetch tabanlıdır (RSS, güvenilir).
 */
export const adapters: Partial<Record<ResearchSource, SourceAdapter>> = {
  HACKERNEWS: hackerNewsAdapter,
  REDDIT: redditAdapter,
  ETSY: etsyAdapter,
  PINTEREST: pinterestAdapter,
  TIKTOK: tiktokAdapter,
  AMAZON: amazonAdapter,
  GOOGLE_TRENDS: googleTrendsAdapter,
  SIKAYETVAR: sikayetvarAdapter,
  TRENDYOL: trendyolAdapter,
};

/** Kaynak için adaptörü döner; uygulanmamışsa açık hata fırlatır. */
export function getAdapter(source: ResearchSource): SourceAdapter {
  const adapter = adapters[source];
  if (!adapter) {
    throw new Error(`${source} adaptörü henüz uygulanmadı`);
  }
  return adapter;
}

/** Hangi kaynakların kullanılabilir olduğunu döner (UI için). */
export function availableSources(): ResearchSource[] {
  return Object.keys(adapters) as ResearchSource[];
}

export type { SourceAdapter, ScrapeOptions } from './types';
export { redditAdapter } from './adapters/reddit';
export { hackerNewsAdapter } from './adapters/hackernews';
export { etsyAdapter } from './adapters/etsy';
export { pinterestAdapter } from './adapters/pinterest';
export { tiktokAdapter } from './adapters/tiktok';
export { amazonAdapter } from './adapters/amazon';
export { googleTrendsAdapter } from './adapters/google-trends';
export { sikayetvarAdapter } from './adapters/sikayetvar';
export { trendyolAdapter } from './adapters/trendyol';
export { fetchJson, fetchText, type FetchOptions } from './http';
export { USER_AGENTS, randomUserAgent } from './user-agents';
// NOT: Playwright browser-pool ayrı giriş noktasındadır (`@velora/scraping/browser`)
// böylece ana index'i import eden istemciler (web) Playwright'ı bundle'a çekmez.
