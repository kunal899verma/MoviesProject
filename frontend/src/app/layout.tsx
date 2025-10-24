import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Movie Management App',
  description: 'Manage your favorite movies with ease',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${montserrat.className} h-full bg-with-pattern`}>
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
