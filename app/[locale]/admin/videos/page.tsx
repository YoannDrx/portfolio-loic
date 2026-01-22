import { prisma } from "@/lib/prisma";
import { VideosList } from "@/components/admin/videos-list";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      img: true,
      date: true,
      published: true,
    },
  });

  return <VideosList videos={videos} locale={locale} />;
}
