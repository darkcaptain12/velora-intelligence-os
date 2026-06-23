'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { hubs, system } from './nav-items';

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="flex flex-col gap-1 p-3">
      {hubs.map(({ href, label, emoji, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive(href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <Icon className="h-4 w-4" />
          <span aria-hidden>{emoji}</span>
          {label}
        </Link>
      ))}

      <div className="my-2 border-t" />
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
        Sistem
      </p>
      {system.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
            isActive(href)
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground/80 hover:bg-accent hover:text-accent-foreground',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
