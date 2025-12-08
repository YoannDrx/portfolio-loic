import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
  noContentResponse,
  ApiError,
} from "@/lib/api/middleware";
import {
  videoUpdateSchema,
  type VideoUpdateInput,
} from "@/lib/validations/schemas";
import { createVersion } from "@/lib/versioning";
import { logCrud } from "@/lib/activity-logger";

// ============================================
// GET /api/admin/videos/[id]
// Récupérer une vidéo par ID
// ============================================

export const GET = withAuth(async (_req, context, _user) => {
  try {
    const { id } = await context.params;

    const video = await prisma.video.findUnique({
      where: { id },
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

    if (!video) {
      throw new ApiError(404, "Vidéo non trouvée", "NOT_FOUND");
    }

    return successResponse(video);
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// PATCH /api/admin/videos/[id]
// Mettre à jour une vidéo
// ============================================

export const PATCH = withAuthAndValidation(
  videoUpdateSchema,
  async (_req, context, user, data: VideoUpdateInput) => {
    try {
      const { id } = await context.params;

      // Vérifier que la vidéo existe
      const existingVideo = await prisma.video.findUnique({
        where: { id },
      });

      if (!existingVideo) {
        throw new ApiError(404, "Vidéo non trouvée", "NOT_FOUND");
      }

      // Mettre à jour la vidéo
      const video = await prisma.video.update({
        where: { id },
        data,
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

      // Créer une version après la mise à jour
      await createVersion("video", video.id, video, "update", user.id);

      // Logger l'action
      await logCrud("update", "video", video.id, video.title, user.id, {
        updatedFields: Object.keys(data),
      });

      return successResponse(video);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// ============================================
// DELETE /api/admin/videos/[id]
// Supprimer une vidéo
// ============================================

export const DELETE = withAuth(async (_req, context, user) => {
  try {
    const { id } = await context.params;

    // Vérifier que la vidéo existe
    const existingVideo = await prisma.video.findUnique({
      where: { id },
    });

    if (!existingVideo) {
      throw new ApiError(404, "Vidéo non trouvée", "NOT_FOUND");
    }

    // Supprimer la vidéo
    await prisma.video.delete({
      where: { id },
    });

    // Logger l'action (avec le titre sauvegardé avant suppression)
    await logCrud("delete", "video", id, existingVideo.title, user.id);

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});
