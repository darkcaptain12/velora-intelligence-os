import { serverEnv } from '@velora/config';
import { credentials } from '@velora/db';
import { IntegrationError } from '@velora/shared';

const BASE = 'https://api.printify.com/v1';

/** Printify API token: markaya özel credential (PRINTIFY) → env fallback. */
async function resolveToken(brandId: string): Promise<string> {
  const env = serverEnv();
  const token =
    (await credentials.get(brandId, 'PRINTIFY').catch(() => null)) || env.PRINTIFY_API_TOKEN;
  if (!token) {
    throw new IntegrationError('PRINTIFY', 'Printify API token yapılandırılmamış');
  }
  return token;
}

/** Printify REST çağrısı (Bearer auth + JSON + hata yönetimi). */
export async function printifyFetch<T>(
  brandId: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const token = await resolveToken(brandId);
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=utf-8',
      'User-Agent': 'Velora-Commerce-OS',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new IntegrationError('PRINTIFY', `Printify HTTP ${res.status}`, text.slice(0, 800));
  }
  return (text ? JSON.parse(text) : null) as T;
}
