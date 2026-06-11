import sharp from 'sharp';

/** XML/SVG özel karakterlerini kaçırır. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Tasarımın üzerine NET (kusursuz) yazı basar — AI görsel üretiminin bozuk yazı
 * sorununu çözer. Yazı SVG ile keskin render edilir, kontrast için beyaz dış hat
 * eklenir. Çok kelimeliyse satırlara bölünür ve alt-orta bölgeye yerleştirilir.
 */
export async function renderTextOverlay(
  designPng: Buffer,
  text: string,
  opts: { fill?: string; stroke?: string } = {},
): Promise<Buffer> {
  const base = sharp(designPng);
  const meta = await base.metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;

  const words = text.trim().toUpperCase().split(/\s+/);
  // 1–2 kelime tek satır; daha fazlası iki satıra dengeli bölünür.
  const lines: string[] =
    words.length <= 2 ? [words.join(' ')] : (() => {
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    })();

  const targetW = Math.round(W * 0.7);
  const fontSize = lines.length > 1 ? Math.round(W * 0.12) : Math.round(W * 0.15);
  const lineH = Math.round(fontSize * 1.05);
  const blockH = lineH * lines.length;
  const startY = Math.round(H * 0.86 - blockH + lineH * 0.8);
  const fill = opts.fill ?? '#161616';
  const stroke = opts.stroke ?? '#ffffff';

  const tspans = lines
    .map((ln, i) => {
      const y = startY + i * lineH;
      return `<text x="${W / 2}" y="${y}" text-anchor="middle" textLength="${targetW}" lengthAdjust="spacingAndGlyphs" font-family="'Arial Black','Archivo Black',Impact,sans-serif" font-weight="900" font-size="${fontSize}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.round(fontSize * 0.07)}" paint-order="stroke" stroke-linejoin="round">${esc(ln)}</text>`;
    })
    .join('');

  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${tspans}</svg>`;
  return base.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
}
