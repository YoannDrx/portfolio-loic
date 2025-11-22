import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, handleApiError, ApiError } from "@/lib/api/middleware";

// ============================================
// GET /api/admin/export
// Export de données en CSV ou JSON
// ============================================

export const GET = withAuth(async (req, context, user) => {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "albums", "videos", "services"
    const format = searchParams.get("format") || "csv"; // "csv", "json" ou "txt"

    if (!type || !["albums", "videos", "services"].includes(type)) {
      throw new ApiError(400, "Type invalide", "INVALID_TYPE");
    }

    if (!["csv", "json", "txt"].includes(format)) {
      throw new ApiError(400, "Format invalide", "INVALID_FORMAT");
    }

    // Fetch data
    let data: any[] = [];

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

    // Format CSV
    if (format === "csv") {
      const csv = convertToCSV(data);

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    // Format JSON
    if (format === "json") {
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    // Format TXT
    if (format === "txt") {
      const txt = convertToTXT(data, type);
      return new Response(txt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().split("T")[0]}.txt"`,
        },
      });
    }

    throw new ApiError(400, "Format non supporté", "UNSUPPORTED_FORMAT");
  } catch (error) {
    return handleApiError(error);
  }
});

// ============================================
// HELPERS
// ============================================

function convertToCSV(data: any[]): string {
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

function convertToTXT(data: any[], type: string): string {
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
