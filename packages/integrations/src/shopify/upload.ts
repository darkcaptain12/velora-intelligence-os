import { IntegrationError } from '@velora/shared';
import { shopifyGraphQL } from './client';

interface StagedTarget {
  url: string;
  resourceUrl: string;
  parameters: { name: string; value: string }[];
}

/**
 * Görsel byte'larını Shopify'a doğrudan yükler (staged upload) ve `resourceUrl` döner.
 * Bu sayede görselin herkese açık bir URL'de barınması GEREKMEZ — tünel/CDN bağımlılığı yok.
 * Dönen resourceUrl, productCreate `media.originalSource` olarak kullanılır.
 */
export async function stageUploadImage(
  brandId: string,
  buffer: Buffer,
  filename: string,
  mimeType = 'image/png',
): Promise<string> {
  const mutation = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`;
  const data = await shopifyGraphQL<{
    stagedUploadsCreate: { stagedTargets: StagedTarget[]; userErrors: { message: string }[] };
  }>(brandId, mutation, {
    input: [{ filename, mimeType, httpMethod: 'POST', resource: 'IMAGE' }],
  });

  if (data.stagedUploadsCreate.userErrors.length > 0) {
    throw new IntegrationError('SHOPIFY', 'Staged upload başlatılamadı', data.stagedUploadsCreate.userErrors);
  }
  const target = data.stagedUploadsCreate.stagedTargets[0];
  if (!target) throw new IntegrationError('SHOPIFY', 'Staged upload hedefi boş');

  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append('file', new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);

  const res = await fetch(target.url, { method: 'POST', body: form });
  if (!(res.ok || res.status === 201 || res.status === 204)) {
    throw new IntegrationError('SHOPIFY', `Görsel byte yüklemesi başarısız (${res.status})`);
  }
  return target.resourceUrl;
}
