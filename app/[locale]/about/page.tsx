import { getTranslations } from "next-intl/server";
import { NeoAbout } from "@/components/neo-brutalist/about/NeoAbout";
import { buildLocalizedMetadata, SITE_URL, SOCIAL_PROFILES } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return buildLocalizedMetadata({
    locale,
    path: "/about",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const albumCount = await prisma.album.count({ where: { published: true } }).catch(() => 21);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${SITE_URL}/${locale}/about`,
          mainEntity: {
            "@type": "Person",
            name: "Loïc Ghanem",
            jobTitle:
              locale === "fr" ? "Compositeur et producteur musical" : "Music composer and producer",
            url: SITE_URL,
            sameAs: SOCIAL_PROFILES,
          },
        }}
      />
      <NeoAbout locale={locale} albumCount={albumCount} />
    </>
  );
}
