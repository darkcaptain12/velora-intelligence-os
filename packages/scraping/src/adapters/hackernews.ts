import type { ResearchItem } from '@velora/shared';
import { IntegrationError } from '@velora/shared';
import type { SourceAdapter } from '../types';

interface HnHit {
  title?: string;
  url?: string;
  objectID?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
  author?: string;
}

/**
 * Hacker News adaptörü — Algolia arama API'si (kimlik gerektirmez, kararlı).
 * Ürün/teknoloji/trend sinyalleri için güvenilir kaynak.
 */
export const hackerNewsAdapter: SourceAdapter = {
  source: 'HACKERNEWS',
  strategy: 'api',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 50);
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
      query,
    )}&tags=story&hitsPerPage=${limit}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new IntegrationError('HACKERNEWS', `Hacker News isteği başarısız (${res.status})`);
    }

    const json = (await res.json()) as { hits?: HnHit[] };
    const hits = json.hits ?? [];

    const items: ResearchItem[] = [];
    for (const h of hits) {
      if (!h.title) continue;
      items.push({
        source: 'HACKERNEWS',
        title: h.title,
        url: h.url ?? (h.objectID ? `https://news.ycombinator.com/item?id=${h.objectID}` : undefined),
        score: h.points ?? 0,
        comments: h.num_comments ?? 0,
        createdAt: h.created_at,
        raw: { author: h.author, objectID: h.objectID },
      });
    }
    return items;
  },
};
