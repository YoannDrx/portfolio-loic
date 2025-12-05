import { prisma } from "@/lib/prisma";
import {
  withAuth,
  handleApiError,
  successResponse,
} from "@/lib/api/middleware";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

// ============================================
// GET /api/admin/notifications
// Récupère les notifications avec le count non-lues
// ============================================

export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Construire la requête
    const where = unreadOnly ? { read: false } : {};

    // Récupérer les notifications et le count en parallèle
    const [notifications, unreadCount, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { read: false } }),
      prisma.notification.count(),
    ]);

    return successResponse({
      items: notifications,
      unreadCount,
      totalCount,
    });
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// PATCH /api/admin/notifications
// Marquer des notifications comme lues
// ============================================

export const PATCH = withAuth(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { ids, markAllRead } = body as {
      ids?: string[];
      markAllRead?: boolean;
    };

    if (markAllRead) {
      // Marquer toutes les notifications comme lues
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      });
    } else if (ids && ids.length > 0) {
      // Marquer les notifications spécifiées comme lues
      await prisma.notification.updateMany({
        where: { id: { in: ids } },
        data: { read: true },
      });
    } else {
      return NextResponse.json(
        { error: "ids ou markAllRead requis" },
        { status: 400 }
      );
    }

    // Retourner le nouveau count
    const unreadCount = await prisma.notification.count({
      where: { read: false },
    });

    return successResponse({ success: true, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// DELETE /api/admin/notifications
// Supprimer des notifications
// ============================================

export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deleteRead = searchParams.get("deleteRead") === "true";

    if (deleteRead) {
      // Supprimer toutes les notifications lues
      await prisma.notification.deleteMany({
        where: { read: true },
      });
    } else if (id) {
      // Supprimer une notification spécifique
      await prisma.notification.delete({
        where: { id },
      });
    } else {
      return NextResponse.json(
        { error: "id ou deleteRead requis" },
        { status: 400 }
      );
    }

    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
});
