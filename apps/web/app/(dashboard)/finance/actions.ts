'use server';

import { revalidatePath } from 'next/cache';
import { audit, finance, prisma, tasks, type Prisma } from '@velora/db';
import { enqueue } from '@velora/queue';
import { ai } from '@velora/ai';
import { IntegrationError } from '@velora/shared';
import { actionContext } from '@/lib/action-context';

/** Bugünün finans anlık görüntüsünü kuyruğa atar. */
export async function runFinanceSnapshot() {
  const { actor, brandId } = await actionContext();
  await enqueue('financeSnapshot', { brandId });
  await audit.log({ brandId, actor, action: 'finance.snapshot', entity: 'Brand', entityId: brandId, autonomyLevel: 2 });
  revalidatePath('/finance');
}

/** Son finans verilerinden AI finansal yorum üretir (AIReport FINANCE). */
export async function generateFinancialComment() {
  const { actor, brandId } = await actionContext();
  const snaps = await finance.latest(brandId, 14);
  if (snaps.length === 0) {
    await tasks.create({
      brandId,
      title: 'Finans verisi yok',
      description: 'Yorum için önce "Anlık Görüntü Al" çalıştırın (sipariş/harcama verisi gerekir).',
      type: 'GENERIC',
      priority: 3,
    });
    revalidatePath('/finance');
    return;
  }

  const summary = snaps
    .map((s) => `${s.date.toISOString().slice(0, 10)}: ciro ${s.revenue}, net kâr ${s.netProfit}, sipariş ${s.orders}`)
    .join('\n');

  try {
    const text = await ai.text.generate(brandId, {
      prompt: `Aşağıdaki günlük finans verilerine bakarak KISA Türkçe finansal yorum ve 2 somut öneri ver:\n${summary}`,
      temperature: 0.5,
      maxTokens: 600,
    });
    await prisma.aIReport.create({
      data: {
        brandId,
        type: 'FINANCE',
        period: new Date().toISOString().slice(0, 10),
        summary: text,
        insights: [] as unknown as Prisma.InputJsonValue,
        recommendations: [] as unknown as Prisma.InputJsonValue,
      },
    });
    await audit.log({ brandId, actor, action: 'finance.comment', entity: 'AIReport', autonomyLevel: 2 });
  } catch (err) {
    if (err instanceof IntegrationError) {
      await tasks.create({
        brandId,
        title: 'OpenAI API anahtarını ayarla',
        description: 'Finansal yorum üretilemedi: OpenAI anahtarı eksik. Ayarlar > API Anahtarları.',
        type: 'API_INPUT',
        priority: 1,
      });
    } else {
      throw err;
    }
  }
  revalidatePath('/finance');
}
