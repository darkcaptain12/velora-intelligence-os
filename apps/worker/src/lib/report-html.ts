/** Stratejik sinyal satırları (🎯 fırsat, 📅 etkinlik, 🧠 ürün zekası) bu önekle başlar. */
const HIGHLIGHT_PREFIXES = ['🎯', '📅', '🧠'];

/** Basit, e-posta uyumlu haftalık rapor HTML şablonu. */
export function buildReportHtml(input: {
  brandName: string;
  week: string;
  narrative: string;
  insights: string[];
  recommendations: string[];
}): string {
  const li = (arr: string[]) => arr.map((x) => `<li style="margin:4px 0">${x}</li>`).join('');
  const highlights = input.insights.filter((i) => HIGHLIGHT_PREFIXES.some((p) => i.startsWith(p)));
  const metrics = input.insights.filter((i) => !HIGHLIGHT_PREFIXES.some((p) => i.startsWith(p)));
  return `<!doctype html><html><body style="font-family:Helvetica,Arial,sans-serif;color:#1f2937;max-width:640px;margin:0 auto">
  <h2 style="margin-bottom:4px">VELORA Haftalık Rapor</h2>
  <p style="color:#6b7280;margin-top:0">${input.brandName} · ${input.week}</p>
  <p>${input.narrative}</p>
  ${
    highlights.length
      ? `<h3 style="margin-bottom:4px">🚀 Stratejik Sinyaller</h3>
  <ul style="padding-left:18px;margin-top:0;background:#f5f3ff;border-radius:8px;padding:8px 18px">${li(highlights)}</ul>`
      : ''
  }
  <h3 style="margin-bottom:4px">Özet Metrikler</h3>
  <ul style="padding-left:18px;margin-top:0">${li(metrics)}</ul>
  <h3 style="margin-bottom:4px">AI CEO Önerileri</h3>
  <ul style="padding-left:18px;margin-top:0">${li(input.recommendations)}</ul>
  <p style="color:#9ca3af;font-size:12px;margin-top:24px">Bu rapor VELORA AI Commerce OS tarafından otomatik üretildi.</p>
  </body></html>`;
}
