/** Ürün araştırma alan tipleri (kaynak-bağımsız). */

export type ResearchSource =
  | 'TIKTOK'
  | 'PINTEREST'
  | 'ETSY'
  | 'AMAZON'
  | 'REDDIT'
  | 'HACKERNEWS'
  | 'TRENDYOL'
  | 'HEPSIBURADA'
  | 'SIKAYETVAR'
  | 'INSTAGRAM'
  | 'GOOGLE_TRENDS';

/** Bir kaynaktan normalize edilmiş ham araştırma öğesi. */
export interface ResearchItem {
  source: ResearchSource;
  title: string;
  url?: string;
  /** Beğeni / upvote / etkileşim sayısı */
  score?: number;
  /** Yorum sayısı */
  comments?: number;
  /** ISO oluşturulma zamanı */
  createdAt?: string;
  /** Kaynağın orijinal yükü (denetim/yeniden işleme için) */
  raw?: unknown;
}

/** Skorlama motorunun ürettiği puanlar (0–100). */
export interface ResearchScores {
  demandScore: number;
  competitionScore: number;
  salesPotential: number;
  profitScore: number;
}

export type ScoredResearchItem = ResearchItem & { scores: ResearchScores };
