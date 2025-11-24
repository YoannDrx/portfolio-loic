import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { ResumePDF } from "@/components/cv/ResumePDF";

const fallbackProfile = {
  name: "Loïc Ghanem",
  roleEn: "Music Composer & Producer",
  roleFr: "Compositeur & Producteur",
  headlineEn: "Hybrid scores and bold electronic textures for film, games, and brands.",
  headlineFr: "Partitions hybrides et textures électroniques pour films, jeux et marques.",
  email: "loic.ghanem@outlook.com",
  phone: undefined,
  location: "Paris, France",
  website: "loicghanem.com",
  photo: "/img/slider/loic-studio-front.jpg",
};

const fallbackTheme = {
  primary: "#1bd99a",
  secondary: "#5dd6ff",
  accent: "#ff6bd6",
  muted: "#6b7280",
  sidebar: "#f5f7fb",
  divider: "#e5e7eb",
  gradientFrom: "#1bd99a",
  gradientTo: "#5dd6ff",
  tagBg: "#eef2ff",
  tagText: "#0b1021",
  fontHeadings: "Helvetica",
  fontBody: "Helvetica",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get("locale") || "en";

  try {
    // Fetch data
    const [entries, settings, profile, theme, sections] = await Promise.all([
      prisma.resumeEntry.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
      prisma.resumeProfile.findFirst(),
      prisma.resumeTheme.findFirst(),
      prisma.resumeSection.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ]);

    if (!settings) {
       // Fallback settings if not found (should happen only on fresh db)
       // But for safety, return error or default
       return new NextResponse("Site settings not initialized", { status: 500 });
    }

    const buffer = await renderToBuffer(
      <ResumePDF
        data={{
          entries,
          settings,
          locale,
          profile: profile ?? fallbackProfile,
          theme: theme ?? fallbackTheme,
          sections,
        }}
      />
    );

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Loic_Ghanem_CV_${locale.toUpperCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
