export interface BehaviorScoreInput {
  pageViews?: number | null;
  cartAdds?: number | null;
  wishlistAdds?: number | null;
}

export interface BehaviorScoreResult {
  score: number; // 0-100
  viewContribution: number;
  cartContribution: number;
  wishlistContribution: number;
  hasSignals: boolean;
}

/**
 * Kullanıcı davranışı sinyallerinden deterministik Davranış Skoru hesaplar (0-100).
 * Ağırlıklar: Görüntülenme %50 · Sepete Ekle %30 · İstek Listesi %20
 * Hiç sinyal yoksa (null/0) hasSignals=false döner.
 */
export function computeBehaviorScore(input: BehaviorScoreInput): BehaviorScoreResult {
  const views = Math.max(0, input.pageViews ?? 0);
  const carts = Math.max(0, input.cartAdds ?? 0);
  const wishlist = Math.max(0, input.wishlistAdds ?? 0);

  // Her kanalın katkısı: doğrusal cap (1000 görüntülenme → tam 50 puan)
  const viewContribution = Math.min(50, Math.round(views / 20));
  const cartContribution = Math.min(30, Math.round(carts / 3));
  const wishlistContribution = Math.min(20, Math.round(wishlist / 3));

  const score = viewContribution + cartContribution + wishlistContribution;
  const hasSignals = views > 0 || carts > 0 || wishlist > 0;

  return { score, viewContribution, cartContribution, wishlistContribution, hasSignals };
}
