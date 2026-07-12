import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
  noContentResponse,
  ApiError,
} from "@/lib/api/middleware";
import { albumUpdateSchema, type AlbumUpdateInput } from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";
import { createVersion } from "@/lib/versioning";
import { logCrud } from "@/lib/activity-logger";
import { revalidateTag } from "next/cache";

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
      const { tracks, releaseDate, ...albumInput } = data;
      const updateData: Record<string, unknown> = {
        ...albumInput,
        ...(albumInput.slug !== undefined ? { slug: albumInput.slug || null } : {}),
        ...(albumInput.releaseType !== undefined
          ? { releaseType: albumInput.releaseType || null }
          : {}),
        ...(albumInput.label !== undefined ? { label: albumInput.label || null } : {}),
        ...(albumInput.publisher !== undefined ? { publisher: albumInput.publisher || null } : {}),
        ...(albumInput.roleFr !== undefined ? { roleFr: albumInput.roleFr || null } : {}),
        ...(albumInput.roleEn !== undefined ? { roleEn: albumInput.roleEn || null } : {}),
        ...(albumInput.creditsFr !== undefined ? { creditsFr: albumInput.creditsFr || null } : {}),
        ...(albumInput.creditsEn !== undefined ? { creditsEn: albumInput.creditsEn || null } : {}),
        ...(albumInput.tracklistSourceUrl !== undefined
          ? { tracklistSourceUrl: albumInput.tracklistSourceUrl || null }
          : {}),
        ...(releaseDate !== undefined
          ? { releaseDate: releaseDate ? new Date(releaseDate) : null }
          : {}),
        ...(tracks
          ? { tracks: { deleteMany: {}, create: tracks.map(({ id: _id, ...track }) => track) } }
          : {}),
        ...(tracks && albumInput.tracklistSourceUrl ? { tracklistVerifiedAt: new Date() } : {}),
      };

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

      // Logger l'action
      await logCrud("update", "album", album.id, album.title, user.id, {
        updatedFields: Object.keys(data),
      });

      revalidateTag("albums", "max");
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

export const DELETE = withAuth(async (_req, context, user) => {
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

    // Logger l'action (avec le titre sauvegardé avant suppression)
    await logCrud("delete", "album", id, existingAlbum.title, user.id);

    revalidateTag("albums", "max");
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});
