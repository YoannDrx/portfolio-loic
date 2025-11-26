import { prisma } from '@/lib/prisma';
import VideosContent from '@/components/videos/VideosContent';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Récupérer toutes les vidéos publiées, triées par date de création décroissante
  const videos = await prisma.video.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      img: true,
      type: true,
      videoId: true,
      title: true,
      date: true,
    },
  });

  return <VideosContent videos={videos} locale={locale} />;
}
