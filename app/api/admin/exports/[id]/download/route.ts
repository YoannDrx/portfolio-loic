import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError } from "@/lib/api/middleware";
import { logExportDownload } from "@/lib/activity-logger";

// ============================================
// GET /api/admin/exports/[id]/download
// Re-téléchargement d'un export stocké
// ============================================

export const GET = withAuth(async (_req, context, user) => {
  try {
    const { id } = await context.params;

    if (!id) {
      throw new ApiError(400, "ID export requis", "MISSING_ID");
    }

    // Récupérer l'export
    const exportLog = await prisma.exportLog.findUnique({
      where: { id },
    });

    if (!exportLog) {
      throw new ApiError(404, "Export non trouvé", "EXPORT_NOT_FOUND");
    }

    // Vérifier que l'export appartient à l'utilisateur
    if (exportLog.userId !== user.id) {
      throw new ApiError(403, "Accès non autorisé", "FORBIDDEN");
    }

    // Logger le re-téléchargement
    await logExportDownload(user.id, exportLog.id, exportLog.type);

    // Déterminer le content-type et si c'est binaire
    let contentType: string;
    let isBinary = false;

    switch (exportLog.format) {
      case "csv":
        contentType = "text/csv; charset=utf-8";
        break;
      case "json":
        contentType = "application/json";
        break;
      case "txt":
        contentType = "text/plain; charset=utf-8";
        break;
      case "xlsx":
        contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        isBinary = true;
        break;
      default:
        contentType = "application/octet-stream";
    }

    // Pour les fichiers binaires (xlsx), décoder le base64
    const content = isBinary
      ? new Uint8Array(Buffer.from(exportLog.content, "base64"))
      : exportLog.content;

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${exportLog.filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});
