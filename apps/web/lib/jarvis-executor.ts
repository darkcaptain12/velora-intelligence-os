/**
 * Jarvis komut yürütücüsü — server action ve HTTP API route her ikisi de bu fonksiyonu çağırır.
 * `brandId` ve `actor` dışarıdan sağlanır; bu fonksiyon session bağımlılığı taşımaz.
 */

import { audit, emails, prisma, products, suppliers } from '@velora/db';
import { enqueue, getConnection } from '@velora/queue';
import { ai, prompts } from '@velora/ai';
import { fetchProducts } from '@velora/integrations';
import { parseIntent, ActionType } from '@velora/core';
import { IntegrationError } from '@velora/shared';

export interface JarvisResult {
  ok: boolean;
  message: string;
}

const ORB_KEY = 'jarvis:orb:state';
const ORB_TTL = 90;

function setOrbState(patch: {
  status: 'SLEEP' | 'AWAKE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';
  lastCommand?: string | null;
  lastResult?: string | null;
  durationMs?: number | null;
}): void {
  const redis = getConnection();
  redis
    .get(ORB_KEY)
    .then((raw) => {
      const prev = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      const next = {
        ...prev,
        status: patch.status,
        lastCommand: patch.lastCommand !== undefined ? patch.lastCommand : (prev.lastCommand ?? null),
        lastResult: patch.lastResult !== undefined ? patch.lastResult : (prev.lastResult ?? null),
        durationMs: patch.durationMs !== undefined ? patch.durationMs : (prev.durationMs ?? null),
        updatedAt: new Date().toISOString(),
      };
      return redis.setex(ORB_KEY, ORB_TTL, JSON.stringify(next));
    })
    .catch(() => {}); // fire-and-forget — Redis hatası ana akışı kırmasın
}

export async function executeJarvisCommand(
  brandId: string,
  actor: string,
  text: string,
): Promise<JarvisResult> {
  if (!text.trim()) return { ok: false, message: 'Komut gir.' };

  const startTime = Date.now();
  setOrbState({ status: 'PROCESSING', lastCommand: text });

  const intent = parseIntent(text);
  let message = '';

  switch (intent.type) {
    case ActionType.HUNT_TRENDS:
      await enqueue('trendHunt', { brandId });
      message = '✅ Trend avı başlatıldı — İşler sekmesinde takip et.';
      break;

    case ActionType.WATCH_COMPETITORS:
      await enqueue('competitorWatch', { brandId });
      message = '✅ Rakip taraması başlatıldı.';
      break;

    case ActionType.FIND_SUPPLIERS: {
      const query = intent.keyword || text;
      await enqueue('supplierFinder', { brandId, query });
      message = `✅ "${query}" için tedarikçi araması başlatıldı.`;
      break;
    }

    case ActionType.GENERATE_REPORT:
      await enqueue('weeklyReport', { brandId });
      message = '✅ Haftalık CEO raporu kuyruğa alındı.';
      break;

    case ActionType.RUN_DISCOVERY:
      await enqueue('productDiscovery', { brandId });
      message = '✅ Fırsat keşfi başlatıldı.';
      break;

    case ActionType.BACKFILL_PI: {
      const missing = await prisma.product.findMany({
        where: {
          brandId,
          OR: [{ intelligence: null }, { intelligence: { status: { not: 'READY' } } }],
        },
        select: { id: true },
      });
      for (const p of missing) {
        await enqueue('productIntelligence', { productId: p.id });
      }
      message = `✅ ${missing.length} ürün için Ürün Zekası kuyruğa alındı.`;
      break;
    }

    case ActionType.GENERATE_DESIGN:
      await enqueue('autoDesign', { brandId, count: 1 });
      message = '✅ Otomatik tasarım kuyruğa alındı.';
      break;

    case ActionType.GENERATE_VIDEO: {
      const pi = await prisma.productIntelligence.findFirst({
        where: { status: 'READY', product: { brandId, status: { not: 'CLOSED' } } },
        orderBy: { scoreTotal: 'desc' },
        select: { ugc: true, product: { select: { id: true, title: true } } },
      });
      if (!pi?.ugc) {
        message = '⚠️ Video üretilebilecek ürün zekası bulunamadı. Önce "ürün zekası üret" komutunu çalıştır.';
        break;
      }
      const ugcData = pi.ugc as Record<string, unknown>;
      const hooks = Array.isArray(ugcData.hooks) ? (ugcData.hooks as string[]) : [];
      const hook = hooks[0] ?? 'Ürün tanıtım videosu.';
      const scenario = typeof ugcData.scenario === 'string' ? ugcData.scenario : '';
      const prompt = `UGC tarzı ürün tanıtım videosu. Açılış: "${hook}"${scenario ? `. Senaryo: ${scenario}` : ''}. Ürün: ${pi.product?.title ?? 'ürün'}.`;
      const video = await prisma.video.create({
        data: { brandId, productId: pi.product?.id ?? null, type: 'UGC', status: 'GENERATING' },
      });
      await enqueue('video', { videoId: video.id, prompt });
      message = `✅ "${pi.product?.title}" için UGC video kuyruğa alındı.`;
      break;
    }

    case ActionType.FINANCE_SNAPSHOT:
      await enqueue('financeSnapshot', { brandId });
      message = '✅ Finans anlık görüntüsü alınıyor.';
      break;

    case ActionType.SHOPIFY_IMPORT: {
      try {
        const nodes = await fetchProducts(brandId, 100);
        let count = 0;
        let piQueued = 0;
        for (const n of nodes) {
          const price = n.variants?.nodes?.[0]?.price ? Number(n.variants.nodes[0].price) : undefined;
          const product = await products.upsertByShopify(brandId, n.id, { title: n.title, price });
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
        message = `✅ ${count} ürün içe aktarıldı (${piQueued} PI kuyruğa alındı).`;
      } catch (e) {
        if (e instanceof IntegrationError) {
          message = "⚠️ Shopify bağlantısı başarısız. Ayarlar > API Anahtarları'ndan Shopify tokenını kontrol et.";
        } else {
          throw e;
        }
      }
      break;
    }

    case ActionType.SYNC_DEMAND:
      await enqueue('demandSync', { brandId });
      message = '✅ Talep sinyalleri senkronizasyonu başlatıldı.';
      break;

    case ActionType.UPDATE_SEO: {
      const seoProducts = await prisma.product.findMany({
        where: { brandId, status: { not: 'CLOSED' }, shopifyId: { not: null }, intelligence: { status: 'READY' } },
        select: { id: true },
        take: 20,
      });
      for (const p of seoProducts) {
        await enqueue('productIntelligence', { productId: p.id });
      }
      message = `✅ ${seoProducts.length} ürün için SEO/içerik güncellemesi kuyruğa alındı.`;
      break;
    }

    case ActionType.PREPARE_ADS: {
      const adsProducts = await prisma.product.findMany({
        where: {
          brandId,
          status: { not: 'CLOSED' },
          intelligence: { status: 'READY' },
          adCampaigns: { none: {} },
        },
        include: { intelligence: { select: { campaignPrep: true } } },
        take: 5,
      });
      const eligible = adsProducts.filter((p) => {
        const prep = p.intelligence?.campaignPrep as Record<string, unknown> | null;
        return prep && typeof prep.campaignName === 'string' && prep.campaignName;
      });
      if (eligible.length === 0) {
        message = '⚠️ Kampanya taslağı oluşturulacak uygun ürün bulunamadı.';
      } else {
        message = `💡 ${eligible.length} ürün reklam taslağına hazır. Tasarım Direktörü > Ürün Zekası sekmesine git.`;
      }
      break;
    }

    case ActionType.SYNC_ADS:
      await enqueue('adSync', { brandId });
      message = '✅ Meta reklam performansı senkronizasyonu başlatıldı.';
      break;

    case ActionType.RUN_BACKUP:
      await enqueue('backup', { brandId });
      message = "✅ Yedekleme başlatıldı — Yedekleme Merkezi'nde takip et.";
      break;

    case ActionType.DRAFT_SUPPLIER_EMAIL: {
      const keyword = intent.keyword?.toLowerCase();
      const allSuppliers = await suppliers.list(brandId);
      const supplier = keyword
        ? allSuppliers.find((s) => s.company.toLowerCase().includes(keyword))
        : allSuppliers.find((s) => s.verified);
      if (!supplier) {
        message = '❓ Tedarikçi bulunamadı. Operasyon > Tedarikçi sekmesinden ekle.';
        break;
      }
      try {
        const topic = 'Bilgi ve fiyat teklifi talebi';
        const body = await ai.text.generate(brandId, {
          prompt: prompts.draftSupplierEmail({ company: supplier.company, topic }),
          temperature: 0.6,
          maxTokens: 500,
        });
        await emails.create({ brandId, supplierId: supplier.id, direction: 'OUTBOUND', subject: topic, body });
        message = `✅ ${supplier.company} için mail taslağı oluşturuldu.`;
      } catch (e) {
        if (e instanceof IntegrationError) {
          message = '⚠️ Mail taslağı oluşturulamadı: OpenAI anahtarı eksik.';
        } else {
          throw e;
        }
      }
      break;
    }

    case ActionType.DAILY_BRIEF:
      await enqueue('dailyBrief', { brandId });
      message = '✅ Günlük brifing oluşturuluyor — Dashboard\'da görüntüle.';
      break;

    default:
      message = `❓ "${text}" komutunu anlayamadım. Örnek: "trend avla", "rapor üret", "yedek al"`;
  }

  await audit.log({
    brandId,
    actor,
    action: 'jarvis.command',
    entity: 'Brand',
    entityId: brandId,
    payload: { text, intent: intent.type, source: actor },
    autonomyLevel: 2,
  });

  const result = { ok: intent.type !== ActionType.UNKNOWN, message };
  setOrbState({
    status: result.ok ? 'SUCCESS' : 'ERROR',
    lastResult: message,
    durationMs: Date.now() - startTime,
  });
  return result;
}
