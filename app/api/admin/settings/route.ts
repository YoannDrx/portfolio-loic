import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError } from "@/lib/api/middleware";

// ============================================
// GET /api/admin/settings
// Récupérer les paramètres du site
// ============================================

export const GET = withAuth(async () => {
  try {
    // Récupérer ou créer les settings
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" },
    });

    // Si les settings n'existent pas, les créer avec les valeurs par défaut
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: "site_settings" },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// PATCH /api/admin/settings
// Mettre à jour les paramètres du site
// ============================================

export const PATCH = withAuth(async (req) => {
  try {
    const body = await req.json();

    // Récupérer ou créer les settings
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" },
    });

    if (!settings) {
      // Créer avec les nouvelles données
      settings = await prisma.siteSettings.create({
        data: {
          id: "site_settings",
          ...body,
        },
      });
    } else {
      // Mettre à jour
      settings = await prisma.siteSettings.update({
        where: { id: "site_settings" },
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
});
