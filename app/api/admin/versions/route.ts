import { NextRequest } from "next/server";
import {
  withAuth,
  handleApiError,
  successResponse,
  ApiError,
} from "@/lib/api/middleware";
import { getVersionHistory, getRecentVersions, ContentType } from "@/lib/versioning";

// ============================================
// GET /api/admin/versions
// Récupère l'historique des versions
// ============================================

export const GET = withAuth(async (req, context, user) => {
  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("contentType") as ContentType | null;
    const contentId = searchParams.get("contentId");
    const recent = searchParams.get("recent");

    // Mode 1: Récupérer les versions récentes (audit log global)
    if (recent === "true") {
      const limit = parseInt(searchParams.get("limit") || "50");
      const versions = await getRecentVersions(limit);
      return successResponse({ versions });
    }

    // Mode 2: Récupérer l'historique d'un contenu spécifique
    if (!contentType || !contentId) {
      throw new ApiError(
        400,
        "contentType et contentId requis (ou recent=true pour l'audit log)",
        "INVALID_PARAMS"
      );
    }

    if (!["album", "video", "service"].includes(contentType)) {
      throw new ApiError(
        400,
        "contentType doit être 'album', 'video' ou 'service'",
        "INVALID_CONTENT_TYPE"
      );
    }

    const versions = await getVersionHistory(contentType, contentId);

    return successResponse({ versions });
  } catch (error) {
    return handleApiError(error);
  }
});
