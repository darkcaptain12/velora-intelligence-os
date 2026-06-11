/**
 * Ticari önemi olan özel günler (TR + global) — otomatik tasarım temaları için.
 * Sabit tarihliler her yıl; hareketli olanlar (bayram/anneler günü vb.) yıl-bazlı tablo.
 * `upcomingSpecialDays` yaklaşan günleri tema promptlarıyla döner.
 */
interface FixedDay {
  name: string;
  month: number; // 1-12
  day: number;
  themes: string[];
}

interface MovingDay {
  name: string;
  iso: string; // 'YYYY-MM-DD'
  themes: string[];
}

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
];

// Hareketli günler (yıl-bazlı; gerektiğinde genişletilir).
const MOVING: MovingDay[] = [
  { name: 'Ramazan Bayramı', iso: '2026-03-20', themes: ['crescent moon lantern mosque illustration "RAMADAN MUBARAK"'] },
  { name: 'Kurban Bayramı', iso: '2026-05-27', themes: ['crescent celebration illustration "EID MUBARAK"'] },
  { name: 'Anneler Günü', iso: '2026-05-10', themes: ['floral heart illustration "BEST MOM EVER"', 'mother child love illustration "MAMA"'] },
  { name: 'Babalar Günü', iso: '2026-06-21', themes: ['father child mustache tie illustration "BEST DAD EVER"', 'strong dad illustration "PAPA BEAR"'] },
  { name: 'Black Friday', iso: '2026-11-27', themes: ['shopping bags sale tag illustration "BLACK FRIDAY"'] },
];

export interface UpcomingDay {
  name: string;
  date: Date;
  daysUntil: number;
  themes: string[];
}

function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Bugünden itibaren `withinDays` gün içindeki özel günleri (tema promptlarıyla) döner. */
export function upcomingSpecialDays(withinDays = 30, now = new Date()): UpcomingDay[] {
  const today = atMidnight(now);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + withinDays);
  const out: UpcomingDay[] = [];

  const consider = (name: string, date: Date, themes: string[]) => {
    const d = atMidnight(date);
    if (d >= today && d <= horizon) {
      const daysUntil = Math.round((d.getTime() - today.getTime()) / 86_400_000);
      out.push({ name, date: d, daysUntil, themes });
    }
  };

  for (const f of FIXED) {
    // bu yıl ve gelecek yıl (yıl sonu sarması için)
    consider(f.name, new Date(today.getFullYear(), f.month - 1, f.day), f.themes);
    consider(f.name, new Date(today.getFullYear() + 1, f.month - 1, f.day), f.themes);
  }
  for (const m of MOVING) consider(m.name, new Date(m.iso), m.themes);

  return out.sort((a, b) => a.daysUntil - b.daysUntil);
}
