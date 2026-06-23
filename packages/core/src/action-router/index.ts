/** Jarvis Aksiyon Router — anahtar-kelime tabanlı niyet ayrıştırıcı (deterministik, AI gerektirmez). */

export enum ActionType {
  HUNT_TRENDS = 'HUNT_TRENDS',
  WATCH_COMPETITORS = 'WATCH_COMPETITORS',
  FIND_SUPPLIERS = 'FIND_SUPPLIERS',
  GENERATE_REPORT = 'GENERATE_REPORT',
  RUN_DISCOVERY = 'RUN_DISCOVERY',
  BACKFILL_PI = 'BACKFILL_PI',
  GENERATE_DESIGN = 'GENERATE_DESIGN',
  GENERATE_VIDEO = 'GENERATE_VIDEO',
  FINANCE_SNAPSHOT = 'FINANCE_SNAPSHOT',
  SHOPIFY_IMPORT = 'SHOPIFY_IMPORT',
  DRAFT_SUPPLIER_EMAIL = 'DRAFT_SUPPLIER_EMAIL',
  SYNC_DEMAND = 'SYNC_DEMAND',
  UPDATE_SEO = 'UPDATE_SEO',
  PREPARE_ADS = 'PREPARE_ADS',
  SYNC_ADS = 'SYNC_ADS',
  RUN_BACKUP = 'RUN_BACKUP',
  DAILY_BRIEF = 'DAILY_BRIEF',
  UNKNOWN = 'UNKNOWN',
}

export interface Intent {
  type: ActionType;
  /** FIND_SUPPLIERS için kullanıcıdan çıkarılan niş/ürün anahtar kelimesi. */
  keyword?: string;
}

interface Pattern {
  type: ActionType;
  keywords: string[];
  /** Anahtar kelimeden sonraki metni konu olarak çıkarır (FIND_SUPPLIERS). */
  extractAfter?: boolean;
}

const PATTERNS: Pattern[] = [
  { type: ActionType.HUNT_TRENDS, keywords: ['trend avla', 'trendleri avla', 'trend av', 'trend tara', 'niş tara', 'trendleri bul'] },
  { type: ActionType.WATCH_COMPETITORS, keywords: ['rakipleri tara', 'rakip tara', 'tüm rakipleri', 'rakipleri izle', 'competitor tara'] },
  { type: ActionType.FIND_SUPPLIERS, keywords: ['tedarikçi bul', 'tedarikçi ara', 'supplier bul', 'supplier ara'], extractAfter: true },
  { type: ActionType.GENERATE_REPORT, keywords: ['rapor üret', 'haftalık rapor', 'ceo raporu', 'rapor oluştur', 'raporu üret'] },
  { type: ActionType.RUN_DISCOVERY, keywords: ['fırsat bul', 'fırsatları tara', 'keşif başlat', 'keşfet', 'discovery başlat'] },
  { type: ActionType.BACKFILL_PI, keywords: ['ürün zekası üret', 'pi backfill', 'ürün zekası doldur', 'zeka üret', 'pi güncelle'] },
  { type: ActionType.GENERATE_DESIGN, keywords: ['tasarım üret', 'yeni tasarım', 'tasarım oluştur', 'otomatik tasarım'] },
  { type: ActionType.GENERATE_VIDEO, keywords: ['video üret', 'ugc üret', 'video oluştur', 'reel üret', 'tiktok videosu'] },
  { type: ActionType.FINANCE_SNAPSHOT, keywords: ['finans güncelle', 'gelir hesapla', 'finans snapshot', 'finans al', 'kâr hesapla'] },
  { type: ActionType.SHOPIFY_IMPORT, keywords: ['shopify içe aktar', 'ürünleri içe aktar', 'shopify senkron', 'shopify güncelle'] },
  { type: ActionType.DRAFT_SUPPLIER_EMAIL, keywords: ['mail yaz', 'mail taslağı', 'tedarikçi mail', 'mail oluştur'], extractAfter: true },
  { type: ActionType.SYNC_DEMAND, keywords: ['talep senkronla', 'talep güncelle', 'davranış kaydet', 'demand sync', 'haftalık talep'] },
  { type: ActionType.UPDATE_SEO, keywords: ['seo güncelle', 'seo yenile', 'shopify seo', 'içerik güncelle', 'ürün içeriği güncelle'] },
  { type: ActionType.PREPARE_ADS, keywords: ['reklam hazırla', 'kampanya hazırla', 'meta kampanya', 'reklam taslağı'] },
  { type: ActionType.SYNC_ADS, keywords: ['reklamları senkronla', 'meta senkronla', 'reklam performansı', 'kampanyaları güncelle', 'reklam senkron'] },
  { type: ActionType.RUN_BACKUP, keywords: ['yedek al', 'yedekleme yap', 'backup al', 'veri yedekle', 'sistem yedekle'] },
  { type: ActionType.DAILY_BRIEF, keywords: ['günlük brifing', 'daily brief', 'bugün ne yapmalıyım', 'risk analizi', 'günlük özet', 'brifing oluştur'] },
];

/**
 * Serbest metin komutundan niyet çıkarır.
 * Öncelik sırası: pattern listesinin üst sıraları kazanır.
 */
export function parseIntent(text: string): Intent {
  const normalized = text.toLowerCase().trim();

  for (const pattern of PATTERNS) {
    for (const kw of pattern.keywords) {
      const idx = normalized.indexOf(kw);
      if (idx !== -1) {
        let keyword: string | undefined;
        if (pattern.extractAfter) {
          const after = normalized.slice(idx + kw.length).trim();
          keyword = after || normalized;
        }
        return { type: pattern.type, keyword };
      }
    }
  }

  return { type: ActionType.UNKNOWN };
}
