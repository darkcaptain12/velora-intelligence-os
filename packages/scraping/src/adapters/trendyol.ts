import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';

/**
 * Trendyol — TR pazar talep sinyali (en çok değerlendirilen/satan ürünler). Resmi açık API yok
 * → best-effort Playwright. Bot koruması olası → `ScrapeBlockedError` → manuel doğrulama görevi.
 */
export const trendyolAdapter: SourceAdapter = {
  source: 'TRENDYOL',
  strategy: 'browser',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 50);
    const { withPage, humanDelay, assertNotBlocked } = await import('../browser-pool');
    const url = `https://www.trendyol.com/sr?q=${encodeURIComponent(query)}`;

    return withPage(
      async (page) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await humanDelay();
        await assertNotBlocked(page, 'TRENDYOL');
        await page.waitForSelector('.p-card-wrppr', { timeout: 12_000 }).catch(() => undefined);

        const raw = await page.$$eval(
          '.p-card-wrppr',
          (cards, max) => {
            const parseCount = (s: string | null | undefined): number => {
              if (!s) return 0;
              const m = s.replace(/[.,]/g, '').match(/\d+/);
              return m ? Number(m[0]) : 0;
            };
            const out: { title: string; href: string | null; reviews: number; price: string | null }[] = [];
            for (const card of Array.from(cards).slice(0, max as number)) {
              const brand = card.querySelector('.prdct-desc-cntnr-ttl')?.textContent?.trim() ?? '';
              const name = card.querySelector('.prdct-desc-cntnr-name')?.textContent?.trim() ?? '';
              const title = `${brand} ${name}`.replace(/\s+/g, ' ').trim();
              if (!title) continue;
              const a = card.querySelector('a') as HTMLAnchorElement | null;
              const reviews = parseCount(card.querySelector('.ratingCount')?.textContent);
              const price = card.querySelector('.prc-box-dscntd, .prc-box-sllng')?.textContent?.trim() ?? null;
              out.push({ title, href: a?.getAttribute('href') ?? null, reviews, price });
            }
            return out;
          },
          limit,
        );

        const items: ResearchItem[] = raw.map((r) => ({
          source: 'TRENDYOL' as const,
          title: r.title,
          url: r.href ? (r.href.startsWith('http') ? r.href : `https://www.trendyol.com${r.href}`) : undefined,
          score: r.reviews,
          comments: 0,
          raw: { reviews: r.reviews, price: r.price },
        }));
        return items;
      },
      { proxyUrl: opts?.proxyUrl, locale: 'tr-TR' },
    );
  },
};
