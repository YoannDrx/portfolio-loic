import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger";

// ============================================
// Types
// ============================================

export type ActivityType = "auth" | "export" | "crud" | "settings";
export type AuthAction = "login" | "logout" | "login_failed";
export type CrudAction = "create" | "update" | "delete";
export type ExportAction = "export" | "download";
export type SettingsAction = "password_change" | "email_change";

export interface LogActivityParams {
  type: ActivityType;
  action: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  entityTitle?: string;
  details?: Record<string, unknown>;
  request?: Request;
}

// ============================================
// Helpers pour extraire IP et User-Agent
// ============================================

function getClientInfo(request?: Request): { ipAddress?: string; userAgent?: string } {
  if (!request) return {};

  const headers = request.headers;

  // Récupérer l'IP (en tenant compte des proxies)
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") || // Cloudflare
    undefined;

  const userAgent = headers.get("user-agent") || undefined;

  return { ipAddress, userAgent };
}

// ============================================
// Fonction principale de logging
// ============================================

/**
 * Log une activité dans la base de données
 * Ne throw jamais - les logs ne doivent pas bloquer les opérations principales
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const { type, action, userId, entityType, entityId, entityTitle, details, request } = params;
    const { ipAddress, userAgent } = getClientInfo(request);

    await prisma.activityLog.create({
      data: {
        type,
        action,
        userId,
        entityType,
        entityId,
        entityTitle,
        details: details ? (details as Prisma.InputJsonValue) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    logger.error("[ActivityLogger] Erreur lors du logging:", error);
    // Ne pas throw - le logging ne doit pas bloquer l'opération principale
  }
}

// ============================================
// Helpers spécifiques par type d'action
// ============================================

/**
 * Log une action d'authentification
 */
export async function logAuth(
  action: AuthAction,
  userId?: string,
  request?: Request,
  details?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    type: "auth",
    action,
    userId,
    details,
    request,
  });
}

/**
 * Log une action CRUD (création, modification, suppression)
 */
export async function logCrud(
  action: CrudAction,
  entityType: string,
  entityId: string,
  entityTitle: string,
  userId: string,
  details?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    type: "crud",
    action,
    userId,
    entityType,
    entityId,
    entityTitle,
    details,
  });
}

/**
 * Log un export
 */
export async function logExport(
  userId: string,
  exportType: string,
  format: string,
  itemCount: number
): Promise<void> {
  return logActivity({
    type: "export",
    action: "export",
    userId,
    details: {
      exportType,
      format,
      itemCount,
    },
  });
}

/**
 * Log un re-téléchargement d'export
 */
export async function logExportDownload(
  userId: string,
  exportId: string,
  exportType: string
): Promise<void> {
  return logActivity({
    type: "export",
    action: "download",
    userId,
    entityId: exportId,
    details: {
      exportType,
    },
  });
}

/**
 * Log un changement de paramètres (mot de passe, email)
 */
export async function logSettingsChange(
  action: SettingsAction,
  userId: string,
  details?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    type: "settings",
    action,
    userId,
    details,
  });
}

// ============================================
// Utilitaires pour les routes API
// ============================================

/**
 * Extrait le userId depuis une requête authentifiée
 * À utiliser dans les routes API
 */
export function extractUserIdFromContext(user: { id: string } | null | undefined): string | undefined {
  return user?.id;
}
