import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.loic-ghanem.com";
export const SOCIAL_PROFILES = [
  "https://open.spotify.com/artist/3PPQlrmOzl6QUBSP3gcyLA",
  "https://www.youtube.com/channel/UCLbxfVx61feUL3uw2me9tSA",
  "https://soundcloud.com/loic-ghanem",
  "https://www.linkedin.com/in/lo%C3%AFc-ghanem/",
];

type Locale = "fr" | "en";

interface LocalizedMetadataInput {
  locale: string;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "music.album";
}

export function buildLocalizedMetadata({
  locale,
  path,
  title,
  description,
  image = "/img/og-loic.png?v=6",
  type = "website",
}: LocalizedMetadataInput): Metadata {
  const normalizedLocale: Locale = locale === "fr" ? "fr" : "en";
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const canonical = `${SITE_URL}/${normalizedLocale}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        fr: `${SITE_URL}/fr${normalizedPath}`,
        en: `${SITE_URL}/en${normalizedPath}`,
        "x-default": `${SITE_URL}/fr${normalizedPath}`,
      },
    },
    openGraph: {
      type: type === "music.album" ? "music.album" : type,
      locale: normalizedLocale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: normalizedLocale === "fr" ? "en_US" : "fr_FR",
      url: canonical,
      title,
      description,
      siteName: "Loïc Ghanem",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function plainText(html: string, maxLength = 160) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trim()}…`;
}
