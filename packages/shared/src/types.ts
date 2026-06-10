/** CLAUDE.md'de tanımlı otonomi seviyeleri. */
export enum AutonomyLevel {
  /** Öner / analiz et / onay bekle */
  SUGGEST = 1,
  /** İşlemi yap / raporla */
  ACT = 2,
  /** Tam otomatik */
  AUTONOMOUS = 3,
}

/** Para birimi cinsinden tutar (kuruş hassasiyeti için string Decimal taşınır). */
export type Money = string;

/** Genel sayfalama girdisi. */
export interface Pagination {
  page: number;
  pageSize: number;
}

/** Standart API zarf yanıtı. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: unknown } };
