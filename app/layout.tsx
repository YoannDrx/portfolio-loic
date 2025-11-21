import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Providers } from './providers';
import '../styles/globals.css';
import 'aos/dist/aos.css';

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

export const metadata: Metadata = {
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
        url: '/og-image.jpg',
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
    images: ['/og-image.jpg'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="bg-obsidian text-gray-300 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
