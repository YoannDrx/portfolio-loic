import { prisma } from '@/lib/prisma';
import AlbumsContent from '@/components/albums/AlbumsContent';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "albums" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Récupérer tous les albums publiés, triés par date décroissante
  const albums = await prisma.album.findMany({
    where: {
      published: true,
    },
    orderBy: {
      sortedDate: 'desc',
    },
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

  return <AlbumsContent albums={albums} locale={locale} />;
}