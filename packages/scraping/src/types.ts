import type { ResearchItem, ResearchSource } from '@velora/shared';

/** Adaptör çağrı seçenekleri. */
export interface ScrapeOptions {
  /** Maksimum öğe sayısı. */
  limit?: number;
  /**
   * Kaynağın resmi API'si için anahtar / erişim token'ı (marka credential → env).
   * Worker çözer ve geçirir; adaptör gerekiyorsa kullanır.
   */
  credential?: string;
  /** Proxy URL override (boşsa env `SCRAPER_PROXY_URL` kullanılır). */
  proxyUrl?: string;
}

/** Tüm kaynak adaptörlerinin uyduğu sözleşme. CLAUDE.md ilkesi: API > Playwright. */
export interface SourceAdapter {
  source: ResearchSource;
  /** Veri toplama stratejisi (gözlemlenebilirlik / UI ipucu). */
  strategy: 'api' | 'browser';
  /** Resmi API anahtarı/token zorunlu mu (UI'da uyarı için). */
  requiresCredential?: boolean;
  /** Sorgu için normalize edilmiş araştırma öğelerini döner. */
  scrape(query: string, opts?: ScrapeOptions): Promise<ResearchItem[]>;
}
