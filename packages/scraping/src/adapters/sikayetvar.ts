import type { ResearchItem } from '@velora/shared';
import type { SourceAdapter } from '../types';

/**
 * Şikayetvar — PROBLEM motoru. İnsanların yaşadığı problemleri (şikayetleri) ürün fırsatına
 * çevirmek için şikayet başlıklarını toplar. Resmi API yok → best-effort Playwright.
 * Bot koruması olası → `ScrapeBlockedError` → Görev Merkezi'ne manuel doğrulama görevi.
 */
export const sikayetvarAdapter: SourceAdapter = {
  source: 'SIKAYETVAR',
  strategy: 'browser',
  async scrape(query, opts) {
    const limit = Math.min(opts?.limit ?? 25, 50);
    const { withPage, humanDelay, assertNotBlocked } = await import('../browser-pool');
    const url = `https://www.sikayetvar.com/sikayetler?query=${encodeURIComponent(query)}`;

    return withPage(
      async (page) => {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await humanDelay();
        await assertNotBlocked(page, 'SIKAYETVAR');

        const raw = await page.$$eval(
          '.complaint-title, h2.complaint-title, article h2, a[href*="/sikayet/"]',
          (nodes, max) => {
            const out: { title: string; href: string | null }[] = [];
            const seen = new Set<string>();
            for (const n of Array.from(nodes)) {
              const title = (n.textContent ?? '').replace(/\s+/g, ' ').trim();
              if (title.length < 12 || seen.has(title)) continue;
              seen.add(title);
              const a = (n.closest('a') ?? n.querySelector('a')) as HTMLAnchorElement | null;
              out.push({ title, href: a?.getAttribute('href') ?? null });
              if (out.length >= (max as number)) break;
            }
            return out;
          },
          limit,
        );

        const items: ResearchItem[] = raw.map((r) => ({
          source: 'SIKAYETVAR' as const,
          title: r.title,
          url: r.href
            ? r.href.startsWith('http')
              ? r.href
              : `https://www.sikayetvar.com${r.href}`
            : undefined,
          score: 0,
          comments: 1, // her şikayet bir "problem sinyali"
          raw: { kind: 'complaint' },
        }));
        return items;
      },
      { proxyUrl: opts?.proxyUrl, locale: 'tr-TR' },
    );
  },
};
