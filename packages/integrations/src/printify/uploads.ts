import { printifyFetch } from './client';

export interface PrintifyImage {
  id: string;
  file_name: string;
  width: number;
  height: number;
  preview_url: string;
}

/**
 * Görseli Printify'a yükler → image id döner (ürün baskı alanında kullanılır).
 * `source` ya herkese açık URL ya da base64 içerik olabilir.
 */
export async function uploadImage(
  brandId: string,
  source: { url: string } | { base64: string },
  fileName: string,
): Promise<PrintifyImage> {
  const body =
    'url' in source
      ? { file_name: fileName, url: source.url }
      : { file_name: fileName, contents: source.base64 };
  return printifyFetch<PrintifyImage>(brandId, 'POST', '/uploads/images.json', body);
}
