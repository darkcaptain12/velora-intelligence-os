import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';
import { fetchText } from '../http';

/**
 * Google Trends — Türkiye günlük yükselen aramalar (RSS, kimlik/tarayıcı GEREKTİRMEZ, güvenilir).
 * "Şu anda neyin trend olduğu" sinyali; sorgudan bağımsız geo=TR akışı döner (TREND fırsatları).
 */
export const googleTrendsAdapter: SourceAdapter = {
  source: 'GOOGLE_TRENDS',
  strategy: 'api',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 50);
    const xml = await fetchText('https://trends.google.com/trending/rss?geo=TR', {
      source: 'GOOGLE_TRENDS',
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    });

    const strip = (s: string) =>
      s
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim();
    const pick = (block: string, tag: string): string | undefined => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      return m?.[1] ? strip(m[1]) : undefined;
    };

    const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1] ?? '');
    const q = query.trim().toLowerCase();

    const items: ResearchItem[] = [];
    for (const b of blocks) {
      const title = pick(b, 'title');
      if (!title) continue;
      const trafficRaw = pick(b, 'ht:approx_traffic') ?? '0';
      const traffic = Number(trafficRaw.replace(/[^\d]/g, '')) || 0;
      const news = pick(b, 'ht:news_item_title');
      items.push({
        source: 'GOOGLE_TRENDS',
        title,
        url: `https://trends.google.com/trends/explore?geo=TR&q=${encodeURIComponent(title)}`,
        score: traffic,
        comments: 0,
        raw: { approxTraffic: trafficRaw, news },
      });
    }
    // Sorgu verildiyse ilgili olanları öne al (yine de tümünü döndür — keşif için).
    const sorted = q
      ? items.sort(
          (a, b) =>
            Number(b.title.toLowerCase().includes(q)) - Number(a.title.toLowerCase().includes(q)),
        )
      : items;
    return sorted.slice(0, limit);
  },
};
