'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MoreHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hubs, system } from './nav-items';

/** Mobil alt navigasyon: 6 hub (hızlı erişim) + "Diğer" sheet'i (Sistem bölümü). */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}
      <div
        className={cn(
          'fixed inset-x-0 bottom-14 z-50 max-h-[60vh] overflow-y-auto rounded-t-xl border-t bg-background shadow-lg transition-transform md:hidden',
          open ? 'translate-y-0' : 'translate-y-[120%]',
        )}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-semibold">Sistem</span>
          <button onClick={() => setOpen(false)} aria-label="Kapat">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        <nav className="grid grid-cols-2 gap-1 p-3">
          {system.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium',
                isActive(href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid h-14 grid-cols-7 border-t bg-background md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {hubs.map(({ href, shortLabel, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium',
              isActive(href) ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {shortLabel}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
          Diğer
        </button>
      </nav>
    </>
  );
}
