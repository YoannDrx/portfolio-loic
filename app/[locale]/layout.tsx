import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '../providers';
import { LayoutContent } from './layout-content';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Loïc Ghanem | Music Composer & Producer',
    template: '%s | Loïc Ghanem',
  },
  description:
    'Award-winning music composer and producer based in Paris. Specializing in film, TV, ads, and games composition. Explore my portfolio of Metal, Hip-Hop, Ambient, and Electronic music.',
  keywords: [
    'music composer',
    'music producer',
    'sound design',
    'film music',
    'TV music',
    'game music',
    'Paris',
    'metal',
    'hip-hop',
    'electronic music',
    'ambient music',
  ],
  authors: [{ name: 'Loïc Ghanem' }],
  creator: 'Loïc Ghanem',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://loicghanem.com',
    title: 'Loïc Ghanem | Music Composer & Producer',
    description:
      'Award-winning music composer and producer. Bringing your projects to life with unique soundscapes.',
    siteName: 'Loïc Ghanem Portfolio',
    images: [
      {
        url: '/img/og-loic.png',
        width: 1200,
        height: 630,
        alt: 'Loïc Ghanem - Music Composer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loïc Ghanem | Music Composer & Producer',
    description:
      'Award-winning music composer and producer. Bringing your projects to life with unique soundscapes.',
    images: ['/img/og-loic.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <LayoutContent>{children}</LayoutContent>
      </Providers>
    </NextIntlClientProvider>
  );
}
