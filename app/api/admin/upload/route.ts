import { NextRequest } from "next/server";
import { put } from "@vercel/blob";
import {
  requireAuth,
  handleApiError,
  successResponse,
  ApiError,
} from "@/lib/api/middleware";
import { checkUploadRateLimit } from "@/lib/rate-limit";

// ============================================
// CONFIGURATION
// ============================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ============================================
// POST /api/admin/upload
// Upload d'une image vers Vercel Blob
// ============================================

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    await checkUploadRateLimit(req);

    // Vérification de l'authentification
    const user = await requireAuth(req);

    // Récupérer le fichier depuis le FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new ApiError(400, "No file provided", "NO_FILE");
    }

    // Validation du type de fichier
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new ApiError(
        400,
        `Unsupported file format. Accepted formats: ${ACCEPTED_IMAGE_TYPES.join(", ")}`,
        "INVALID_FILE_TYPE"
      );
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(
        400,
        `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        "FILE_TOO_LARGE"
      );
    }

    // Upload vers Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Retourner l'URL du fichier uploadé
    return successResponse(
      {
        url: blob.url,
        filename: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: user.id,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ============================================
// OPTIONS - CORS (si nécessaire)
// ============================================

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
