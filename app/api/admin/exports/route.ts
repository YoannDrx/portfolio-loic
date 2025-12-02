import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, successResponse } from "@/lib/api/middleware";

// ============================================
// GET /api/admin/exports
// Liste des exports de l'utilisateur connecté
// Pour re-téléchargement
// ============================================

export const GET = withAuth(async (req, _context, user) => {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    // Filtres optionnels
    const type = searchParams.get("type");
    const format = searchParams.get("format");

    // Construction du filtre
    const where: {
      userId: string;
      type?: string;
      format?: string;
    } = { userId: user.id };

    if (type) where.type = type;
    if (format) where.format = format;

    // Requêtes
    const [exports, total] = await Promise.all([
      prisma.exportLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          format: true,
          filename: true,
          fileSize: true,
          createdAt: true,
          // On n'inclut pas le contenu dans la liste pour des raisons de performance
        },
      }),
      prisma.exportLog.count({ where }),
    ]);

    return successResponse({
      exports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + exports.length < total,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});
