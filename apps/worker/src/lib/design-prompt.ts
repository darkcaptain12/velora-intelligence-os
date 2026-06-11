/**
 * Kullanıcının kısa niş/temasını BASKIYA HAZIR tişört grafiği promptuna çevirir.
 * Amaç: Fal fotoğraf/foto-gerçekçi görsel değil; vektörel, düz renkli, izole
 * baskı tasarımı üretsin (multiply ile mockup'a temiz otursun — beyaz zemin kaybolur).
 */
export function buildDesignPrompt(userPrompt: string): string {
  const subject = userPrompt.trim().replace(/\s+/g, ' ');
  return [
    subject,
    'bold graphic illustration in screen-print vector style, flat vivid colors, clean thick outlines',
    'centered die-cut sticker composition, isolated on a pure solid white background',
    'high contrast, retro streetwear aesthetic, crisp clean edges',
    // Giysi şekli ÇİZME — sadece basılacak grafik
    'artwork ONLY — no t-shirt, no shirt shape, no garment, no clothing outline, no fabric, no mockup, no person wearing it, no photograph, no 3D render, no background scene',
    // Yazıyı AI'ya bırakma (bozuk çıkıyor) — yazı sonradan net basılır
    'absolutely NO text, no letters, no words, no numbers, no captions, no typography',
  ].join(', ');
}

/**
 * Kullanıcı promptundan tırnak içindeki sloganı ayıklar: yazı kısmı net basılmak üzere
 * `text`, geri kalanı illüstrasyon konusu `subject` olur.
 * Örn: `gym motivation "BEAST MODE"` → { subject:'gym motivation', text:'BEAST MODE' }
 */
export function extractOverlayText(prompt: string): { subject: string; text: string | null } {
  const m = prompt.match(/["“”']([^"“”']{1,40})["“”']/);
  if (!m) return { subject: prompt.trim(), text: null };
  const text = m[1]!.trim();
  const subject = prompt.replace(m[0], '').replace(/\s+/g, ' ').trim();
  return { subject: subject || text, text };
}
