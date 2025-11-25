import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError, successResponse } from "@/lib/api/middleware";

// ============================================
// PATCH /api/admin/profile/email
// Changer l'email de l'utilisateur
// ============================================

export const PATCH = withAuth(async (req, context, user) => {
  try {
    const body = await req.json();
    const { newEmail } = body;

    // Validation
    if (!newEmail) {
      throw new ApiError(400, "Le nouvel email est requis", "MISSING_EMAIL");
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new ApiError(400, "Email invalide", "INVALID_EMAIL");
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== user.id) {
      throw new ApiError(400, "Cet email est déjà utilisé", "EMAIL_TAKEN");
    }

    // Mettre à jour l'email
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: newEmail,
        emailVerified: false, // Remettre à false car nouvel email
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Email modifié avec succès",
    });
  } catch (error) {
    return handleApiError(error);
  }
});
