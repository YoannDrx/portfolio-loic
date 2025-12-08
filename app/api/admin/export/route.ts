import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError } from "@/lib/api/middleware";
import { logExport } from "@/lib/activity-logger";
import * as XLSX from "xlsx";

type ExportValue = string | number | boolean | Date | null | undefined;
type ExportRow = Record<string, ExportValue>;

// ============================================
// GET /api/admin/export
// Export de données en CSV, JSON, TXT ou XLSX
// Stocke l'export en DB pour re-téléchargement
// ============================================

export const GET = withAuth(async (req, _context, user) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "albums", "videos", "services"
    const format = searchParams.get("format") || "csv"; // "csv", "json", "txt" ou "xlsx"

    if (!type || !["albums", "videos", "services"].includes(type)) {
      throw new ApiError(400, "Type invalide", "INVALID_TYPE");
    }

    if (!["csv", "json", "txt", "xlsx"].includes(format)) {
      throw new ApiError(400, "Format invalide", "INVALID_FORMAT");
    }

    // Fetch data
    let data: ExportRow[] = [];

    switch (type) {
      case "albums":
        data = await prisma.album.findMany({
          select: {
            id: true,
            title: true,
            date: true,
            sortedDate: true,
            style: true,
            published: true,
            listenLink: true,
            collabName: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "videos":
        data = await prisma.video.findMany({
          select: {
            id: true,
            title: true,
            videoId: true,
            type: true,
            date: true,
            published: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
        break;

      case "services":
        data = await prisma.service.findMany({
          select: {
            id: true,
            no: true,
            title: true,
            author: true,
            date: true,
            published: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
        break;
    }

    // Générer le contenu selon le format
    let content: string | Buffer;
    let contentType: string;
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `${type}-${dateStr}.${format}`;
    let isBinary = false;

    if (format === "csv") {
      content = convertToCSV(data);
      contentType = "text/csv; charset=utf-8";
    } else if (format === "json") {
      content = JSON.stringify(data, null, 2);
      contentType = "application/json";
    } else if (format === "txt") {
      content = convertToTXT(data, type);
      contentType = "text/plain; charset=utf-8";
    } else if (format === "xlsx") {
      content = convertToXLSX(data, type);
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      isBinary = true;
    } else {
      throw new ApiError(400, "Format non supporté", "UNSUPPORTED_FORMAT");
    }

    // Stocker l'export en DB pour re-téléchargement
    // Pour les fichiers binaires, on stocke en base64
    const contentToStore = isBinary
      ? (content as Buffer).toString("base64")
      : (content as string);

    await prisma.exportLog.create({
      data: {
        userId: user.id,
        type,
        format,
        filename,
        content: contentToStore,
        fileSize: isBinary ? (content as Buffer).length : Buffer.byteLength(content as string, "utf-8"),
      },
    });

    // Logger l'action
    await logExport(user.id, type, format, data.length);

    // Pour les réponses binaires, convertir en Uint8Array
    const responseBody = isBinary
      ? new Uint8Array(content as Buffer)
      : (content as string);

    return new NextResponse(responseBody, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// HELPERS
// ============================================

function convertToCSV(data: ExportRow[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // Header row
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma or quote
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    ),
  ];

  return csvRows.join("\n");
}

function convertToTXT(data: ExportRow[], type: string): string {
  if (data.length === 0) return `Aucune donnée à exporter pour ${type}\n`;

  const typeTitles: Record<string, string> = {
    albums: "ALBUMS",
    videos: "VIDÉOS",
    services: "SERVICES",
  };

  let txt = `========================================\n`;
  txt += `   EXPORT ${typeTitles[type]}\n`;
  txt += `   Date: ${new Date().toLocaleString("fr-FR")}\n`;
  txt += `   Total: ${data.length} élément(s)\n`;
  txt += `========================================\n\n`;

  data.forEach((item, index) => {
    txt += `--- ${index + 1}. ${item.title || item.no || item.id} ---\n`;

    Object.entries(item).forEach(([key, value]) => {
      // Formater les clés pour être plus lisibles
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim();

      // Formater les valeurs
      let formattedValue = value;
      if (value === null || value === undefined) {
        formattedValue = "(vide)";
      } else if (typeof value === "boolean") {
        formattedValue = value ? "Oui" : "Non";
      } else if (value instanceof Date) {
        formattedValue = value.toLocaleString("fr-FR");
      }

      txt += `  ${formattedKey}: ${formattedValue}\n`;
    });

    txt += `\n`;
  });

  txt += `========================================\n`;
  txt += `Fin de l'export\n`;
  txt += `========================================\n`;

  return txt;
}

function convertToXLSX(data: ExportRow[], type: string): Buffer {
  const typeTitles: Record<string, string> = {
    albums: "Albums",
    videos: "Vidéos",
    services: "Services",
  };

  // Préparer les données pour Excel avec headers traduits
  const headerTranslations: Record<string, string> = {
    id: "ID",
    title: "Titre",
    date: "Date",
    sortedDate: "Date triée",
    style: "Style",
    published: "Publié",
    listenLink: "Lien écoute",
    collabName: "Collaboration",
    createdAt: "Créé le",
    videoId: "ID Vidéo",
    type: "Type",
    no: "Numéro",
    author: "Auteur",
  };

  // Convertir les données pour Excel
  const excelData = data.map((row) => {
    const newRow: Record<string, unknown> = {};
    Object.entries(row).forEach(([key, value]) => {
      const translatedKey = headerTranslations[key] || key;
      // Formater les valeurs
      if (typeof value === "boolean") {
        newRow[translatedKey] = value ? "Oui" : "Non";
      } else if (value instanceof Date) {
        newRow[translatedKey] = value.toLocaleString("fr-FR");
      } else {
        newRow[translatedKey] = value;
      }
    });
    return newRow;
  });

  // Créer le workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Ajuster la largeur des colonnes
  const maxWidths: number[] = [];
  excelData.forEach((row) => {
    Object.values(row).forEach((value, index) => {
      const len = String(value || "").length;
      maxWidths[index] = Math.max(maxWidths[index] || 10, len);
    });
  });
  worksheet["!cols"] = maxWidths.map((w) => ({ wch: Math.min(w + 2, 50) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, typeTitles[type] || type);

  // Générer le buffer
  return Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
}
