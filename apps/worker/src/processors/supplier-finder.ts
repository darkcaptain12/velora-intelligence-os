import type { Job } from 'bullmq';
import type { JobDataMap } from '@velora/queue';
import { suppliers, tasks } from '@velora/db';
import { ai, prompts } from '@velora/ai';
import { computeSupplierScore } from '@velora/core';
import { IntegrationError } from '@velora/shared';
import { logger } from '../logger';

interface SupplierCandidate {
  company: string;
  email?: string;
  phone?: string;
  website?: string;
  moq?: number;
  unitCost?: number;
  costCurrency?: string;
}

/** Model yanıtından tedarikçi adayı JSON dizisini çıkarır; başarısızsa []. */
function parseCandidates(text: string): SupplierCandidate[] {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return [];
  try {
    const arr = JSON.parse(match[0]) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr
      .filter(
        (c): c is Record<string, unknown> =>
          !!c && typeof c === 'object' && typeof (c as Record<string, unknown>).company === 'string' && (c as Record<string, unknown>).company !== '',
      )
      .slice(0, 5)
      .map((c) => ({
        company: String(c.company).trim(),
        email: typeof c.email === 'string' && c.email.trim() ? c.email.trim() : undefined,
        phone: typeof c.phone === 'string' && c.phone.trim() ? c.phone.trim() : undefined,
        website: typeof c.website === 'string' && c.website.trim() ? c.website.trim() : undefined,
        moq: typeof c.moq === 'number' && c.moq > 0 ? Math.round(c.moq) : undefined,
        unitCost: typeof c.unitCost === 'number' && c.unitCost > 0 ? c.unitCost : undefined,
        costCurrency: typeof c.costCurrency === 'string' && c.costCurrency.trim() ? c.costCurrency.trim().toUpperCase() : undefined,
      }));
  } catch {
    return [];
  }
}

/**
 * Tedarikçi Bulucu: OpenAI web araması (web_search_preview) ile niş/ürün için gerçek
 * tedarikçi/üretici adayları bulur. Bulunan adaylar `verified:false` kaydedilir —
 * operatör "Doğrula" ile onaylar (Level 1 "Öner"; API > Playwright önceliği).
 */
export async function processSupplierFinder(job: Job<JobDataMap['supplierFinder']>) {
  const { brandId, query } = job.data;

  try {
    const result = await ai.search.web(brandId, {
      query: prompts.supplierFinder({ niche: query }),
    });

    const candidates = parseCandidates(result.text);
    let created = 0;
    for (const c of candidates) {
      const sourceNote = result.sources.length
        ? ` — kaynaklar: ${result.sources.map((s) => s.url).join(', ')}`
        : '';
      const { score } = computeSupplierScore({
        verified: false,
        unitCost: c.unitCost,
        costCurrency: c.costCurrency,
        moq: c.moq,
        email: c.email,
        phone: c.phone,
      });
      await suppliers.create({
        brandId,
        company: c.company,
        email: c.email,
        phone: c.phone,
        website: c.website,
        verified: false,
        moq: c.moq,
        unitCost: c.unitCost,
        costCurrency: c.costCurrency,
        supplierScore: score,
        notes: `AI önerisi (web araması): "${query}"${sourceNote}`,
      });
      created++;
    }

    logger.info({ brandId, query, created }, 'tedarikçi bulucu tamamlandı');
    return { created };
  } catch (e) {
    if (e instanceof IntegrationError) {
      await tasks.create({
        brandId,
        title: 'OpenAI API anahtarını ayarla',
        description: `Tedarikçi araması yapılamadı ("${query}"): OpenAI anahtarı eksik. Ayarlar > API Anahtarları.`,
        type: 'API_INPUT',
        priority: 1,
      });
      logger.warn({ brandId, query }, 'tedarikçi bulucu: OpenAI anahtarı eksik');
      return { created: 0, skipped: true };
    }
    throw e;
  }
}
