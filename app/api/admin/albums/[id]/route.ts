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
  albumUpdateSchema,
  type AlbumUpdateInput,
} from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";
import { createVersion } from "@/lib/versioning";

// ============================================
// GET /api/admin/albums/[id]
// Récupérer un album par ID
// ============================================

export const GET = withAuth(async (_req, context, _user) => {
  try {
    const { id } = await context.params;

    const album = await prisma.album.findUnique({
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

    if (!album) {
      throw new ApiError(404, "Album non trouvé", "NOT_FOUND");
    }

    return successResponse(album);
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// PATCH /api/admin/albums/[id]
// Mettre à jour un album
// ============================================

export const PATCH = withAuthAndValidation(
  albumUpdateSchema,
  async (_req, context, user, data: AlbumUpdateInput) => {
    try {
      const { id } = await context.params;

      // Vérifier que l'album existe
      const existingAlbum = await prisma.album.findUnique({
        where: { id },
      });

      if (!existingAlbum) {
        throw new ApiError(404, "Album non trouvé", "NOT_FOUND");
      }

      // Préparer les données de mise à jour
      const updateData: Partial<AlbumUpdateInput> = { ...data };

      // Sanitizer les descriptions si elles sont fournies
      if (data.descriptionsFr) {
        updateData.descriptionsFr = sanitizeDescription(data.descriptionsFr);
      }
      if (data.descriptionsEn) {
        updateData.descriptionsEn = sanitizeDescription(data.descriptionsEn);
      }

      // Mettre à jour l'album
      const album = await prisma.album.update({
        where: { id },
        data: updateData,
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
      await createVersion("album", album.id, album, "update", user.id);

      return successResponse(album);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// ============================================
// DELETE /api/admin/albums/[id]
// Supprimer un album
// ============================================

export const DELETE = withAuth(async (_req, context, _user) => {
  try {
    const { id } = await context.params;

    // Vérifier que l'album existe
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      throw new ApiError(404, "Album non trouvé", "NOT_FOUND");
    }

    // Supprimer l'album
    await prisma.album.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});
