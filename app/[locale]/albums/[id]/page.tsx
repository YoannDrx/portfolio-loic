import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import NeoAlbumDetail from "@/components/neo-brutalist/albums/NeoAlbumDetail";
import { buildLocalizedMetadata, plainText, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getAlbumByIdentifier, getPublishedAlbums } from "@/lib/public-content";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  try {
    const albums = await prisma.album.findMany({
      where: { published: true },
      select: { id: true, slug: true },
    });

    const locales = ["fr", "en"];

    return albums.flatMap((album) =>
      locales.map((locale) => ({
        locale,
        id: album.slug || album.id,
      }))
    );
  } catch {
    // Return empty array if DB is not available (CI build)
    return [];
  }
}

export const dynamicParams = true;
// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "albums.detail" });

  try {
    const album = await getAlbumByIdentifier(id);

    if (!album) {
      return {
        title: t("notFound"),
      };
    }

    const description = plainText(locale === "fr" ? album.descriptionsFr : album.descriptionsEn);
    return buildLocalizedMetadata({
      locale,
      path: `/albums/${album.slug || id}`,
      title: album.title,
      description,
      image: album.img,
      type: "music.album",
    });
  } catch {
    return {
      title: "Album | Loïc Ghanem",
    };
  }
}

export default async function AlbumDetailPage({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  // Si mode preview, vérifier l'authentification
  let isAdmin = false;
  if (isPreview) {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({ headers: headersList });
      isAdmin = session?.user?.role === "admin";
    } catch {
      isAdmin = false;
    }

    if (!isAdmin) {
      notFound();
    }
  }

  // Fetch the album
  const album = await getAlbumByIdentifier(id);

  if (!album) {
    notFound();
  }

  // Si pas en mode preview et album non publié, 404
  if (!isPreview && !album.published) {
    notFound();
  }

  if (!isPreview && album.slug && id !== album.slug) {
    permanentRedirect(`/${locale}/albums/${album.slug}`);
  }

  // Fetch all albums for related section
  const allAlbums = await getPublishedAlbums();

  const description = plainText(locale === "fr" ? album.descriptionsFr : album.descriptionsEn, 500);
  const albumUrl = `${SITE_URL}/${locale}/albums/${album.slug || album.id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.title,
    url: albumUrl,
    image: album.img.startsWith("http") ? album.img : `${SITE_URL}${album.img}`,
    description,
    datePublished: album.releaseDate?.toISOString(),
    albumProductionType: album.releaseType,
    genre: album.style.split("/").map((genre) => genre.trim()),
    byArtist: { "@type": "Person", name: album.poster || "Loïc Ghanem", url: SITE_URL },
    track: album.tracks.map((track) => ({
      "@type": "MusicRecording",
      position: track.position,
      name: track.title,
      duration: track.durationSeconds
        ? `PT${Math.floor(track.durationSeconds / 60)}M${track.durationSeconds % 60}S`
        : undefined,
      byArtist: track.artists ? { "@type": "MusicGroup", name: track.artists } : undefined,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          jsonLd,
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: locale === "fr" ? "Albums" : "Albums",
                item: `${SITE_URL}/${locale}/albums`,
              },
              { "@type": "ListItem", position: 2, name: album.title, item: albumUrl },
            ],
          },
        ]}
      />
      <NeoAlbumDetail
        album={album}
        allAlbums={allAlbums}
        locale={locale}
        isPreview={isPreview && isAdmin}
      />
    </>
  );
}
