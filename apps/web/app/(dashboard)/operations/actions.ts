'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { audit, emails, prisma, products, settings, suppliers, tasks, type LifecycleStatus } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai, prompts } from '@velora/ai';
import { fetchProducts, publishPrintifyProduct, shopifyGraphQL } from '@velora/integrations';
import { IntegrationError } from '@velora/shared';
import { computeSupplierScore } from '@velora/core';
import { actionContext } from '@/lib/action-context';
import { applySupplierCostToProduct } from '@/lib/decision-handlers';

/** Tasarımdan ürün oluştur + Shopify'a yayınla (otomatik ürün sayfası işi). */
export async function publishDesign(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      designId: z.string().min(1),
      title: z.string().min(2).max(200),
      price: z.coerce.number().min(0).optional(),
    })
    .parse({
      designId: formData.get('designId'),
      title: formData.get('title'),
      price: formData.get('price') || undefined,
    });

  const product = await products.create({
    brandId,
    title: data.title,
    designId: data.designId,
    price: data.price,
  });
  // Printify pasif (default) → direct Shopify (kendi mockup'larımız); aktifse Printify ürünü.
  const passive = await settings.get<boolean>(brandId, 'printify.passive', true);
  await enqueue(passive ? 'shopifyPublish' : 'printifyPublish', { productId: product.id });
  await audit.log({
    brandId,
    actor,
    action: passive ? 'shopify.publish' : 'printify.prepare',
    entity: 'Product',
    entityId: product.id,
    payload: data,
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

/** Printify ürününü bağlı Shopify mağazasına yayınlar (Printify→Shopify). */
export async function publishProductToShopify(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.printifyProductId || !product.printifyShopId) return;
  try {
    await publishPrintifyProduct(brandId, Number(product.printifyShopId), product.printifyProductId);
    await products.transition(id, 'WINNER', "Shopify'a yayınlandı (Printify)").catch(() => undefined);
    await audit.log({
      brandId,
      actor,
      action: 'printify.publish_shopify',
      entity: 'Product',
      entityId: id,
      autonomyLevel: 2,
    });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
    await audit.log({ brandId, actor, action: 'printify.publish_shopify.failed', entity: 'Product', entityId: id, payload: { error: err.message }, autonomyLevel: 2 });
  }
  revalidatePath('/operations');
}

/** Ürün yaşam döngüsü geçişi. */
export async function transitionProduct(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const to = String(formData.get('to') ?? '') as LifecycleStatus;
  if (!id || !to) return;
  await products.transition(id, to, `Manuel geçiş → ${to}`);
  await audit.log({
    brandId,
    actor,
    action: 'product.lifecycle',
    entity: 'Product',
    entityId: id,
    payload: { to },
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

/** Mağazadaki ürünleri sisteme içe aktarır (Shopify → sistem senkron). */
export async function importFromShopify() {
  const { actor, brandId } = await actionContext();
  try {
    const nodes = await fetchProducts(brandId, 100);
    let count = 0;
    let piQueued = 0;
    for (const n of nodes) {
      const price = n.variants?.nodes?.[0]?.price ? Number(n.variants.nodes[0].price) : undefined;
      const product = await products.upsertByShopify(brandId, n.id, { title: n.title, price });
      // PI zaten READY ise yeniden üretme (token tasarrufu).
      const existingPi = await prisma.productIntelligence.findUnique({
        where: { productId: product.id },
        select: { status: true },
      });
      if (existingPi?.status !== 'READY') {
        await enqueue('productIntelligence', { productId: product.id });
        piQueued += 1;
      }
      count += 1;
    }
    await audit.log({
      brandId,
      actor,
      action: 'shopify.import',
      entity: 'Product',
      payload: { count, piQueued },
      autonomyLevel: 2,
    });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
    await audit.log({ brandId, actor, action: 'shopify.import.failed', entity: 'Brand', payload: { error: err.message }, autonomyLevel: 2 });
  }
  revalidatePath('/operations');
}

/** PI eksik/başarısız ürünler için toplu Ürün Zekası üretimi (tek seferlik). */
export async function backfillProductIntelligence() {
  const { actor, brandId } = await actionContext();
  const missing = await prisma.product.findMany({
    where: {
      brandId,
      OR: [
        { intelligence: null },
        { intelligence: { status: { not: 'READY' } } },
      ],
    },
    select: { id: true },
  });
  for (const p of missing) {
    await enqueue('productIntelligence', { productId: p.id });
  }
  await audit.log({
    brandId,
    actor,
    action: 'product_intelligence.backfill',
    entity: 'Brand',
    entityId: brandId,
    payload: { count: missing.length },
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

/** Manuel ürün ekleme (sisteme; Shopify'a göndermez). */
export async function addManualProduct(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      title: z.string().min(2).max(200),
      price: z.coerce.number().min(0).optional(),
      cost: z.coerce.number().min(0).optional(),
    })
    .parse({
      title: formData.get('title'),
      price: formData.get('price') || undefined,
      cost: formData.get('cost') || undefined,
    });
  const product = await products.create({ brandId, title: data.title, price: data.price, cost: data.cost });
  await audit.log({ brandId, actor, action: 'product.manual', entity: 'Product', entityId: product.id, payload: data, autonomyLevel: 2 });
  revalidatePath('/operations');
}

/** Shopify'da ürünü ACTIVE yapar (satışa aç). */
export async function publishToActive(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product?.shopifyId) return;
  try {
    await shopifyGraphQL(
      brandId,
      'mutation($input: ProductInput!){ productUpdate(input:$input){ product{ id status } userErrors{ message } } }',
      { input: { id: product.shopifyId, status: 'ACTIVE' } },
    );
    await products.transition(id, 'WINNER', 'Satışa açıldı (ACTIVE)').catch(() => undefined);
    await audit.log({ brandId, actor, action: 'shopify.activate', entity: 'Product', entityId: id, autonomyLevel: 2 });
  } catch (err) {
    if (!(err instanceof IntegrationError)) throw err;
  }
  revalidatePath('/operations');
}

/** Shopify sağlık kontrolünü kuyruğa atar. */
export async function runHealthCheck() {
  const { actor, brandId } = await actionContext();
  await enqueue('shopifyHealth', { brandId });
  await audit.log({
    brandId,
    actor,
    action: 'shopify.health',
    entity: 'Brand',
    entityId: brandId,
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

export async function addSupplier(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      company: z.string().min(1).max(160),
      email: z.string().email().optional().or(z.literal('')),
      phone: z.string().max(40).optional(),
      website: z.string().max(200).optional(),
      notes: z.string().max(1000).optional(),
      moq: z.coerce.number().int().positive().optional(),
      unitCost: z.coerce.number().positive().optional(),
      costCurrency: z.string().max(10).optional(),
      deliveryDays: z.coerce.number().int().positive().optional(),
    })
    .parse({
      company: formData.get('company'),
      email: formData.get('email') || '',
      phone: formData.get('phone') || undefined,
      website: formData.get('website') || undefined,
      notes: formData.get('notes') || undefined,
      moq: formData.get('moq') || undefined,
      unitCost: formData.get('unitCost') || undefined,
      costCurrency: formData.get('costCurrency') || undefined,
      deliveryDays: formData.get('deliveryDays') || undefined,
    });
  const { score } = computeSupplierScore({
    verified: true,
    unitCost: data.unitCost,
    costCurrency: data.costCurrency,
    moq: data.moq,
    deliveryDays: data.deliveryDays,
    email: data.email || undefined,
    phone: data.phone,
  });
  await suppliers.create({
    brandId,
    company: data.company,
    email: data.email || undefined,
    phone: data.phone,
    website: data.website,
    notes: data.notes,
    moq: data.moq,
    unitCost: data.unitCost,
    costCurrency: data.costCurrency,
    deliveryDays: data.deliveryDays,
    supplierScore: score,
  });
  await audit.log({ brandId, actor, action: 'supplier.add', entity: 'Supplier', autonomyLevel: 2 });
  revalidatePath('/operations');
}

/** AI ile tedarikçiye e-posta taslağı üretir (OpenAI). */
export async function draftEmail(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ supplierId: z.string().min(1), topic: z.string().min(3).max(300) })
    .parse({ supplierId: formData.get('supplierId'), topic: formData.get('topic') });
  const supplier = await suppliers.getById(data.supplierId);
  if (!supplier) return;

  try {
    const body = await ai.text.generate(brandId, {
      prompt: prompts.draftSupplierEmail({ company: supplier.company, topic: data.topic }),
      temperature: 0.6,
      maxTokens: 500,
    });
    await emails.create({
      brandId,
      supplierId: supplier.id,
      direction: 'OUTBOUND',
      subject: data.topic.slice(0, 70),
      body,
    });
    await audit.log({ brandId, actor, action: 'mail.draft', entity: 'EmailMessage', entityId: supplier.id, autonomyLevel: 2 });
  } catch (err) {
    if (err instanceof IntegrationError) {
      await tasks.create({
        brandId,
        title: 'OpenAI API anahtarını ayarla',
        description: 'Mail taslağı üretilemedi: OpenAI anahtarı eksik. Ayarlar > API Anahtarları.',
        type: 'API_INPUT',
        priority: 1,
      });
    } else {
      throw err;
    }
  }
  revalidatePath('/operations');
}

/** Taslak e-postayı SMTP ile gönderir (Mailhog/üretim SMTP). */
export async function sendSupplierEmail(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await enqueue('mailSend', { emailId: id });
  await audit.log({ brandId, actor, action: 'mail.send', entity: 'EmailMessage', entityId: id, autonomyLevel: 2 });
  revalidatePath('/operations');
}

/** AI web araması ile niş için tedarikçi adayları bulur (doğrulanmamış öneri). */
export async function findSuppliers(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z.object({ niche: z.string().min(2).max(160) }).parse({ niche: formData.get('niche') });
  await enqueue('supplierFinder', { brandId, query: data.niche });
  await audit.log({ brandId, actor, action: 'supplier.find', entity: 'Brand', entityId: brandId, autonomyLevel: 1 });
  revalidatePath('/operations');
}

/** AI önerisi tedarikçiyi operatör onayıyla doğrular; skoru yeniden hesaplar (verified=true +30 puan). */
export async function verifySupplier(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const supplier = await suppliers.getById(id);
  if (!supplier || supplier.brandId !== brandId) return;
  const { score } = computeSupplierScore({
    verified: true,
    unitCost: supplier.unitCost != null ? Number(supplier.unitCost) : null,
    costCurrency: supplier.costCurrency,
    moq: supplier.moq,
    deliveryDays: supplier.deliveryDays,
    email: supplier.email,
    phone: supplier.phone,
  });
  await suppliers.update(id, { supplierScore: score });
  await suppliers.verify(id);
  await audit.log({ brandId, actor, action: 'supplier.verify', entity: 'Supplier', entityId: id, autonomyLevel: 1 });
  revalidatePath('/operations');
}

/** Tedarikçinin MOQ / birim maliyet / para birimini günceller; skoru yeniden hesaplar. */
export async function updateSupplierCost(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      id: z.string().min(1),
      moq: z.coerce.number().int().positive().optional(),
      unitCost: z.coerce.number().positive().optional(),
      costCurrency: z.string().max(10).optional(),
    })
    .parse({
      id: formData.get('id'),
      moq: formData.get('moq') || undefined,
      unitCost: formData.get('unitCost') || undefined,
      costCurrency: formData.get('costCurrency') || undefined,
    });
  const supplier = await suppliers.getById(data.id);
  if (!supplier || supplier.brandId !== brandId) return;
  const { score } = computeSupplierScore({
    verified: supplier.verified,
    unitCost: data.unitCost ?? null,
    costCurrency: data.costCurrency ?? null,
    moq: data.moq ?? null,
    deliveryDays: supplier.deliveryDays,
    email: supplier.email,
    phone: supplier.phone,
  });
  await suppliers.update(data.id, {
    moq: data.moq ?? null,
    unitCost: data.unitCost ?? null,
    costCurrency: data.costCurrency ?? null,
    supplierScore: score,
  });
  await audit.log({ brandId, actor, action: 'supplier.update_cost', entity: 'Supplier', entityId: data.id, autonomyLevel: 2 });
  revalidatePath('/operations');
}

/** Tedarikçinin ortalama teslimat süresini günceller; skoru yeniden hesaplar (Sprint 6 Faz B). */
export async function updateSupplierDelivery(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      id: z.string().min(1),
      deliveryDays: z.coerce.number().int().positive().optional(),
    })
    .parse({
      id: formData.get('id'),
      deliveryDays: formData.get('deliveryDays') || undefined,
    });
  const supplier = await suppliers.getById(data.id);
  if (!supplier || supplier.brandId !== brandId) return;
  const { score } = computeSupplierScore({
    verified: supplier.verified,
    unitCost: supplier.unitCost != null ? Number(supplier.unitCost) : null,
    costCurrency: supplier.costCurrency,
    moq: supplier.moq,
    deliveryDays: data.deliveryDays ?? null,
    email: supplier.email,
    phone: supplier.phone,
  });
  await suppliers.update(data.id, {
    deliveryDays: data.deliveryDays ?? null,
    supplierScore: score,
  });
  await audit.log({
    brandId,
    actor,
    action: 'supplier.update_delivery',
    entity: 'Supplier',
    entityId: data.id,
    payload: { deliveryDays: data.deliveryDays, supplierScore: score },
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

/** Ürün davranış sinyallerini günceller (Demand V2 — Üretim sekmesi manuel giriş). */
export async function updateBehaviorSignals(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({
      id: z.string().min(1),
      pageViews: z.coerce.number().int().min(0).optional(),
      cartAdds: z.coerce.number().int().min(0).optional(),
      wishlistAdds: z.coerce.number().int().min(0).optional(),
    })
    .parse({
      id: formData.get('id'),
      pageViews: formData.get('pageViews') || undefined,
      cartAdds: formData.get('cartAdds') || undefined,
      wishlistAdds: formData.get('wishlistAdds') || undefined,
    });
  const product = await prisma.product.findUnique({ where: { id: data.id } });
  if (!product || product.brandId !== brandId) return;
  await products.setBehavior(data.id, {
    pageViews: data.pageViews,
    cartAdds: data.cartAdds,
    wishlistAdds: data.wishlistAdds,
  });
  await audit.log({
    brandId,
    actor,
    action: 'product.behavior_signals',
    entity: 'Product',
    entityId: data.id,
    payload: { pageViews: data.pageViews, cartAdds: data.cartAdds, wishlistAdds: data.wishlistAdds },
    autonomyLevel: 2,
  });
  revalidatePath('/operations');
}

/** Tedarikçinin birim maliyetini ürüne uygular ("Bu Maliyeti Uygula" — Üretim sekmesi). */
export async function applySupplierCost(formData: FormData) {
  const { actor, brandId } = await actionContext();
  const data = z
    .object({ productId: z.string().min(1), supplierId: z.string().min(1) })
    .parse({ productId: formData.get('productId'), supplierId: formData.get('supplierId') });
  await applySupplierCostToProduct(brandId, actor, data.productId, data.supplierId);
  revalidatePath('/operations');
}
