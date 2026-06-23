/**
 * Ticari önemi olan özel günler (TR + global) — otomatik tasarım temaları + Global Event Calendar için.
 * Sabit tarihliler her yıl; hareketli olanlar (bayram/anneler günü/turnuva finalleri vb.) yıl-bazlı
 * tablo (gerektiğinde genişletilir/güncellenir).
 * `category`/`prepLeadDays`/`trendPotential`/`salesPotential` opsiyonel — yoksa `upcomingSpecialDays`
 * varsayılan değer atar (geriye uyumlu).
 */

/** packages/db EventCategory enum'u ile birebir (yapısal olarak uyumlu, bağımlılık eklemeden). */
export type EventCategoryName = 'SPOR' | 'ALISVERIS' | 'KUTLAMA' | 'MEVSIM';

interface EventMeta {
  category?: EventCategoryName;
  /** Tasarım+üretim+yayın için gereken hazırlık süresi (gün). */
  prepLeadDays?: number;
  /** 0-100. */
  trendPotential?: number;
  /** 0-100. */
  salesPotential?: number;
}

interface FixedDay extends EventMeta {
  name: string;
  month: number; // 1-12
  day: number;
  themes: string[];
}

interface MovingDay extends EventMeta {
  name: string;
  iso: string; // 'YYYY-MM-DD'
  themes: string[];
}

const DEFAULT_CATEGORY: EventCategoryName = 'KUTLAMA';
const DEFAULT_PREP_LEAD_DAYS = 21;
const DEFAULT_TREND_POTENTIAL = 60;
const DEFAULT_SALES_POTENTIAL = 65;

const FIXED: FixedDay[] = [
  { name: 'Yılbaşı', month: 1, day: 1, themes: ['fireworks celebration illustration "HAPPY NEW YEAR"', 'new year motivation mountain illustration "NEW YEAR NEW ME"'] },
  { name: 'Sevgililer Günü', month: 2, day: 14, themes: ['cute couple hearts illustration "BE MINE"', 'romantic heart balloon illustration "LOVE"'] },
  { name: 'Dünya Kadınlar Günü', month: 3, day: 8, themes: ['strong powerful woman illustration "GIRL POWER"'] },
  { name: '23 Nisan Çocuk Bayramı', month: 4, day: 23, themes: ['happy children playing illustration kites colorful'] },
  { name: '19 Mayıs', month: 5, day: 19, themes: ['turkish flag commemoration youth sports illustration'] },
  { name: '30 Ağustos Zafer Bayramı', month: 8, day: 30, themes: ['turkish patriotic victory star crescent illustration'] },
  { name: 'Okula Dönüş', month: 9, day: 1, themes: ['cute school supplies pencil illustration "BACK TO SCHOOL"', 'teacher apple illustration "BEST TEACHER"'] },
  { name: '29 Ekim Cumhuriyet Bayramı', month: 10, day: 29, themes: ['turkish republic crescent star patriotic illustration'] },
  { name: 'Cadılar Bayramı', month: 10, day: 31, themes: ['spooky pumpkin ghost illustration "SPOOKY"', 'cute halloween black cat bat illustration'] },
  { name: 'Noel / Yıl Sonu', month: 12, day: 20, themes: ['santa reindeer winter illustration "MERRY XMAS"', 'cozy snowman snowflakes illustration'] },

  // --- Sprint 2: Global Event Calendar ek girişler ---
  {
    name: 'Yaz Tatili',
    month: 6,
    day: 15,
    themes: ['summer vacation beach illustration "SUMMER VIBES"', 'pool float sunglasses ice cream illustration "HELLO SUMMER"'],
    category: 'MEVSIM',
    prepLeadDays: 21,
    trendPotential: 75,
    salesPotential: 78,
  },
  {
    name: 'Öğretmenler Günü',
    month: 11,
    day: 24,
    themes: ['apple chalkboard teacher illustration "BEST TEACHER EVER"', 'graduation cap book illustration "THANK YOU TEACHER"'],
    category: 'KUTLAMA',
    prepLeadDays: 10,
    trendPotential: 55,
    salesPotential: 60,
  },
  {
    name: 'Kış Sezonu',
    month: 11,
    day: 1,
    themes: ['cozy winter hoodie snowflake illustration "WINTER VIBES"', 'hot cocoa cabin pine tree illustration "COZY SEASON"'],
    category: 'MEVSIM',
    prepLeadDays: 30,
    trendPotential: 70,
    salesPotential: 80,
  },
  {
    name: 'NBA Playoffs',
    month: 4,
    day: 15,
    themes: ['basketball slam dunk illustration "PLAYOFF MODE"', 'basketball hoop fire illustration street style'],
    category: 'SPOR',
    prepLeadDays: 14,
    trendPotential: 65,
    salesPotential: 55,
  },
  {
    name: 'Formula 1 Sezonu Finali',
    month: 12,
    day: 1,
    themes: ['checkered flag racing helmet illustration "RACE DAY"', 'speed car silhouette illustration "CHAMPION"'],
    category: 'SPOR',
    prepLeadDays: 14,
    trendPotential: 60,
    salesPotential: 50,
  },
];

// Hareketli günler (yıl-bazlı; gerektiğinde genişletilir).
const MOVING: MovingDay[] = [
  { name: 'Ramazan Bayramı', iso: '2026-03-20', themes: ['crescent moon lantern mosque illustration "RAMADAN MUBARAK"'] },
  { name: 'Kurban Bayramı', iso: '2026-05-27', themes: ['crescent celebration illustration "EID MUBARAK"'] },
  { name: 'Anneler Günü', iso: '2026-05-10', themes: ['floral heart illustration "BEST MOM EVER"', 'mother child love illustration "MAMA"'] },
  { name: 'Babalar Günü', iso: '2026-06-21', themes: ['father child mustache tie illustration "BEST DAD EVER"', 'strong dad illustration "PAPA BEAR"'] },
  { name: 'Black Friday', iso: '2026-11-27', themes: ['shopping bags sale tag illustration "BLACK FRIDAY"'] },

  // --- Sprint 2: Global Event Calendar ek girişler ---
  {
    name: 'FIFA Dünya Kupası Finali',
    iso: '2026-07-19',
    themes: ['football world cup trophy champion illustration "WORLD CHAMPIONS"', 'national flag football fan jersey illustration "FOOTBALL FEVER"'],
    category: 'SPOR',
    prepLeadDays: 45,
    trendPotential: 97,
    salesPotential: 90,
  },
  {
    name: 'UEFA Şampiyonlar Ligi Finali',
    iso: '2027-05-29',
    themes: ['champions league star trophy illustration "CHAMPIONS NIGHT"', 'football stadium lights illustration final'],
    category: 'SPOR',
    prepLeadDays: 10,
    trendPotential: 80,
    salesPotential: 65,
  },
  {
    name: 'EURO (UEFA Avrupa Şampiyonası)',
    iso: '2028-06-12',
    themes: ['european football championship trophy illustration "EURO CHAMPION"', 'national flag football fan illustration'],
    category: 'SPOR',
    prepLeadDays: 30,
    trendPotential: 90,
    salesPotential: 80,
  },
  {
    name: 'Copa America',
    iso: '2028-06-20',
    themes: ['south american football cup trophy illustration "COPA CHAMPION"', 'football fan colorful celebration illustration'],
    category: 'SPOR',
    prepLeadDays: 30,
    trendPotential: 75,
    salesPotential: 60,
  },
  {
    name: 'Cyber Monday',
    iso: '2026-11-30',
    themes: ['online shopping discount tag illustration "CYBER MONDAY"', 'laptop shopping bags sale illustration "BIG DEALS"'],
    category: 'ALISVERIS',
    prepLeadDays: 14,
    trendPotential: 85,
    salesPotential: 88,
  },

];

export interface UpcomingDay {
  name: string;
  date: Date;
  daysUntil: number;
  themes: string[];
  category: EventCategoryName;
  prepLeadDays: number;
  trendPotential: number;
  salesPotential: number;
}

function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Bugünden itibaren `withinDays` gün içindeki özel günleri (tema promptları + Event Score girdileriyle) döner. */
export function upcomingSpecialDays(withinDays = 30, now = new Date()): UpcomingDay[] {
  const today = atMidnight(now);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + withinDays);
  const out: UpcomingDay[] = [];

  const consider = (name: string, date: Date, themes: string[], meta: EventMeta) => {
    const d = atMidnight(date);
    if (d >= today && d <= horizon) {
      const daysUntil = Math.round((d.getTime() - today.getTime()) / 86_400_000);
      out.push({
        name,
        date: d,
        daysUntil,
        themes,
        category: meta.category ?? DEFAULT_CATEGORY,
        prepLeadDays: meta.prepLeadDays ?? DEFAULT_PREP_LEAD_DAYS,
        trendPotential: meta.trendPotential ?? DEFAULT_TREND_POTENTIAL,
        salesPotential: meta.salesPotential ?? DEFAULT_SALES_POTENTIAL,
      });
    }
  };

  for (const f of FIXED) {
    // bu yıl ve gelecek yıl (yıl sonu sarması için)
    consider(f.name, new Date(today.getFullYear(), f.month - 1, f.day), f.themes, f);
    consider(f.name, new Date(today.getFullYear() + 1, f.month - 1, f.day), f.themes, f);
  }
  for (const m of MOVING) consider(m.name, new Date(m.iso), m.themes, m);

  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}
