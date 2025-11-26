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
  albumCreateSchema,
  albumsQuerySchema,
  type AlbumCreateInput,
  type AlbumsQueryParams,
} from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";
import { createVersion } from "@/lib/versioning";
import type { Prisma } from "@prisma/client";

// ============================================
// GET /api/admin/albums
// Liste tous les albums avec pagination et filtres
// ============================================

export const GET = withAuth(async (req, _context, _user) => {
  try {
    // Valider les query params
    const query: AlbumsQueryParams = validateQuery(req, albumsQuerySchema);

    // Construire les filtres
    const where: Prisma.AlbumWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { poster: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.style) {
      where.style = query.style;
    }

    if (query.published !== undefined) {
      where.published = query.published;
    }

    // Compter le total
    const total = await prisma.album.count({ where });

    // Récupérer les albums paginés
    const albums = await prisma.album.findMany({
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
      items: albums,
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
// POST /api/admin/albums
// Créer un nouvel album
// ============================================

export const POST = withAuthAndValidation(
  albumCreateSchema,
  async (_req, _context, user, data: AlbumCreateInput) => {
    try {
      // Sanitizer les descriptions HTML
      const sanitizedDescriptionsFr = sanitizeDescription(data.descriptionsFr);
      const sanitizedDescriptionsEn = sanitizeDescription(data.descriptionsEn);

      // Créer l'album
      const album = await prisma.album.create({
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
      await createVersion("album", album.id, album, "create", user.id);

      return createdResponse(album);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
