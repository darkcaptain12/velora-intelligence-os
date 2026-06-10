import { serverEnv } from '@velora/config';
import { credentials, type Provider } from '@velora/db';
import { IntegrationError } from '@velora/shared';

/**
 * API anahtarı çözümü: önce markaya özel şifreli kimlik bilgisi, yoksa env.
 */
export async function resolveKey(brandId: string, provider: Provider): Promise<string | null> {
  const fromDb = await credentials.get(brandId, provider).catch(() => null);
  if (fromDb) return fromDb;

  const env = serverEnv();
  switch (provider) {
    case 'OPENAI':
      return env.OPENAI_API_KEY || null;
    case 'FAL':
      return env.FAL_KEY || null;
    default:
      return null;
  }
}

export async function requireKey(brandId: string, provider: Provider): Promise<string> {
  const key = await resolveKey(brandId, provider);
  if (!key) {
    throw new IntegrationError(provider, `${provider} API anahtarı yapılandırılmamış`);
  }
  return key;
}
