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
  serviceCreateSchema,
  servicesQuerySchema,
  ServiceCreateInput,
  ServicesQueryParams,
} from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";
import { createVersion } from "@/lib/versioning";

// ============================================
// GET /api/admin/services
// Liste tous les services avec pagination et filtres
// ============================================

export const GET = withAuth(async (req, context, user) => {
  try {
    // Valider les query params
    const query: ServicesQueryParams = validateQuery(req, servicesQuerySchema);

    // Construire les filtres
    const where: any = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { author: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.published !== undefined) {
      where.published = query.published;
    }

    // Compter le total
    const total = await prisma.service.count({ where });

    // Récupérer les services paginés
    const services = await prisma.service.findMany({
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
      items: services,
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
// POST /api/admin/services
// Créer un nouveau service
// ============================================

export const POST = withAuthAndValidation(
  serviceCreateSchema,
  async (req, context, user, data: ServiceCreateInput) => {
    try {
      // Sanitizer les descriptions HTML
      const sanitizedDescriptionsFr = sanitizeDescription(data.descriptionsFr);
      const sanitizedDescriptionsEn = sanitizeDescription(data.descriptionsEn);

      // Créer le service
      const service = await prisma.service.create({
        data: {
          ...data,
          descriptionsFr: sanitizedDescriptionsFr,
          descriptionsEn: sanitizedDescriptionsEn,
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
      await createVersion("service", service.id, service, "create", user.id);

      return createdResponse(service);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
