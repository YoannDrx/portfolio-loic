import { NeoVideosPage } from "@/components/neo-brutalist/videos/NeoVideosPage";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedVideos } from "@/lib/public-content";

// Force dynamic rendering to avoid DB calls at build time
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });

  return buildLocalizedMetadata({
    locale,
    path: "/videos",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  // Récupérer toutes les vidéos publiées, triées par date de création décroissante
  const videos = await getPublishedVideos();

  return (
    <>
      <JsonLd
        data={videos.map((video) => ({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: video.title,
          description: video.title,
          thumbnailUrl: video.img
            ? video.img.startsWith("http")
              ? video.img
              : `${SITE_URL}${video.img}`
            : `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
          uploadDate: (() => {
            const [day, month, year] = video.date.split("/");
            return year && month && day ? `${year}-${month}-${day}` : undefined;
          })(),
          embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
          contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
          url: `${SITE_URL}/${_locale}/videos`,
        }))}
      />
      <NeoVideosPage videos={videos} />
    </>
  );
}
