import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VELORA AI Commerce OS',
  description: 'Yapay zeka destekli tam otomasyonlu e-ticaret operasyon sistemi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
