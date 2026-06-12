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

  /** Product Intelligence Engine: SEO + İçerik + Reklam + Satış Açısı + Kitle + UGC + skor. */
  productIntelligence: (input: {
    title: string;
    niche?: string;
    context?: string;
    price?: number;
    currency?: string;
  }): string =>
    [
      `Ürün: "${input.title}"`,
      input.niche ? `Niş: ${input.niche}` : '',
      input.context ? `Bağlam/tasarım: ${input.context}` : '',
      input.price != null ? `Fiyat: ${input.price} ${input.currency ?? 'TRY'}` : '',
      '',
      'Bu print-on-demand tişört ürünü için aşağıdaki "Ürün Zekası" paketini üret. SADECE şu JSON formatında döndür:',
      '{',
      '  "seo": {"title":"...", "description":"...", "keywords":["..."], "handle":"..."},',
      '  "content": {"description":"...", "shortDescription":"...", "story":"...", "faq":[{"question":"...","answer":"..."}]},',
      '  "ads": {"primaryText":"...", "headline":"...", "description":"..."},',
      '  "salesAngles": {"emotional":"...", "premium":"...", "humorous":"...", "gift":"...", "problemSolving":"..."},',
      '  "audience": {"primary":"...", "secondary":"...", "ageGroup":"...", "interests":["..."]},',
      '  "ugc": {"brief":"...", "scenario":"...", "hooks":["..."], "videoFlows":["..."]},',
      '  "score": {"salesPotential":0-100, "competition":0-100, "profitability":0-100, "adDifficulty":0-100, "returnRisk":0-100, "supplyRisk":0-100},',
      '  "rationale": "..."',
      '}',
      '',
      'Kurallar: seo.title<=60 karakter, seo.description<=155 karakter, seo.keywords=5-8 anahtar kelime,',
      'seo.handle=kısa-tire-ile-url-uyumlu, content.description=HTML olmayan zengin açıklama (3-5 paragraf),',
      'content.shortDescription<=160 karakter, content.faq=3-5 soru-cevap, ads.primaryText=Facebook/Instagram',
      'reklam metni (1-2 cümle, güçlü çağrı), ads.headline<=40 karakter, salesAngles her biri 1-2 cümle,',
      'audience.interests=5-8 ilgi alanı, ugc.hooks=3-5 video açılış cümlesi, ugc.videoFlows=3-5 sahne akışı,',
      'score alanlarında YÜKSEK değer = rekabet/reklam zorluğu/iade riski/tedarik riski için KÖTÜ (daha riskli/zor),',
      'salesPotential ve profitability için YÜKSEK = İYİ. rationale=skorun 1-2 cümlelik gerekçesi. Türkçe.',
    ]
      .filter(Boolean)
      .join('\n'),
} as const;
