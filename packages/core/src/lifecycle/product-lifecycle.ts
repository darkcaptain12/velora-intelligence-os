/**
 * Ürün Yaşam Döngüsü durum makinesi (CLAUDE.md: Yeni→Test→Kazanan→Ölçekleniyor→Düşüşte→Kapatıldı).
 * Saf/deterministik; @velora/db enum'u ile aynı değerleri kullanır.
 */
export type LifecycleStatus =
  | 'NEW'
  | 'TEST'
  | 'WINNER'
  | 'SCALING'
  | 'DECLINING'
  | 'CLOSED';

const TRANSITIONS: Record<LifecycleStatus, LifecycleStatus[]> = {
  NEW: ['TEST', 'CLOSED'],
  TEST: ['WINNER', 'DECLINING', 'CLOSED'],
  WINNER: ['SCALING', 'DECLINING', 'CLOSED'],
  SCALING: ['WINNER', 'DECLINING', 'CLOSED'],
  DECLINING: ['SCALING', 'CLOSED'],
  CLOSED: [],
};

export const LIFECYCLE_LABELS: Record<LifecycleStatus, string> = {
  NEW: 'Yeni',
  TEST: 'Test',
  WINNER: 'Kazanan',
  SCALING: 'Ölçekleniyor',
  DECLINING: 'Düşüşte',
  CLOSED: 'Kapatıldı',
};

/** `from` durumundan geçilebilecek durumlar. */
export function nextStates(from: LifecycleStatus): LifecycleStatus[] {
  return TRANSITIONS[from] ?? [];
}

/** Geçiş geçerli mi? */
export function canTransition(from: LifecycleStatus, to: LifecycleStatus): boolean {
  return nextStates(from).includes(to);
}
