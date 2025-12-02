import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, successResponse } from "@/lib/api/middleware";
import { getRecentVersions } from "@/lib/versioning";

export const GET = withAuth(async (_req, _context, _user) => {
  try {
    const [totalAlbums, publishedAlbums, totalVideos, publishedVideos, totalServices, publishedServices, recentActivity] = await Promise.all([
      prisma.album.count(),
      prisma.album.count({ where: { published: true } }),
      prisma.video.count(),
      prisma.video.count({ where: { published: true } }),
      prisma.service.count(),
      prisma.service.count({ where: { published: true } }),
      getRecentVersions(20),
    ]);

    // Calculer les totaux
    const totalContent = totalAlbums + totalVideos + totalServices;
    const totalPublished = publishedAlbums + publishedVideos + publishedServices;
    const publishRate = totalContent > 0 ? Math.round((totalPublished / totalContent) * 100) : 0;

    return successResponse({
      albums: { total: totalAlbums, published: publishedAlbums },
      videos: { total: totalVideos, published: publishedVideos },
      services: { total: totalServices, published: publishedServices },
      totalContent,
      totalPublished,
      publishRate,
      recentActivity,
    });
  } catch (error) {
    return handleApiError(error);
  }
});
