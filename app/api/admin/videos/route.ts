import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  validateQuery,
  handleApiError,
  successResponse,
  createdResponse,
} from "@/lib/api/middleware";
import {
  videoCreateSchema,
  videosQuerySchema,
  VideoCreateInput,
  VideosQueryParams,
} from "@/lib/validations/schemas";
import { createVersion } from "@/lib/versioning";

// ============================================
// GET /api/admin/videos
// Liste toutes les vidéos avec pagination et filtres
// ============================================

export const GET = withAuth(async (req, context, user) => {
  try {
    // Valider les query params
    const query: VideosQueryParams = validateQuery(req, videosQuerySchema);

    // Construire les filtres
    const where: any = {};

    if (query.search) {
      where.title = { contains: query.search, mode: "insensitive" };
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.published !== undefined) {
      where.published = query.published;
    }

    // Compter le total
    const total = await prisma.video.count({ where });

    // Récupérer les vidéos paginées
    const videos = await prisma.video.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      take: query.limit,
      skip: query.page * query.limit,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse({
      items: videos,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// POST /api/admin/videos
// Créer une nouvelle vidéo
// ============================================

export const POST = withAuthAndValidation(
  videoCreateSchema,
  async (req, context, user, data: VideoCreateInput) => {
    try {
      // Créer la vidéo
      const video = await prisma.video.create({
        data: {
          ...data,
          createdById: user.id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Créer la version initiale
      await createVersion("video", video.id, video, "create", user.id);

      return createdResponse(video);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
