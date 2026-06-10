'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Brain,
  Building2,
  CheckSquare,
  DatabaseBackup,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Palette,
  ScrollText,
  Search,
  Settings,
  ShoppingBag,
  Swords,
  TrendingUp,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Komuta Merkezi', icon: LayoutDashboard },
  { href: '/ceo', label: 'AI CEO', icon: Brain },
  { href: '/research', label: 'Ürün Araştırma', icon: Search },
  { href: '/trends', label: 'Trend Avcısı', icon: TrendingUp },
  { href: '/designs', label: 'Tasarım & Mockup', icon: Palette },
  { href: '/videos', label: 'Video Fabrikası', icon: Video },
  { href: '/shopify', label: 'Shopify', icon: ShoppingBag },
  { href: '/ads', label: 'Meta Reklam', icon: Megaphone },
  { href: '/finance', label: 'Finans & İş Zekası', icon: BarChart3 },
  { href: '/competitors', label: 'Rakip Analiz', icon: Swords },
  { href: '/suppliers', label: 'Tedarikçi & Mail', icon: Building2 },
  { href: '/lab', label: 'Kreatif Test Lab', icon: FlaskConical },
  { href: '/tasks', label: 'Görev Merkezi', icon: CheckSquare },
  { href: '/jobs', label: 'İşler', icon: ListChecks },
  { href: '/audit', label: 'Denetim Kaydı', icon: ScrollText },
  { href: '/backups', label: 'Yedekleme', icon: DatabaseBackup },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
