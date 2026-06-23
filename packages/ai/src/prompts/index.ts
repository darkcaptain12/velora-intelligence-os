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
      '  "campaignPrep": {"campaignName":"...", "adSets":[{"name":"...", "audience":"...", "interests":["..."], "dailyBudgetUSD":0}], "hook":"...", "primaryText":"...", "headline":"...", "description":"..."},',
      '  "score": {"salesPotential":0-100, "competition":0-100, "profitability":0-100, "adDifficulty":0-100, "returnRisk":0-100, "supplyRisk":0-100},',
      '  "rationale": "..."',
      '}',
      '',
      'Kurallar: seo.title<=60 karakter, seo.description<=155 karakter, seo.keywords=5-8 anahtar kelime,',
      'seo.handle=kısa-tire-ile-url-uyumlu, content.description=HTML olmayan zengin açıklama (3-5 paragraf),',
      'content.shortDescription<=160 karakter, content.faq=3-5 soru-cevap, ads.primaryText=Facebook/Instagram',
      'reklam metni (1-2 cümle, güçlü çağrı), ads.headline<=40 karakter, salesAngles her biri 1-2 cümle,',
      'audience.interests=5-8 ilgi alanı, ugc.hooks=3-5 video açılış cümlesi, ugc.videoFlows=3-5 sahne akışı,',
      'campaignPrep=Meta (Facebook/Instagram) kampanya HAZIRLIK paketi (otomatik oluşturulmaz, sadece taslak):',
      'campaignPrep.campaignName=marka+ürün+hedef içeren kısa kampanya adı (örn. "Velora — JDM R35 — Trafik"),',
      'campaignPrep.adSets=2-3 farklı hedef kitle denemesi (her biri ayrı audience tanımı + 5-8 ilgi alanı +',
      'günlük bütçe önerisi 5-30 USD arası, ürün fiyatına ve kâr marjına göre kademeli), campaignPrep.hook=ilk',
      '3 saniyede dikkat çekecek tek cümle, campaignPrep.primaryText/headline/description=ads ile aynı',
      'formatta ama kampanya stratejisine özel (genel ads alanından farklı bir varyant olabilir),',
      'score alanlarında YÜKSEK değer = rekabet/reklam zorluğu/iade riski/tedarik riski için KÖTÜ (daha riskli/zor),',
      'salesPotential ve profitability için YÜKSEK = İYİ. rationale=skorun 1-2 cümlelik gerekçesi. Türkçe.',
    ]
      .filter(Boolean)
      .join('\n'),

  /** AI CEO Haftalık Strateji Sentezi: finans + en iyi fırsat + yaklaşan etkinlik + ürün zekası → anlatı + öneriler + kararlar. */
  weeklyStrategy: (input: {
    week: string;
    currency: string;
    revenue: number;
    netProfit: number;
    orderCount: number;
    opScore?: number;
    topOpportunity?: {
      id: string;
      title: string;
      kind: string;
      niche: string;
      priorityScore?: number;
      validationScore?: number;
      status: string;
    };
    nearestEvent?: { name: string; category: string; daysUntil: number; eventScore?: number; prepLeadDays?: number };
    avgPIScore?: number;
    weakestProduct?: { id: string; title: string; scoreTotal: number };
    activeCampaigns?: { id: string; name: string; dailyBudget?: number }[];
    unverifiedSupplier?: { id: string; company: string };
    decliningProduct?: { id: string; title: string; demandScore: number; previousDemandScore: number };
    cheaperSupplierMatch?: {
      productId: string;
      productTitle: string;
      oldCost: number;
      supplierId: string;
      supplierName: string;
      newCost: number;
    };
    adDraftCandidate?: { id: string; title: string; campaignName: string };
    signals?: { trendAlarms: string[]; competitorChanges: string[]; unverifiedSupplierCount: number };
    baseRecommendations: string[];
  }): string =>
    [
      `Hafta: ${input.week}`,
      `Ciro: ${input.revenue.toFixed(0)} ${input.currency} · Net kâr: ${input.netProfit.toFixed(0)} ${input.currency} · Sipariş: ${input.orderCount}`,
      input.opScore != null ? `Operasyon skoru: ${input.opScore.toFixed(0)}/100` : '',
      input.topOpportunity
        ? `En öncelikli fırsat: "${input.topOpportunity.title}" (id: ${input.topOpportunity.id}, tür: ${input.topOpportunity.kind}, niş: ${input.topOpportunity.niche}, öncelik: ${input.topOpportunity.priorityScore ?? '—'}/100, doğrulama: ${input.topOpportunity.validationScore ?? '—'}/100, durum: ${input.topOpportunity.status})`
        : '',
      input.nearestEvent
        ? `Yaklaşan etkinlik: "${input.nearestEvent.name}" (${input.nearestEvent.category}), ${input.nearestEvent.daysUntil} gün sonra${input.nearestEvent.eventScore != null ? `, etkinlik skoru ${input.nearestEvent.eventScore}/100` : ''}${input.nearestEvent.prepLeadDays != null ? `, hazırlık süresi ${input.nearestEvent.prepLeadDays} gün` : ''}`
        : '',
      input.avgPIScore != null ? `Ürün Zekası ortalama skoru: ${input.avgPIScore.toFixed(0)}/100` : '',
      input.weakestProduct ? `En zayıf ürün: "${input.weakestProduct.title}" (id: ${input.weakestProduct.id}, Ürün Zekası skoru ${input.weakestProduct.scoreTotal}/100)` : '',
      input.activeCampaigns?.length
        ? `Aktif reklam kampanyaları: ${input.activeCampaigns.map((c) => `"${c.name}" (id: ${c.id}, günlük bütçe: ${c.dailyBudget ?? '—'})`).join(', ')}`
        : '',
      input.unverifiedSupplier ? `Doğrulanmamış tedarikçi adayı: "${input.unverifiedSupplier.company}" (id: ${input.unverifiedSupplier.id})` : '',
      input.decliningProduct
        ? `Talebi düşen ürün: "${input.decliningProduct.title}" (id: ${input.decliningProduct.id}, talep skoru ${input.decliningProduct.demandScore}/100, önceki ${input.decliningProduct.previousDemandScore}/100)`
        : '',
      input.cheaperSupplierMatch
        ? `Daha ucuz tedarikçi eşleşmesi: "${input.cheaperSupplierMatch.productTitle}" (id: ${input.cheaperSupplierMatch.productId}) için "${input.cheaperSupplierMatch.supplierName}" (id: ${input.cheaperSupplierMatch.supplierId}) — maliyet ${input.cheaperSupplierMatch.oldCost.toFixed(2)} → ${input.cheaperSupplierMatch.newCost.toFixed(2)} ${input.currency}`
        : '',
      input.adDraftCandidate
        ? `Kampanya taslağı bekleyen ürün: "${input.adDraftCandidate.title}" (id: ${input.adDraftCandidate.id}, kampanya: "${input.adDraftCandidate.campaignName}")`
        : '',
      input.signals?.trendAlarms.length ? `Açık trend alarmları: ${input.signals.trendAlarms.join(' | ')}` : '',
      input.signals?.competitorChanges.length ? `Açık rakip fiyat değişimleri: ${input.signals.competitorChanges.join(' | ')}` : '',
      '',
      'Mevcut deterministik öneriler:',
      ...input.baseRecommendations.map((r) => `- ${r}`),
      '',
      "Bir e-ticaret AI CEO'su gibi, yukarıdaki verilerden SADECE şu JSON formatında dön:",
      '{',
      '  "narrative": "...",',
      '  "recommendations": ["...", "..."],',
      '  "decisions": [{"title":"...", "rationale":"...", "action":"...", "params": {}, "confidence":0-100, "expectedImpact":"LOW|MEDIUM|HIGH", "riskLevel":"LOW|MEDIUM|HIGH"}]',
      '}',
      '',
      'Kurallar: narrative=KISA (3-5 cümle) Türkçe yönetici özeti; ciro/kâr/operasyon durumunu, en öncelikli',
      'fırsatı ve yaklaşan etkinliği (varsa) birlikte yorumla — somut stratejik çerçeveleme yap (örn. "Bu',
      'kategoriye ağırlık ver" gibi). recommendations=mevcut deterministik önerileri KORU (gerekirse yeniden',
      'ifade et) VE en iyi fırsat/yaklaşan etkinlik/ürün zekası sinyallerinden 1-3 YENİ somut aksiyon ekle',
      '(örn. fırsatı tasarıma dönüştür, etkinlik için hazırlığı başlat, zayıf üründe içerik/kampanya paketini',
      'yeniden üret). Toplam 3-6 öneri. Türkçe, somut, aksiyona dönük (fiil ile başla).',
      '',
      'decisions=0-3 adet, sadece YUKARIDA VERİLEN id\'leri kullan (ID UYDURMA). Her karar şu action',
      'değerlerinden birini kullanmalı ve params alanını TAM OLARAK belirtilen şekilde doldurmalı:',
      '- "CONVERT_OPPORTUNITY": en öncelikli fırsat durumu VALIDATED ise. params: {"opportunityId":"<id>"}',
      '- "GENERATE_INTELLIGENCE": en zayıf ürünün Ürün Zekası skoru 50\'nin altındaysa. params: {"productId":"<id>"}',
      '- "PREP_EVENT_DESIGN": yaklaşan etkinlik hazırlık süresi içindeyse (gün sayısı <= hazırlık süresi). params: {}',
      '- "ADJUST_AD_BUDGET": aktif bir kampanyanın bütçesini değiştirmeyi önerirsen. params: {"campaignId":"<id>","dailyBudget":<sayı>}',
      '- "PAUSE_CAMPAIGN": aktif bir kampanyayı durdurmayı önerirsen. params: {"campaignId":"<id>"}',
      '- "CONTACT_SUPPLIER": doğrulanmamış tedarikçi adayı varsa iletişime geçmeyi önerirsen. params: {"supplierId":"<id>","topic":"..."}',
      '- "EXIT_NICHE": talebi düşen ürün varsa nişten çıkmayı önerirsen. params: {"productId":"<id>"}',
      '- "APPLY_SUPPLIER_COST": daha ucuz tedarikçi eşleşmesi varsa ürün maliyetini güncellemeyi önerirsen. params: {"productId":"<id>","supplierId":"<id>"}',
      '- "CREATE_AD_DRAFT": kampanya taslağı bekleyen ürün varsa Meta\'da taslak kampanya oluşturmayı önerirsen. params: {"productId":"<id>"}',
      '- "GENERIC": yukarıdakilerden hiçbiri uymuyorsa genel bir takip görevi. params: {}',
      'Koşullar uymuyorsa o kararı ÜRETME — decisions boş dizi de olabilir. title=kısa Türkçe başlık,',
      'rationale=1-2 cümle Türkçe gerekçe. confidence=bu kararın doğruluğuna güven 0-100 (yüksek=eminiz).',
      'expectedImpact=bu kararın beklenen iş etkisi (LOW/MEDIUM/HIGH). riskLevel=bu kararı uygulamanın riski (LOW/MEDIUM/HIGH).',
    ]
      .filter(Boolean)
      .join('\n'),

  /** Tedarikçi Bulucu: web araması ile niş/ürün için gerçek tedarikçi/üretici adayları. */
  supplierFinder: (input: { niche: string; country?: string }): string =>
    [
      `"${input.niche}" için print-on-demand / toptan üretici ve tedarikçi firmaları ara${input.country ? ` (${input.country} odaklı, ama global sonuçlar da kabul)` : ''}.`,
      'Gerçek, güncel web aramasından bulduğun firmaları kullan — uydurma firma adı/iletişim bilgisi YAZMA.',
      'Yalnızca şu JSON formatında dön (başka metin ekleme):',
      '[',
      '  {"company":"...", "email":"...", "phone":"...", "website":"...", "moq":0, "unitCost":0, "costCurrency":"..."}',
      ']',
      '',
      'Kurallar: en fazla 5 aday, her aday gerçek bir firma/web sitesi olmalı, email/phone bulunamazsa alanı boş',
      'string olarak bırak (alanı silme), website mutlaka http(s):// ile başlasın, company kısa ve net firma adı.',
      'moq (minimum sipariş adedi) ve unitCost (birim maliyet) için sayfada/aramada GERÇEK bir rakam',
      'bulamazsan bu iki alanı ve costCurrency\'i tamamen ATLA (uydurma rakam YAZMA) — yalnızca gerçekten',
      'belirtilmiş bir fiyat/MOQ varsa doldur (costCurrency örn. "USD", "TRY").',
    ].join('\n'),

  /** Tedarikçiye gönderilecek e-posta taslağı (konu serbest metin). */
  draftSupplierEmail: (input: { company: string; topic: string }): string =>
    `"${input.company}" adlı tedarikçiye şu konuda profesyonel, kısa ve nazik bir Türkçe e-posta yaz: "${input.topic}". Yalnızca e-posta gövdesini döndür (selamlama + kapanış dahil).`,

  /** AI CEO 2.0 — Günlük brifing analizi (Claude ile). */
  dailyCeoAnalysis: (input: {
    date: string;
    currency: string;
    riskScore: number;
    riskLevel: string;
    riskSignals: { source: string; score: number; detail: string }[];
    topOpportunity?: string | null;
    topRisk?: string | null;
    todayTasks: string[];
    revenue?: number;
    netProfit?: number;
    orderCount?: number;
    opScore?: number;
  }): string =>
    [
      `Tarih: ${input.date}`,
      `Risk Skoru: ${input.riskScore}/100 (${input.riskLevel})`,
      input.riskSignals.length > 0
        ? `Risk Sinyalleri:\n${input.riskSignals.map((s) => `  - ${s.source}: ${s.detail} (${s.score}/100)`).join('\n')}`
        : 'Risk Sinyali: Yok',
      input.topOpportunity ? `En İyi Fırsat: ${input.topOpportunity}` : '',
      input.topRisk ? `En Büyük Risk: ${input.topRisk}` : '',
      input.revenue != null ? `Ciro: ${input.revenue.toFixed(0)} ${input.currency}` : '',
      input.netProfit != null ? `Net Kâr: ${input.netProfit.toFixed(0)} ${input.currency}` : '',
      input.orderCount != null ? `Sipariş: ${input.orderCount}` : '',
      input.opScore != null ? `Operasyon Skoru: ${input.opScore.toFixed(0)}/100` : '',
      input.todayTasks.length > 0 ? `Açık Görevler:\n${input.todayTasks.map((t) => `  - ${t}`).join('\n')}` : '',
      '',
      'Sen bir e-ticaret AI CEO\'susun. Yukarıdaki günlük verileri analiz et.',
      'SADECE şu JSON formatında dön:',
      '{',
      '  "whatHappened": "Dün ne oldu? (2-3 cümle)",',
      '  "whyItHappened": "Neden oldu? (2-3 cümle)",',
      '  "biggestOpportunity": "En büyük fırsat (1 cümle)",',
      '  "biggestRisk": "En büyük risk (1 cümle)",',
      '  "todayActions": ["Bugün yapılacak 1. görev", "2. görev", "3. görev"],',
      '  "confidence": 0-100,',
      '  "narrative": "Kısa yönetici özeti (3-5 cümle Türkçe)"',
      '}',
      '',
      'Kurallar: Türkçe, somut, aksiyona dönük. Genel/belirsiz öneriler YAZMA.',
      'Veri eksikse "henüz yeterli veri yok" de, halüsinasyon YAPMA.',
    ]
      .filter(Boolean)
      .join('\n'),
} as const;
