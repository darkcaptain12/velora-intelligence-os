import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';

/**
 * TikTok adaptörü — resmi içerik API'si (Research/Display API) onay/ortaklık gerektirir;
 * serbest trend keşfi için pratik değildir. Son çare olarak dikkatli Playwright kullanılır
 * (ToS riski — docs/ARCHITECTURE.md §8/§15). TikTok agresif bot koruması uygular: doğrulama
 * ("press & hold") olası → `ScrapeBlockedError` → Görev Merkezi'ne manuel doğrulama görevi.
 *
 * Tarayıcı binary'si gerekir: `pnpm --filter @velora/scraping exec playwright install chromium`.
 */
function parseCompact(s: string | null | undefined): number {
  if (!s) return 0;
  const m = s.trim().match(/^([\d.]+)\s*([KMB])?/i);
  if (!m) return 0;
  const n = Number(m[1]);
  if (Number.isNaN(n)) return 0;
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? '').toUpperCase()] ?? 1;
  return Math.round(n * mult);
}

export const tiktokAdapter: SourceAdapter = {
  source: 'TIKTOK',
  strategy: 'browser',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 40);
    const { withPage, humanDelay, assertNotBlocked } = await import('../browser-pool');
    const url = `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`;

    return withPage(
      async (page) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await humanDelay(800, 1800);
        await assertNotBlocked(page, 'TIKTOK');
        await page
          .waitForSelector('div[data-e2e="search_video-item"], a[href*="/video/"]', {
            timeout: 12_000,
          })
          .catch(() => undefined);
        await page.mouse.wheel(0, 2000).catch(() => undefined);
        await humanDelay();
        await assertNotBlocked(page, 'TIKTOK');

        const raw = await page.$$eval('a[href*="/video/"]', (links, max) => {
          const seen = new Set<string>();
          const out: { title: string; href: string; likes: string | null }[] = [];
          for (const a of Array.from(links)) {
            const href = (a as HTMLAnchorElement).href;
            if (!href || seen.has(href)) continue;
            const container = a.closest('div[data-e2e="search_video-item"]') ?? a.parentElement;
            const captionEl =
              container?.querySelector('[data-e2e="search-card-video-caption"]') ??
              container?.querySelector('img[alt]');
            const title =
              captionEl?.textContent?.trim() ||
              captionEl?.getAttribute('alt')?.trim() ||
              a.textContent?.trim() ||
              '';
            const likesEl = container?.querySelector('[data-e2e="video-views"], strong');
            if (!title || title.length < 3) continue;
            seen.add(href);
            out.push({ title, href, likes: likesEl?.textContent ?? null });
            if (out.length >= (max as number)) break;
          }
          return out;
        }, limit);

        const items: ResearchItem[] = raw.map((r) => ({
          source: 'TIKTOK' as const,
          title: r.title.slice(0, 300),
          url: r.href,
          score: parseCompact(r.likes),
          comments: 0,
          raw: { likesText: r.likes },
        }));
        return items;
      },
      { proxyUrl: opts?.proxyUrl, locale: 'en-US' },
    );
  },
};
