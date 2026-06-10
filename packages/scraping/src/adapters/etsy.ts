import type { ResearchItem } from '@velora/shared';
import { IntegrationError } from '@velora/shared';
import type { SourceAdapter } from '../types';
import { fetchJson } from '../http';

/**
 * Etsy adaptörü — resmi Etsy Open API v3 (`x-api-key`, uygulama düzeyi, OAuth gerekmez).
 * CLAUDE.md ilkesi gereği Playwright yerine resmi API tercih edilir.
 *
 * Anahtar: Ayarlar → Etsy (marka credential) veya env `ETSY_API_KEY`. Worker çözer.
 * Uç: GET /v3/application/listings/active?keywords=&limit=&sort_on=score
 */
interface EtsyPrice {
  amount?: number;
  divisor?: number;
  currency_code?: string;
}

interface EtsyListing {
  listing_id?: number;
  title?: string;
  description?: string;
  url?: string;
  num_favorers?: number;
  views?: number;
  price?: EtsyPrice;
  tags?: string[];
  original_creation_timestamp?: number;
  created_timestamp?: number;
}

interface EtsyResponse {
  count?: number;
  results?: EtsyListing[];
}

function priceToNumber(p?: EtsyPrice): number | undefined {
  if (!p || typeof p.amount !== 'number' || !p.divisor) return undefined;
  return p.amount / p.divisor;
}

export const etsyAdapter: SourceAdapter = {
  source: 'ETSY',
  strategy: 'api',
  requiresCredential: true,
  async scrape(query, opts) {
    const apiKey = opts?.credential;
    if (!apiKey) {
      throw new IntegrationError(
        'ETSY',
        'Etsy API anahtarı yapılandırılmamış (Ayarlar → Etsy veya ETSY_API_KEY)',
      );
    }
    const limit = Math.min(opts?.limit ?? 25, 100);
    const url =
      `https://openapi.etsy.com/v3/application/listings/active` +
      `?keywords=${encodeURIComponent(query)}&limit=${limit}&sort_on=score&sort_order=down`;

    const json = await fetchJson<EtsyResponse>(url, {
      source: 'ETSY',
      headers: { 'x-api-key': apiKey },
    });

    const items: ResearchItem[] = [];
    for (const l of json.results ?? []) {
      if (!l.title) continue;
      const ts = l.original_creation_timestamp ?? l.created_timestamp;
      items.push({
        source: 'ETSY',
        title: l.title,
        url: l.url,
        // Etsy etkileşim sinyali: favori sayısı (+ varsa görüntülenme).
        score: (l.num_favorers ?? 0) + (l.views ?? 0),
        comments: 0,
        createdAt: ts ? new Date(ts * 1000).toISOString() : undefined,
        raw: {
          listingId: l.listing_id,
          price: priceToNumber(l.price),
          currency: l.price?.currency_code,
          numFavorers: l.num_favorers,
          tags: l.tags,
        },
      });
    }
    return items;
  },
};
