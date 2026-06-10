import type { ResearchItem } from '@velora/shared';
import { IntegrationError } from '@velora/shared';
import type { SourceAdapter } from '../types';

interface RedditChild {
  data?: {
    title?: string;
    permalink?: string;
    url?: string;
    ups?: number;
    score?: number;
    num_comments?: number;
    created_utc?: number;
    subreddit?: string;
    author?: string;
  };
}

/**
 * Reddit adaptörü — herkese açık search JSON ucu (kimlik gerektirmez).
 * CLAUDE.md ilkesi gereği Playwright yerine resmi/açık API tercih edilir.
 * Reddit, geçerli bir User-Agent ister; aksi halde 429 döner.
 */
export const redditAdapter: SourceAdapter = {
  source: 'REDDIT',
  strategy: 'api',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 100);
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
      query,
    )}&sort=top&t=month&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        // HTTP başlık değerleri ASCII (ByteString) olmalı — Türkçe karakter kullanma.
        'User-Agent': 'velora-research/0.1 (e-commerce trend research bot)',
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      throw new IntegrationError('REDDIT', `Reddit isteği başarısız (${res.status})`);
    }

    const json = (await res.json()) as { data?: { children?: RedditChild[] } };
    const children = json.data?.children ?? [];

    const items: ResearchItem[] = [];
    for (const child of children) {
      const d = child.data;
      if (!d?.title) continue;
      items.push({
        source: 'REDDIT',
        title: d.title,
        url: d.permalink ? `https://www.reddit.com${d.permalink}` : d.url,
        score: d.ups ?? d.score ?? 0,
        comments: d.num_comments ?? 0,
        createdAt: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : undefined,
        raw: { subreddit: d.subreddit, author: d.author },
      });
    }
    return items;
  },
};
