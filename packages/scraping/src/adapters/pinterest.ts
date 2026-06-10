import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';

/**
 * Pinterest adaptörü — resmi API v5 yalnızca sahip olunan içerik + ortak (partner)
 * erişimli "trends" sunar; serbest anahtar kelimeyle pin keşfi (discovery) için açık
 * uç yoktur. Bu nedenle herkese açık arama sayfası dikkatli Playwright ile taranır
 * (ToS riski — docs/ARCHITECTURE.md §8/§15). Login duvarı/bot koruması olası →
 * `ScrapeBlockedError` → Görev Merkezi'ne manuel doğrulama görevi.
 *
 * Tarayıcı binary'si gerekir: `pnpm --filter @velora/scraping exec playwright install chromium`.
 */
export const pinterestAdapter: SourceAdapter = {
  source: 'PINTEREST',
  strategy: 'browser',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 50);
    const { withPage, humanDelay, assertNotBlocked } = await import('../browser-pool');
    const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`;

    return withPage(
      async (page) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await humanDelay(600, 1500);
        await assertNotBlocked(page, 'PINTEREST');
        await page
          .waitForSelector('div[data-test-id="pin"], a[href^="/pin/"]', { timeout: 12_000 })
          .catch(() => undefined);
        // Tembel yüklemeyi tetiklemek için bir miktar kaydır.
        await page.mouse.wheel(0, 2400).catch(() => undefined);
        await humanDelay();
        await assertNotBlocked(page, 'PINTEREST');

        const raw = await page.$$eval('a[href^="/pin/"]', (links, max) => {
          const seen = new Set<string>();
          const out: { title: string; href: string }[] = [];
          for (const a of Array.from(links)) {
            const href = (a as HTMLAnchorElement).getAttribute('href') ?? '';
            if (!href || seen.has(href)) continue;
            const img = a.querySelector('img');
            const title =
              img?.getAttribute('alt')?.trim() ||
              a.getAttribute('aria-label')?.trim() ||
              a.textContent?.trim() ||
              '';
            if (!title || title.length < 3) continue;
            seen.add(href);
            out.push({ title, href });
            if (out.length >= (max as number)) break;
          }
          return out;
        }, limit);

        const items: ResearchItem[] = raw.map((r) => ({
          source: 'PINTEREST' as const,
          title: r.title.slice(0, 300),
          url: r.href.startsWith('http') ? r.href : `https://www.pinterest.com${r.href}`,
          // Pinterest pin etkileşim sayıları herkese açık DOM'da güvenilir değildir.
          score: 0,
          comments: 0,
          raw: { pin: r.href },
        }));
        return items;
      },
      { proxyUrl: opts?.proxyUrl, locale: 'en-US' },
    );
  },
};
