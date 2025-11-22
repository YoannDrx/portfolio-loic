import { prisma } from "@/lib/prisma";
import { AlbumsContent } from "@/components/admin/AlbumsContent";

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Fetch initial data (première page seulement)
  const albums = await prisma.album.findMany({
    take: 20,
    orderBy: { sortedDate: "desc" },
    select: {
      id: true,
      img: true,
      title: true,
      date: true,
      style: true,
      published: true,
    },
  });

  return <AlbumsContent initialAlbums={albums} locale={locale} />;
}
