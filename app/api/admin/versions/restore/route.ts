import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  withAuthAndValidation,
  handleApiError,
  successResponse,
  ApiError,
} from "@/lib/api/middleware";
import { getVersionData, createVersion } from "@/lib/versioning";
import { sanitizeDescription } from "@/lib/sanitize";

// ============================================
// Schema de validation
// ============================================

const restoreSchema = z.object({
  versionId: z.string().min(1, "versionId requis"),
});
type RestoreInput = z.infer<typeof restoreSchema>;

// ============================================
// POST /api/admin/versions/restore
// Restaure une version antérieure d'un contenu
// ============================================

export const POST = withAuthAndValidation(
  restoreSchema,
  async (_req, _context, user, data: RestoreInput) => {
    try {
      // Récupérer les données de la version à restaurer
      const versionInfo = await getVersionData(data.versionId);
      const { contentType, contentId, data: versionData } = versionInfo;

      // Supprimer les champs metadata avant restauration
      const { id, createdAt, updatedAt, createdById, createdBy, ...restoreData } = versionData;

      let restoredContent: Record<string, unknown> | null = null;

      // Restaurer selon le type de contenu
      switch (contentType) {
        case "album": {
          // Sanitizer les descriptions HTML
          const sanitizedData = {
            ...restoreData,
            descriptionsFr: sanitizeDescription(restoreData.descriptionsFr),
            descriptionsEn: sanitizeDescription(restoreData.descriptionsEn),
          };

          restoredContent = await prisma.album.update({
            where: { id: contentId },
            data: sanitizedData,
          });
          break;
        }

        case "video": {
          restoredContent = await prisma.video.update({
            where: { id: contentId },
            data: restoreData,
          });
          break;
        }

        case "service": {
          // Sanitizer les descriptions HTML
          const sanitizedData = {
            ...restoreData,
            descriptionsFr: sanitizeDescription(restoreData.descriptionsFr),
            descriptionsEn: sanitizeDescription(restoreData.descriptionsEn),
          };

          restoredContent = await prisma.service.update({
            where: { id: contentId },
            data: sanitizedData,
          });
          break;
        }

        default:
          throw new ApiError(400, "Type de contenu invalide", "INVALID_CONTENT_TYPE");
      }

      // Créer une nouvelle version marquée comme "restore"
      await createVersion(contentType, contentId, restoredContent, "restore", user.id);

      return successResponse({
        message: "Version restaurée avec succès",
        content: restoredContent,
      });
    } catch (error) {
      return handleApiError(error);
    }
  }
);
