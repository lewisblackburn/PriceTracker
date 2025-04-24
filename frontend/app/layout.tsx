import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import NavigationBar from '@/components/navigation-bar';
import QueryProvider from '@/components/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Price Tracker',
  description: 'Track the price of your favorite products',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Toaster position="top-center" />
          <main className="h-screen pt-14">
            <NavigationBar />
            <div className="h-full">{children}</div>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
