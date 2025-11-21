import { Inter, Montserrat } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="bg-obsidian text-gray-300 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
