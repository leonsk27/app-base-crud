
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter as a fallback, Geist might need local setup
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Changed to match CSS variable expectation
});

export const metadata: Metadata = {
  title: 'Mercado Facil',
  description: 'Gestion de pedidos y productos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
