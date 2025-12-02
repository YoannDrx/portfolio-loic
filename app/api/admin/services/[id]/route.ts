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
  serviceUpdateSchema,
  type ServiceUpdateInput,
} from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";
import { createVersion } from "@/lib/versioning";
import { logCrud } from "@/lib/activity-logger";

// ============================================
// GET /api/admin/services/[id]
// Récupérer un service par ID
// ============================================

export const GET = withAuth(async (_req, context, _user) => {
  try {
    const { id } = await context.params;

    const service = await prisma.service.findUnique({
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

    if (!service) {
      throw new ApiError(404, "Service non trouvé", "NOT_FOUND");
    }

    return successResponse(service);
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// PATCH /api/admin/services/[id]
// Mettre à jour un service
// ============================================

export const PATCH = withAuthAndValidation(
  serviceUpdateSchema,
  async (_req, context, user, data: ServiceUpdateInput) => {
    try {
      const { id } = await context.params;

      // Vérifier que le service existe
      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        throw new ApiError(404, "Service non trouvé", "NOT_FOUND");
      }

      // Préparer les données de mise à jour
      const updateData: Partial<ServiceUpdateInput> = { ...data };

      // Sanitizer les descriptions si elles sont fournies
      if (data.descriptionsFr) {
        updateData.descriptionsFr = sanitizeDescription(data.descriptionsFr);
      }
      if (data.descriptionsEn) {
        updateData.descriptionsEn = sanitizeDescription(data.descriptionsEn);
      }

      // Mettre à jour le service
      const service = await prisma.service.update({
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
      await createVersion("service", service.id, service, "update", user.id);

      // Logger l'action
      await logCrud("update", "service", service.id, service.title, user.id, {
        updatedFields: Object.keys(data),
      });

      return successResponse(service);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

// ============================================
// DELETE /api/admin/services/[id]
// Supprimer un service
// ============================================

export const DELETE = withAuth(async (_req, context, user) => {
  try {
    const { id } = await context.params;

    // Vérifier que le service existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new ApiError(404, "Service non trouvé", "NOT_FOUND");
    }

    // Supprimer le service
    await prisma.service.delete({
      where: { id },
    });

    // Logger l'action (avec le titre sauvegardé avant suppression)
    await logCrud("delete", "service", id, existingService.title, user.id);

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});
