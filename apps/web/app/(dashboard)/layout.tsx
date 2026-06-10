import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getActiveBrand } from '@/lib/brand';
import { Sidebar } from '@/components/sidebar';
import { LogoutButton } from '@/components/logout-button';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/login');
  const brand = await getActiveBrand();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">VELORA</span>
            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {brand.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{session.user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r bg-background md:block">
          <Sidebar />
        </aside>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
