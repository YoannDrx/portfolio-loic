import FuturisticHome from '@/components/home/FuturisticHome';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for useSearchParams in FuturisticHome
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [albums, videos, services] = await Promise.all([
    // Fetch latest 4 albums
    prisma.album.findMany({
      where: { published: true },
      orderBy: { sortedDate: 'desc' },
      take: 4,
      select: {
        id: true,
        title: true,
        img: true,
        style: true,
        date: true,
        listenLink: true
      }
    }),
    // Fetch latest 3 videos
    prisma.video.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        videoId: true,
        type: true
      }
    }),
    // Fetch latest 6 services
    prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
      take: 6,
      select: {
        id: true,
        title: true,
        text: true
      }
    })
  ]);

  return (
    <FuturisticHome 
      albums={albums}
      videos={videos}
      services={services}
    />
  );
}
