import { prisma } from "./prisma";

// ============================================
// TYPES
// ============================================

export type ContentType = "album" | "video" | "service";
export type VersionAction = "create" | "update" | "restore";

export interface VersionData {
  id: string;
  version: number;
  data: any;
  changes: any;
  action: VersionAction;
  createdBy: {
    id: string;
    email: string;
    name: string | null;
  };
  createdAt: Date;
}

export interface DiffItem {
  field: string;
  oldValue: any;
  newValue: any;
  type: "added" | "removed" | "modified";
}

// ============================================
// VERSIONING HELPERS
// ============================================

/**
 * Crée une nouvelle version d'un contenu
 */
export async function createVersion(
  contentType: ContentType,
  contentId: string,
  data: any,
  action: VersionAction,
  userId: string
): Promise<void> {
  try {
    // Récupérer la dernière version
    const lastVersion = await prisma.contentVersion.findFirst({
      where: { contentType, contentId },
      orderBy: { version: "desc" },
    });

    const newVersionNumber = (lastVersion?.version || 0) + 1;

    // Calculer les changements si ce n'est pas une création
    let changes = null;
    if (action !== "create" && lastVersion) {
      changes = calculateDiff(lastVersion.data as any, data);
    }

    // Créer la nouvelle version
    await prisma.contentVersion.create({
      data: {
        contentType,
        contentId,
        version: newVersionNumber,
        data,
        changes,
        action,
        createdById: userId,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de version:", error);
    // Ne pas bloquer l'opération principale si le versioning échoue
  }
}

/**
 * Récupère l'historique des versions d'un contenu
 */
export async function getVersionHistory(
  contentType: ContentType,
  contentId: string
): Promise<VersionData[]> {
  const versions = await prisma.contentVersion.findMany({
    where: { contentType, contentId },
    orderBy: { version: "desc" },
    include: {
      createdBy: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return versions.map((v) => ({
    id: v.id,
    version: v.version,
    data: v.data,
    changes: v.changes,
    action: v.action as VersionAction,
    createdBy: v.createdBy,
    createdAt: v.createdAt,
  }));
}

/**
 * Récupère une version spécifique
 */
export async function getVersion(versionId: string): Promise<VersionData | null> {
  const version = await prisma.contentVersion.findUnique({
    where: { id: versionId },
    include: {
      createdBy: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!version) return null;

  return {
    id: version.id,
    version: version.version,
    data: version.data,
    changes: version.changes,
    action: version.action as VersionAction,
    createdBy: version.createdBy,
    createdAt: version.createdAt,
  };
}

/**
 * Compare deux versions et retourne les différences
 */
export async function compareVersions(
  versionId1: string,
  versionId2: string
): Promise<DiffItem[]> {
  const [version1, version2] = await Promise.all([
    getVersion(versionId1),
    getVersion(versionId2),
  ]);

  if (!version1 || !version2) {
    throw new Error("Version not found");
  }

  return calculateDiff(version1.data, version2.data);
}

/**
 * Calcule les différences entre deux objets
 */
export function calculateDiff(oldData: any, newData: any): DiffItem[] {
  const diff: DiffItem[] = [];

  // Champs à ignorer pour le diff
  const ignoredFields = ["id", "createdAt", "updatedAt", "createdById"];

  // Tous les champs uniques
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ]);

  for (const key of allKeys) {
    if (ignoredFields.includes(key)) continue;

    const oldValue = oldData?.[key];
    const newValue = newData?.[key];

    // Valeur ajoutée
    if (oldValue === undefined && newValue !== undefined) {
      diff.push({
        field: key,
        oldValue: null,
        newValue,
        type: "added",
      });
    }
    // Valeur supprimée
    else if (oldValue !== undefined && newValue === undefined) {
      diff.push({
        field: key,
        oldValue,
        newValue: null,
        type: "removed",
      });
    }
    // Valeur modifiée
    else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      diff.push({
        field: key,
        oldValue,
        newValue,
        type: "modified",
      });
    }
  }

  return diff;
}

/**
 * Restaure une version antérieure
 * Retourne les données de la version à restaurer
 */
export async function getVersionData(versionId: string): Promise<any> {
  const version = await prisma.contentVersion.findUnique({
    where: { id: versionId },
    select: { data: true, contentType: true, contentId: true },
  });

  if (!version) {
    throw new Error("Version not found");
  }

  return {
    contentType: version.contentType,
    contentId: version.contentId,
    data: version.data,
  };
}

/**
 * Compte le nombre de versions pour un contenu
 */
export async function getVersionCount(
  contentType: ContentType,
  contentId: string
): Promise<number> {
  return await prisma.contentVersion.count({
    where: { contentType, contentId },
  });
}

/**
 * Récupère les dernières versions tous contenus confondus (audit log)
 */
export async function getRecentVersions(limit: number = 50): Promise<VersionData[]> {
  const versions = await prisma.contentVersion.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return versions.map((v) => ({
    id: v.id,
    version: v.version,
    data: v.data,
    changes: v.changes,
    action: v.action as VersionAction,
    createdBy: v.createdBy,
    createdAt: v.createdAt,
  }));
}
