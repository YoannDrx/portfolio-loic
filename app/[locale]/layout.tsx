import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";
import { LayoutContent } from "./layout-content";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://loicghanem.com";

const seoContent = {
  en: {
    title: "Loïc Ghanem | Music Composer & Producer",
    description:
      "Award-winning music composer and producer based in Paris. Specializing in film, TV, ads, and games composition. Explore my portfolio of Metal, Hip-Hop, Ambient, and Electronic music.",
    ogDescription:
      "Award-winning music composer and producer based in Paris. Bringing your creative projects to life with unique and immersive soundscapes.",
  },
  fr: {
    title: "Loïc Ghanem | Compositeur & Producteur Musical",
    description:
      "Compositeur et producteur musical primé basé à Paris. Spécialisé dans la composition pour le cinéma, la TV, la publicité et les jeux vidéo. Découvrez mon portfolio Metal, Hip-Hop, Ambient et Électronique.",
    ogDescription:
      "Compositeur et producteur musical primé basé à Paris. Donnez vie à vos projets créatifs avec des univers sonores uniques et immersifs.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = seoContent[locale as keyof typeof seoContent] || seoContent.en;
  const alternateLocale = locale === "en" ? "fr" : "en";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: content.title,
      template: "%s | Loïc Ghanem",
    },
    description: content.description,
    keywords: [
      "music composer",
      "compositeur",
      "music producer",
      "producteur musical",
      "sound design",
      "film music",
      "musique de film",
      "TV music",
      "game music",
      "Paris",
      "metal",
      "hip-hop",
      "electronic music",
      "ambient music",
    ],
    authors: [{ name: "Loïc Ghanem" }],
    creator: "Loïc Ghanem",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: alternateLocale === "fr" ? "fr_FR" : "en_US",
      url: `${baseUrl}/${locale}`,
      title: content.title,
      description: content.ogDescription,
      siteName: "Loïc Ghanem Portfolio",
      images: [
        {
          url: "/img/og-loic.png?v=3",
          width: 1200,
          height: 630,
          alt: "Loïc Ghanem - Music Composer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.ogDescription,
      images: ["/img/og-loic.png?v=3"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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
  if (!routing.locales.includes(locale as "en" | "fr")) {
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
