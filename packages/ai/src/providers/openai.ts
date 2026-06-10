import OpenAI from 'openai';
import { requireKey } from '../keys';
import { logUsage } from '../usage';

async function client(brandId: string): Promise<OpenAI> {
  const apiKey = await requireKey(brandId, 'OPENAI');
  return new OpenAI({ apiKey });
}

export interface TextOptions {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const openaiProvider = {
  async generateText(brandId: string, opts: TextOptions): Promise<string> {
    const oa = await client(brandId);
    const model = opts.model ?? 'gpt-4o-mini';
    const res = await oa.chat.completions.create({
      model,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.maxTokens,
      messages: [
        ...(opts.system ? [{ role: 'system' as const, content: opts.system }] : []),
        { role: 'user' as const, content: opts.prompt },
      ],
    });
    await logUsage({
      brandId,
      provider: 'OPENAI',
      model,
      tokensIn: res.usage?.prompt_tokens,
      tokensOut: res.usage?.completion_tokens,
    });
    return res.choices[0]?.message?.content ?? '';
  },

  async describeImage(
    brandId: string,
    opts: { imageUrl: string; prompt?: string; model?: string },
  ): Promise<string> {
    const oa = await client(brandId);
    const model = opts.model ?? 'gpt-4o-mini';
    const res = await oa.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: opts.prompt ?? 'Bu görseli ayrıntılı açıkla.' },
            { type: 'image_url', image_url: { url: opts.imageUrl } },
          ],
        },
      ],
    });
    await logUsage({
      brandId,
      provider: 'OPENAI',
      model,
      tokensIn: res.usage?.prompt_tokens,
      tokensOut: res.usage?.completion_tokens,
    });
    return res.choices[0]?.message?.content ?? '';
  },

  async embed(
    brandId: string,
    texts: string[],
    model = 'text-embedding-3-small',
  ): Promise<number[][]> {
    const oa = await client(brandId);
    const res = await oa.embeddings.create({ model, input: texts });
    await logUsage({ brandId, provider: 'OPENAI', model, tokensIn: res.usage?.prompt_tokens });
    return res.data.map((d) => d.embedding);
  },
};
