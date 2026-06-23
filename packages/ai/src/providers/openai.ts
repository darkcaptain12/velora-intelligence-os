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

export interface WebSearchResult {
  text: string;
  sources: { title: string; url: string }[];
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

  /** OpenAI Responses API + web_search_preview aracı ile gerçek web araması. */
  async searchWeb(
    brandId: string,
    opts: { query: string; instructions?: string; model?: string },
  ): Promise<WebSearchResult> {
    const oa = await client(brandId);
    const model = opts.model ?? 'gpt-4o-mini';
    const res = await oa.responses.create({
      model,
      tools: [{ type: 'web_search_preview' }],
      input: opts.instructions ? `${opts.instructions}\n\n${opts.query}` : opts.query,
    });
    await logUsage({
      brandId,
      provider: 'OPENAI',
      model,
      tokensIn: res.usage?.input_tokens,
      tokensOut: res.usage?.output_tokens,
    });
    const sources: { title: string; url: string }[] = [];
    for (const item of res.output ?? []) {
      if (item.type !== 'message') continue;
      for (const part of item.content ?? []) {
        if (part.type !== 'output_text') continue;
        for (const ann of part.annotations ?? []) {
          if (ann.type === 'url_citation') sources.push({ title: ann.title, url: ann.url });
        }
      }
    }
    return { text: res.output_text ?? '', sources };
  },
};
