import sharp from 'sharp';

/**
 * Baskıya hazır şeffaf PNG üretir: tasarımın DIŞ (arka plan) beyaz bölgesini kenardan
 * flood-fill ile şeffaf yapar. Tasarımın İÇ beyazları (highlight vb.) korunur —
 * sadece dışarıdan erişilebilen düz beyaz zemin silinir. Mockup DEĞİL, basılan grafiktir.
 */
export async function makePrintReady(designPng: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(designPng)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const px = data as Uint8Array;

  const isBg = (p: number) => {
    const i = p * channels;
    return (px[i] ?? 0) > 236 && (px[i + 1] ?? 0) > 236 && (px[i + 2] ?? 0) > 236;
  };

  const visited = new Uint8Array(width * height);
  const stack: number[] = [];
  const seed = (x: number, y: number) => {
    const p = y * width + x;
    if (!visited[p] && isBg(p)) {
      visited[p] = 1;
      px[p * channels + 3] = 0;
      stack.push(p);
    }
  };
  for (let x = 0; x < width; x++) {
    seed(x, 0);
    seed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    seed(0, y);
    seed(width - 1, y);
  }
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % width;
    const y = (p / width) | 0;
    if (x > 0) seed(x - 1, y);
    if (x < width - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < height - 1) seed(x, y + 1);
  }

  return sharp(px, { raw: { width, height, channels } }).png().toBuffer();
}
