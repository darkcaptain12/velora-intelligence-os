import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, productIntelligence } from '@velora/db';
import { ai, prompts } from '@velora/ai';
import { scoreProductIntelligence, type ProductIntelligenceSignals } from '@velora/core';
import { updateProductSeoAndContent } from '@velora/integrations';
import { logger } from '../logger';

interface PIContent {
  description: string;
  shortDescription: string;
  story: string;
  faq: { question: string; answer: string }[];
}

interface CampaignAdSet {
  name: string;
  audience: string;
  interests: string[];
  dailyBudgetUSD: number;
}

interface CampaignPrep {
  campaignName: string;
  adSets: CampaignAdSet[];
  hook: string;
  primaryText: string;
  headline: string;
  description: string;
}

interface PIResult {
  seo: { title: string; description: string; keywords: string[]; handle: string };
  content: PIContent;
  ads: { primaryText: string; headline: string; description: string };
  salesAngles: Record<string, string>;
  audience: { primary: string; secondary: string; ageGroup: string; interests: string[] };
  ugc: { brief: string; scenario: string; hooks: string[]; videoFlows: string[] };
  campaignPrep: CampaignPrep;
  score: ProductIntelligenceSignals;
  rationale: string;
}

/** Model yanıtından Ürün Zekası JSON paketini çıkarır; başarısızsa null. */
function parseResult(text: string): PIResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const o = JSON.parse(match[0]) as Partial<PIResult> & Record<string, unknown>;
    const seo = (o.seo ?? {}) as Partial<PIResult['seo']>;
    const content = (o.content ?? {}) as Partial<PIContent>;
    if (!seo.title || !content.description) return null;
    return {
      seo: {
        title: String(seo.title),
        description: String(seo.description ?? ''),
        keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String) : [],
        handle: String(seo.handle ?? ''),
      },
      content: {
        description: String(content.description),
        shortDescription: String(content.shortDescription ?? ''),
        story: String(content.story ?? ''),
        faq: Array.isArray(content.faq) ? content.faq : [],
      },
      ads: (o.ads ?? { primaryText: '', headline: '', description: '' }) as PIResult['ads'],
      salesAngles: (o.salesAngles ?? {}) as Record<string, string>,
      audience: (o.audience ?? { primary: '', secondary: '', ageGroup: '', interests: [] }) as PIResult['audience'],
      ugc: (o.ugc ?? { brief: '', scenario: '', hooks: [], videoFlows: [] }) as PIResult['ugc'],
      campaignPrep: (o.campaignPrep ?? {
        campaignName: '',
        adSets: [],
        hook: '',
        primaryText: '',
        headline: '',
        description: '',
      }) as CampaignPrep,
      score: (o.score ?? {}) as ProductIntelligenceSignals,
      rationale: String(o.rationale ?? ''),
    };
  } catch {
    return null;
  }
}

/** İçerik paketinden Shopify body_html üretir. */
function buildDescriptionHtml(content: PIContent): string {
  const paragraphs = content.description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join('\n');
  const story = content.story ? `<h3>Hikaye</h3><p>${content.story}</p>` : '';
  const faq = content.faq.length
    ? `<h3>SSS</h3>${content.faq.map((f) => `<h4>${f.question}</h4><p>${f.answer}</p>`).join('\n')}`
    : '';
  return [paragraphs, story, faq].filter(Boolean).join('\n');
}

/**
 * Ürün Zekası Motoru: Shopify ürün create/update webhook'unda tetiklenir.
 * AI ile SEO + İçerik + Reklam + Satış Açısı + Kitle + UGC üretir, Product Intelligence Score
 * hesaplar (deterministik 6-boyut), sonucu kaydeder ve (varsa) Shopify ürününe SEO/içerik geri yazar.
 * OpenAI anahtarı gerekir.
 */
export async function processProductIntelligence(job: Job<JobDataMap['productIntelligence']>) {
  const { productId } = job.data;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { design: true },
  });
  if (!product) throw new Error(`Ürün bulunamadı: ${productId}`);

  await productIntelligence.start(product.brandId, product.id);

  try {
    const raw = await ai.text.generate(product.brandId, {
      prompt: prompts.productIntelligence({
        title: product.title,
        niche: product.design?.prompt,
        context: product.design?.prompt,
        price: product.price != null ? Number(product.price) : undefined,
      }),
      temperature: 0.7,
      maxTokens: 1800,
    });

    const parsed = parseResult(raw);
    if (!parsed) throw new Error('Ürün zekası JSON ayrıştırılamadı');

    const score = scoreProductIntelligence(parsed.score);
    const descriptionHtml = buildDescriptionHtml(parsed.content);

    await productIntelligence.setResult(productId, {
      seoTitle: parsed.seo.title,
      seoDescription: parsed.seo.description,
      seoKeywords: parsed.seo.keywords,
      handle: parsed.seo.handle,
      description: descriptionHtml,
      shortDescription: parsed.content.shortDescription,
      story: parsed.content.story,
      faq: parsed.content.faq,
      ads: parsed.ads,
      salesAngles: parsed.salesAngles,
      audience: parsed.audience,
      ugc: parsed.ugc,
      campaignPrep: parsed.campaignPrep,
      score,
      scoreTotal: score.total,
      aiRationale: parsed.rationale,
    });

    if (product.shopifyId) {
      try {
        await updateProductSeoAndContent(product.brandId, product.shopifyId, {
          descriptionHtml,
          seoTitle: parsed.seo.title,
          seoDescription: parsed.seo.description,
          tags: parsed.seo.keywords,
          handle: parsed.seo.handle || undefined,
        });
      } catch (e) {
        logger.warn({ productId, err: (e as Error).message }, "ürün zekası Shopify'a yazılamadı");
      }
    }

    logger.info({ productId, scoreTotal: score.total }, 'ürün zekası üretildi');
    return { scoreTotal: score.total };
  } catch (e) {
    await productIntelligence.setFailed(productId);
    throw e;
  }
}
