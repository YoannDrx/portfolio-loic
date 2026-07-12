import { NeoAlbumsPage } from "@/components/neo-brutalist/albums/NeoAlbumsPage";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";
import { getPublishedAlbums } from "@/lib/public-content";

// Force dynamic rendering to avoid DB calls at build time
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "albums" });

  return buildLocalizedMetadata({
    locale,
    path: "/albums",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function AlbumsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  // Récupérer tous les albums publiés du plus récent au plus ancien
  const albums = await getPublishedAlbums();

  return <NeoAlbumsPage albums={albums} />;
}
