import { prisma, type Provider } from '@velora/db';

/** Yaklaşık birim fiyatlar (USD / token). Maliyet takibi için kaba tahmin. */
const PRICING: Record<string, { in: number; out: number }> = {
  'gpt-4o-mini': { in: 0.15 / 1_000_000, out: 0.6 / 1_000_000 },
  'gpt-4o': { in: 2.5 / 1_000_000, out: 10 / 1_000_000 },
  'text-embedding-3-small': { in: 0.02 / 1_000_000, out: 0 },
  'text-embedding-3-large': { in: 0.13 / 1_000_000, out: 0 },
};

export function estimateCost(model: string, tokensIn = 0, tokensOut = 0): number {
  const p = PRICING[model];
  if (!p) return 0;
  return tokensIn * p.in + tokensOut * p.out;
}

export interface UsageInput {
  brandId: string;
  provider: Provider;
  model: string;
  tokensIn?: number;
  tokensOut?: number;
  cost?: number;
}

/** Her AI çağrısının token/maliyet kaydını tutar (bütçe kontrolü + finans). */
export async function logUsage(input: UsageInput): Promise<void> {
  const cost = input.cost ?? estimateCost(input.model, input.tokensIn, input.tokensOut);
  await prisma.usageLog.create({
    data: {
      brandId: input.brandId,
      provider: input.provider,
      model: input.model,
      tokensIn: input.tokensIn,
      tokensOut: input.tokensOut,
      cost,
    },
  });
}
