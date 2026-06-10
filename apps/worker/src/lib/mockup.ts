import sharp from 'sharp';
import type { MockupType } from '@velora/db';

/**
 * Mockup kompozisyon motoru (sharp, yerel — AI gerektirmez).
 * Tasarım PNG'sini giysi şablonu üzerine baskı alanına yerleştirir.
 *
 * NOT: Giysi silüeti SVG ile üretilir (kod tamdır). Üretimde gerçek giysi fotoğrafı
 * şablonları `template` buffer'ı olarak verilerek değiştirilebilir.
 */
interface GarmentConfig {
  width: number;
  height: number;
  color: string;
  label: string;
  print: { x: number; y: number; w: number; h: number };
}

const GARMENTS: Record<MockupType, GarmentConfig> = {
  TSHIRT: { width: 1000, height: 1200, color: '#1f2937', label: 'T-Shirt', print: { x: 320, y: 360, w: 360, h: 420 } },
  HOODIE: { width: 1000, height: 1200, color: '#374151', label: 'Hoodie', print: { x: 330, y: 420, w: 340, h: 360 } },
  SWEATSHIRT: { width: 1000, height: 1200, color: '#4b5563', label: 'Sweatshirt', print: { x: 320, y: 400, w: 360, h: 380 } },
  OVERSIZE: { width: 1000, height: 1200, color: '#111827', label: 'Oversize', print: { x: 300, y: 380, w: 400, h: 420 } },
};

function garmentSvg(g: GarmentConfig): Buffer {
  const { width: w, height: h, color, label } = g;
  const cx = w / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#eceff1"/>
    <!-- sol kol -->
    <polygon points="${cx - 220},170 ${cx - 360},320 ${cx - 280},420 ${cx - 200},300" fill="${color}"/>
    <!-- sağ kol -->
    <polygon points="${cx + 220},170 ${cx + 360},320 ${cx + 280},420 ${cx + 200},300" fill="${color}"/>
    <!-- gövde -->
    <rect x="${cx - 220}" y="200" width="440" height="820" rx="60" fill="${color}"/>
    <!-- yaka -->
    <ellipse cx="${cx}" cy="200" rx="90" ry="50" fill="#eceff1"/>
    <text x="${cx}" y="${h - 50}" font-size="44" font-family="Helvetica, Arial, sans-serif" fill="#607d8b" text-anchor="middle">${label}</text>
  </svg>`;
  return Buffer.from(svg);
}

/** Tasarımı verilen giysi türüne yerleştirip mockup PNG buffer'ı döner. */
export async function renderMockup(designPng: Buffer, type: MockupType): Promise<Buffer> {
  const g = GARMENTS[type];
  const base = sharp(garmentSvg(g)).png();

  const design = await sharp(designPng)
    .resize(g.print.w, g.print.h, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const meta = await sharp(design).metadata();

  const left = g.print.x + Math.round((g.print.w - (meta.width ?? g.print.w)) / 2);
  const top = g.print.y + Math.round((g.print.h - (meta.height ?? g.print.h)) / 2);

  return base.composite([{ input: design, left, top }]).png().toBuffer();
}

export const MOCKUP_TYPES: MockupType[] = ['TSHIRT', 'HOODIE', 'SWEATSHIRT', 'OVERSIZE'];
