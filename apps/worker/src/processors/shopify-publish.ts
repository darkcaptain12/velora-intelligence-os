import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { prisma, products } from '@velora/db';
import { ai } from '@velora/ai';
import { createProduct } from '@velora/integrations';
import { logger } from '../logger';

interface ProductPage {
  description: string;
  seoTitle: string;
  seoDescription: string;
  salesCopy: string;
  tags: string[];
  faq: { q: string; a: string }[];
}

function pagePrompt(title: string, context: string): string {
  return [
    `Ürün: "${title}". Bağlam/tasarım: ${context || 'print-on-demand tişört'}.`,
    'Bu ürün için Shopify ürün sayfası içeriği üret. SADECE şu JSON formatında döndür:',
    '{"description":"...","seoTitle":"...","seoDescription":"...","salesCopy":"...","tags":["..."],"faq":[{"q":"...","a":"..."}]}',
    'description=HTML olmayan zengin açıklama, seoTitle<=60 karakter, seoDescription<=155 karakter, salesCopy=kısa ikna edici metin, tags=5-8 etiket, faq=3 soru-cevap. Türkçe.',
  ].join('\n');
}

function parsePage(text: string): ProductPage | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const o = JSON.parse(match[0]) as Partial<ProductPage>;
    if (!o.description || !o.seoTitle) return null;
    return {
      description: String(o.description),
      seoTitle: String(o.seoTitle),
      seoDescription: String(o.seoDescription ?? ''),
      salesCopy: String(o.salesCopy ?? ''),
      tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
      faq: Array.isArray(o.faq) ? o.faq : [],
    };
  } catch {
    return null;
  }
}

function buildHtml(page: ProductPage): string {
  const faq = page.faq
    .map((f) => `<h4>${f.q}</h4><p>${f.a}</p>`)
    .join('\n');
  return [
    `<p>${page.description}</p>`,
    page.salesCopy ? `<p><strong>${page.salesCopy}</strong></p>` : '',
    faq ? `<h3>SSS</h3>${faq}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Otomatik Ürün Sayfası + Shopify yayını:
 * AI içerik üretir (açıklama/SEO/FAQ/satış metni) → Shopify'da ürün oluşturur →
 * Product.shopifyId set + yaşam döngüsü NEW→TEST.
 * OpenAI ve Shopify anahtarları gerekir.
 */
export async function processShopifyPublish(job: Job<JobDataMap['shopifyPublish']>) {
  const { productId } = job.data;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { design: true },
  });
  if (!product) throw new Error(`Ürün bulunamadı: ${productId}`);

  const raw = await ai.text.generate(product.brandId, {
    prompt: pagePrompt(product.title, product.design?.prompt ?? ''),
    temperature: 0.7,
    maxTokens: 1200,
  });
  const page = parsePage(raw);
  if (!page) throw new Error('Ürün sayfası JSON ayrıştırılamadı');

  const created = await createProduct(product.brandId, {
    title: product.title,
    descriptionHtml: buildHtml(page),
    tags: page.tags,
    status: 'DRAFT',
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  });

  await products.setShopify(product.id, created.id, page.salesCopy);
  await products.transition(product.id, 'TEST', "Shopify'a yayınlandı").catch(() => undefined);

  logger.info({ productId, shopifyId: created.id }, 'ürün Shopify\'a yayınlandı');
  return { shopifyId: created.id, handle: created.handle };
}
