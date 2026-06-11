import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import type { MockupType } from '@velora/db';

/**
 * Mockup kompozisyon motoru (gerçekçi) — gerçek boş giysi/model fotoğrafı şablonu
 * üzerine tasarımı `multiply` blend ile basar: beyaz zemin görünmez, baskı kumaş
 * gölgesini/kıvrımını takip eder. Şablonlar `src/assets/mockups/*.png` (Fal üretimi).
 *
 * Varsayılan set bir tişört ürünü için 3 sunum verir (CLAUDE.md "gerçek ürün görseli"):
 *   MODEL_FRONT (kapak — modelin üstünde önden), TSHIRT (düz/flat-lay), MODEL_ANGLE (açılı).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TPL_DIR = path.join(__dirname, '../assets/mockups');

interface GarmentConfig {
  file: string;
  /** Baskı alanı, şablon boyutuna oran (merkez x/y, genişlik/yükseklik). */
  print: { cx: number; cy: number; w: number; h: number };
}

const GARMENTS: Record<MockupType, GarmentConfig> = {
  // Model üstü (giydirilmiş) — kadın + erkek, göğüs baskı alanı (belirgin/tutarlı boyut)
  MODEL_FRONT_W: { file: 'model-front-w.png', print: { cx: 0.5, cy: 0.5, w: 0.27, h: 0.29 } },
  MODEL_ANGLE_W: { file: 'model-angle-w.png', print: { cx: 0.5, cy: 0.49, w: 0.25, h: 0.27 } },
  MODEL_FRONT: { file: 'model-front.png', print: { cx: 0.5, cy: 0.46, w: 0.3, h: 0.32 } },
  MODEL_ANGLE: { file: 'model-angle.png', print: { cx: 0.5, cy: 0.46, w: 0.27, h: 0.29 } },
  // Düz (flat-lay) giysiler
  TSHIRT: { file: 'tshirt.png', print: { cx: 0.5, cy: 0.45, w: 0.33, h: 0.35 } },
  HOODIE: { file: 'hoodie.png', print: { cx: 0.5, cy: 0.5, w: 0.24, h: 0.26 } },
  SWEATSHIRT: { file: 'sweatshirt.png', print: { cx: 0.5, cy: 0.46, w: 0.28, h: 0.3 } },
  OVERSIZE: { file: 'oversize.png', print: { cx: 0.5, cy: 0.44, w: 0.32, h: 0.34 } },
};

/** Varsayılan tişört sunum seti — kadın + erkek modeller + flat-lay (ilk eleman = kapak). */
export const MOCKUP_TYPES: MockupType[] = ['MODEL_FRONT_W', 'MODEL_FRONT', 'TSHIRT', 'MODEL_ANGLE_W'];

/** Tasarımı giysi/model şablonuna gerçekçi şekilde basar, mockup PNG döner. */
export async function renderMockup(designPng: Buffer, type: MockupType): Promise<Buffer> {
  const g = GARMENTS[type];
  const base = sharp(path.join(TPL_DIR, g.file)).removeAlpha();
  const meta = await base.metadata();
  const W = meta.width ?? 1024;
  const H = meta.height ?? 1024;

  const pw = Math.round(W * g.print.w);
  const ph = Math.round(H * g.print.h);
  const design = await sharp(designPng)
    .resize(pw, ph, { fit: 'inside', withoutEnlargement: false })
    .flatten({ background: '#ffffff' })
    .png()
    .toBuffer();
  const dm = await sharp(design).metadata();

  const left = Math.round(W * g.print.cx - (dm.width ?? pw) / 2);
  const top = Math.round(H * g.print.cy - (dm.height ?? ph) / 2);

  return base
    .composite([{ input: design, left, top, blend: 'multiply' }])
    .png()
    .toBuffer();
}
