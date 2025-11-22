import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, successResponse } from "@/lib/api/middleware";
import { getRecentVersions } from "@/lib/versioning";

export const GET = withAuth(async (req, context, user) => {
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

    return successResponse({
      albums: { total: totalAlbums, published: publishedAlbums },
      videos: { total: totalVideos, published: publishedVideos },
      services: { total: totalServices, published: publishedServices },
      recentActivity,
    });
  } catch (error) {
    return handleApiError(error);
  }
});
