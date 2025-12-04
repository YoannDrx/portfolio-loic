import { prisma } from "@/lib/prisma";
import { DashboardKPICards } from "@/components/admin/DashboardKPICards";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { QuickActions } from "@/components/admin/QuickActions";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Récupérer les statistiques
  const [
    albumsCount,
    videosCount,
    servicesCount,
    publishedAlbumsCount,
    publishedVideosCount,
    publishedServicesCount,
    recentItems,
  ] = await Promise.all([
    prisma.album.count(),
    prisma.video.count(),
    prisma.service.count(),
    prisma.album.count({ where: { published: true } }),
    prisma.video.count({ where: { published: true } }),
    prisma.service.count({ where: { published: true } }),
    // Get recent items (last 5 updated)
    Promise.all([
      prisma.album.findMany({
        take: 3,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          published: true,
          img: true,
          updatedAt: true,
        },
      }),
      prisma.video.findMany({
        take: 2,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          published: true,
          img: true,
          updatedAt: true,
        },
      }),
      prisma.service.findMany({
        take: 2,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          published: true,
          largeImg: true,
          updatedAt: true,
        },
      }),
    ]).then(([albums, videos, services]) => {
      return [
        ...albums.map((item) => ({
          id: item.id,
          title: item.title,
          type: "album" as const,
          published: item.published,
          img: item.img,
          updatedAt: item.updatedAt.toISOString(),
        })),
        ...videos.map((item) => ({
          id: item.id,
          title: item.title,
          type: "video" as const,
          published: item.published,
          img: item.img,
          updatedAt: item.updatedAt.toISOString(),
        })),
        ...services.map((item) => ({
          id: item.id,
          title: item.title,
          type: "service" as const,
          published: item.published,
          img: item.largeImg,
          updatedAt: item.updatedAt.toISOString(),
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, 5);
    }),
  ]);

  const totalContent = albumsCount + videosCount + servicesCount;
  const totalPublished =
    publishedAlbumsCount + publishedVideosCount + publishedServicesCount;
  const publishRate = totalContent > 0
    ? Math.round((totalPublished / totalContent) * 100)
    : 0;

  const stats = {
    albumsCount,
    videosCount,
    servicesCount,
    publishedAlbumsCount,
    publishedVideosCount,
    publishedServicesCount,
    totalContent,
    totalPublished,
    publishRate,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-6 border-b-4 border-neo-border">
        <h1 className="text-3xl sm:text-4xl font-black text-neo-text uppercase tracking-tight">
          Bienvenue
        </h1>
        <p className="font-mono text-sm text-neo-text/60 mt-2 uppercase tracking-wider">
          Vue d'ensemble de votre portfolio et statistiques
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKPICards stats={stats} locale={locale} />

      {/* Bottom Section */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 min-w-0">
        {/* Recent Activity - 2 columns */}
        <div className="lg:col-span-2 min-w-0 overflow-hidden">
          <RecentActivity items={recentItems} locale={locale} />
        </div>

        {/* Quick Actions - 1 column */}
        <div className="min-w-0 overflow-hidden">
          <QuickActions locale={locale} />
        </div>
      </div>
    </div>
  );
}
