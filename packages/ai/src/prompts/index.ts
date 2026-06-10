import type { ScoredResearchItem } from '@velora/shared';

/**
 * Prompt kayıt defteri — tüm promptlar sürümlenebilir şekilde tek yerde.
 */
export const prompts = {
  /** Araştırma sonuçlarından trend/niş içgörüsü çıkarımı. */
  trendInsight: (query: string, items: ScoredResearchItem[]): string => {
    const top = items
      .slice(0, 15)
      .map((i, idx) => `${idx + 1}. ${i.title} (talep:${i.scores.demandScore} kar:${i.scores.profitScore})`)
      .join('\n');
    return [
      `Aşağıda "${query}" araştırması için skorlanmış ürün/içerik fikirleri var.`,
      'Print-on-demand e-ticaret için en umut verici 3 nişi ve neden öne çıktıklarını Türkçe, kısa madde madde özetle.',
      '',
      top,
    ].join('\n');
  },

  /** Ürün için tasarım briefi. */
  designBrief: (input: { niche: string; audience: string; trends: string[] }): string =>
    [
      `Niş: ${input.niche}`,
      `Hedef kitle: ${input.audience}`,
      `Trendler: ${input.trends.join(', ')}`,
      '',
      'Bu niş için print-on-demand tişört tasarımı briefi üret: konsept, görsel stil, renk paleti, slogan önerileri. Türkçe.',
    ].join('\n'),
} as const;
