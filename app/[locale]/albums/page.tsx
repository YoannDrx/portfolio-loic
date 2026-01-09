import { prisma } from "@/lib/prisma";
import { NeoAlbumsPage } from "@/components/neo-brutalist/albums/NeoAlbumsPage";
import { getTranslations } from "next-intl/server";

// Force dynamic rendering to avoid DB calls during static build
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "albums" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function AlbumsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  // Récupérer tous les albums publiés, triés par order puis date décroissante
  // order permet d'épingler certains albums en premier (Terra=0, Cyberpunk=1, Bass With Attitude=2)
  const albums = await prisma.album.findMany({
    where: {
      published: true,
    },
    orderBy: [{ order: "asc" }, { sortedDate: "desc" }],
    select: {
      id: true,
      title: true,
      img: true,
      poster: true,
      date: true,
      sortedDate: true,
      style: true,
      listenLink: true,
      collabName: true,
      collabLink: true,
      descriptionsFr: true,
      descriptionsEn: true,
    },
  });

  return <NeoAlbumsPage albums={albums} />;
}
