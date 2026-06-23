import Anthropic from '@anthropic-ai/sdk';
import { resolveKey } from '../keys';
import { logUsage } from '../usage';

async function client(brandId: string): Promise<Anthropic> {
  const apiKey =
    (await resolveKey(brandId, 'ANTHROPIC')) ??
    process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY ayarlanmamış');
  }
  return new Anthropic({ apiKey });
}

export interface ClaudeTextOptions {
  prompt: string;
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const claudeProvider = {
  async generateText(brandId: string, opts: ClaudeTextOptions): Promise<string> {
    const claude = await client(brandId);
    const model = opts.model ?? 'claude-sonnet-4-6';
    const res = await claude.messages.create({
      model,
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.7,
      ...(opts.system ? { system: opts.system } : {}),
      messages: [{ role: 'user', content: opts.prompt }],
    });
    const text =
      res.content[0]?.type === 'text' ? res.content[0].text : '';
    await logUsage({
      brandId,
      provider: 'OPENAI',
      model,
      tokensIn: res.usage?.input_tokens,
      tokensOut: res.usage?.output_tokens,
    });
    return text;
  },
};
