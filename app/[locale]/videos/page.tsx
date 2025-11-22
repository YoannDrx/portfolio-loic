import { prisma } from '@/lib/prisma';
import { VideosDisplay } from '@/components/videos/VideosDisplay';

export default async function VideosPage() {
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

  return <VideosDisplay videos={videos} />;
}
