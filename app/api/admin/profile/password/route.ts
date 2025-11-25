import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError } from "@/lib/api/middleware";
import { hash, compare } from "bcryptjs";

// ============================================
// PATCH /api/admin/profile/password
// Changer le mot de passe de l'utilisateur
// ============================================

export const PATCH = withAuth(async (req, context, user) => {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validation
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Les mots de passe sont requis", "MISSING_PASSWORDS");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "Le nouveau mot de passe doit contenir au moins 8 caractères", "PASSWORD_TOO_SHORT");
    }

    // Récupérer le compte avec le mot de passe
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        providerId: "credential",
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!account || !account.password) {
      throw new ApiError(400, "Compte introuvable ou connexion via provider externe", "NO_PASSWORD_ACCOUNT");
    }

    // Vérifier l'ancien mot de passe
    const isValidPassword = await compare(currentPassword, account.password);
    if (!isValidPassword) {
      throw new ApiError(400, "Mot de passe actuel incorrect", "INVALID_CURRENT_PASSWORD");
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Mot de passe modifié avec succès",
    });
  } catch (error) {
    return handleApiError(error);
  }
});
