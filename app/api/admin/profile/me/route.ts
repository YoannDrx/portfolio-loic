import { NextResponse } from "next/server";
import { withAuth, handleApiError } from "@/lib/api/middleware";

// ============================================
// GET /api/admin/profile/me
// Récupérer les informations de l'utilisateur connecté
// ============================================

export const GET = withAuth(async (req, context, user) => {
  try {
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        image: user.image,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});
