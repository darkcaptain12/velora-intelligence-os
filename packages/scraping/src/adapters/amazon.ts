import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';

/**
 * Amazon adaptörü — resmi katalog API'si (Product Advertising API) ortaklık/onay
 * gerektirir; bu nedenle son çare olarak dikkatli Playwright kullanılır (ToS riski —
 * docs/ARCHITECTURE.md §8/§15). Agresif bot koruması olası: CAPTCHA → `ScrapeBlockedError`
 * → Görev Merkezi'ne manuel doğrulama görevi.
 *
 * Tarayıcı binary'si gerekir: `pnpm --filter @velora/scraping exec playwright install chromium`.
 */
export const amazonAdapter: SourceAdapter = {
  source: 'AMAZON',
  strategy: 'browser',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 60);
    // Statik import grafiğine Playwright sızmasın diye dinamik import.
    const { withPage, humanDelay, assertNotBlocked } = await import('../browser-pool');
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;

    return withPage(
      async (page) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await humanDelay();
        await assertNotBlocked(page, 'AMAZON');
        await page
          .waitForSelector('div[data-component-type="s-search-result"]', { timeout: 12_000 })
          .catch(() => undefined);

        const raw = await page.$$eval(
          'div[data-component-type="s-search-result"]',
          (cards, max) => {
            const parseCount = (s: string | null | undefined): number => {
              if (!s) return 0;
              const m = s.replace(/[.,]/g, '').match(/\d+/);
              return m ? Number(m[0]) : 0;
            };
            const out: {
              title: string;
              href: string | null;
              reviews: number;
              rating: string | null;
              price: string | null;
            }[] = [];
            for (const card of Array.from(cards).slice(0, max as number)) {
              const titleEl =
                card.querySelector('h2 a span') ?? card.querySelector('h2 span');
              const title = titleEl?.textContent?.trim() ?? '';
              if (!title) continue;
              const linkEl = card.querySelector('h2 a') as HTMLAnchorElement | null;
              const reviewsEl = card.querySelector(
                'span[aria-label$="ratings"], span[aria-label$="rating"], .s-link-style .s-underline-text',
              );
              const ratingEl = card.querySelector('span.a-icon-alt');
              const priceEl = card.querySelector('.a-price .a-offscreen');
              out.push({
                title,
                href: linkEl?.getAttribute('href') ?? null,
                reviews: parseCount(
                  reviewsEl?.getAttribute('aria-label') ?? reviewsEl?.textContent,
                ),
                rating: ratingEl?.textContent?.trim() ?? null,
                price: priceEl?.textContent?.trim() ?? null,
              });
            }
            return out;
          },
          limit,
        );

        const items: ResearchItem[] = raw.map((r) => ({
          source: 'AMAZON' as const,
          title: r.title,
          url: r.href
            ? r.href.startsWith('http')
              ? r.href
              : `https://www.amazon.com${r.href}`
            : undefined,
          score: r.reviews,
          comments: 0,
          raw: { reviews: r.reviews, rating: r.rating, price: r.price },
        }));
        return items;
      },
      { proxyUrl: opts?.proxyUrl, locale: 'en-US' },
    );
  },
};
