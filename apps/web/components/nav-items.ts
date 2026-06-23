import {
  BarChart3,
  Brain,
  CheckSquare,
  DatabaseBackup,
  LayoutDashboard,
  ListChecks,
  Package,
  Palette,
  ScrollText,
  Settings,
  Target,
} from 'lucide-react';

/** 6 ana çalışma hub'ı — sidebar (desktop) + alt navigasyon (mobil) ortak kaynağı. */
export const hubs = [
  { href: '/dashboard', label: 'Komuta Merkezi', shortLabel: 'Komuta', emoji: '🏠', icon: LayoutDashboard },
  { href: '/hunter', label: 'Ürün Avcısı', shortLabel: 'Avcı', emoji: '🎯', icon: Target },
  { href: '/studio', label: 'Tasarım Direktörü', shortLabel: 'Tasarım', emoji: '🎨', icon: Palette },
  { href: '/operations', label: 'Operasyon Müdürü', shortLabel: 'Operasyon', emoji: '📦', icon: Package },
  { href: '/finance', label: 'Finans Müdürü', shortLabel: 'Finans', emoji: '💰', icon: BarChart3 },
  { href: '/ceo', label: 'AI CEO', shortLabel: 'AI CEO', emoji: '🧠', icon: Brain },
] as const;

/** Sistem bölümü — sidebar altında küçültülmüş, mobilde "Diğer" sheet'inde. */
export const system = [
  { href: '/tasks', label: 'Görevler', icon: CheckSquare },
  { href: '/jobs', label: 'İşler', icon: ListChecks },
  { href: '/audit', label: 'Denetim', icon: ScrollText },
  { href: '/backups', label: 'Yedekleme', icon: DatabaseBackup },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
] as const;
