import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { CVDocumentCreative } from "@/components/cv/pdf-document-creative";
import type { CVData, CVTheme } from "@/types/cv";

const defaultTheme: CVTheme = {
  primary: "#D5FF0A",
  secondary: "#9EF01A",
  header: "#0B0C12",
  sidebar: "#F4F5F7",
  surface: "#FFFFFF",
  text: "#0D0E11",
  muted: "#60626A",
  border: "#E2E4EA",
  badge: "#0F1118",
};

const sampleSections = [
  {
    type: "experience",
    placement: "main",
    layoutType: "timeline",
    order: 0,
    isActive: true,
    color: defaultTheme.primary,
    translations: [
      { locale: "fr", title: "Expériences" },
      { locale: "en", title: "Experience" },
    ],
    items: [
      {
        order: 0,
        isActive: true,
        isCurrent: true,
        startDate: new Date().toISOString(),
        translations: [
          { locale: "fr", title: "Compositeur freelance", subtitle: "Projets cinéma, jeux, pub", location: "Paris", description: "Création de bandes originales et supervision musicale." },
          { locale: "en", title: "Freelance Composer", subtitle: "Film, game & ad projects", location: "Paris", description: "Original scores, sound design and music supervision." },
        ],
      },
    ],
  },
  {
    type: "education",
    placement: "sidebar",
    layoutType: "list",
    order: 1,
    isActive: true,
    color: defaultTheme.secondary,
    translations: [
      { locale: "fr", title: "Formation" },
      { locale: "en", title: "Education" },
    ],
    items: [
      {
        order: 0,
        isActive: true,
        translations: [
          { locale: "fr", title: "Master Musique à l'image", subtitle: "Paris", description: "Orchestration & sound design" },
          { locale: "en", title: "Master in Scoring", subtitle: "Paris", description: "Orchestration & sound design" },
        ],
      },
    ],
  },
];

const sampleSkills = [
  {
    category: "technical",
    level: 5,
    showAsBar: true,
    order: 0,
    translations: [
      { locale: "fr", name: "Composition" },
      { locale: "en", name: "Composition" },
    ],
  },
  {
    category: "software",
    level: 0,
    showAsBar: false,
    order: 1,
    translations: [
      { locale: "fr", name: "Logic Pro" },
      { locale: "en", name: "Logic Pro" },
    ],
  },
  {
    category: "language",
    level: 0,
    showAsBar: false,
    order: 2,
    translations: [
      { locale: "fr", name: "Français / Anglais" },
      { locale: "en", name: "French / English" },
    ],
  },
];

const buildFallback = async (): Promise<CVData> => {
  const profile = await prisma.resumeProfile.findFirst().catch(() => null);

  return {
    sections: sampleSections,
    skills: sampleSkills,
    socialLinks: [],
    fullName: profile?.name ?? "Loïc Ghanem",
    badgeFr: profile?.roleFr ?? "Compositeur & producteur",
    badgeEn: profile?.roleEn ?? "Composer & producer",
    headlineFr: profile?.headlineFr ?? "Compositeur pour l'image, superviseur musical et sound designer.",
    headlineEn: profile?.headlineEn ?? "Composer & producer crafting cinematic and electronic textures.",
    bioFr:
      profile?.headlineFr ??
      "Compositeur et producteur basé à Paris, spécialisé dans les univers hybrides mêlant électronique et orchestral.",
    bioEn:
      profile?.headlineEn ??
      "Paris-based composer blending electronic textures with cinematic orchestration for films, games and brands.",
    email: profile?.email ?? "loic.ghanem@outlook.com",
    phone: profile?.phone ?? "",
    website: profile?.website ?? "loicghanem.com",
    location: profile?.location ?? "Paris, France",
    photo: profile?.photo ?? "/img/slider/loic-studio-front.jpg",
    accentColor: defaultTheme.primary,
    showPhoto: true,
    layout: "creative",
    theme: defaultTheme,
  };
};

type CvSectionItem = {
  startDate?: unknown;
  endDate?: unknown;
  order: number;
  isActive?: boolean;
  isCurrent?: boolean;
  translations: Array<{ locale: string; title?: string; subtitle?: string; location?: string; description?: string }>;
} & Record<string, unknown>;

type CvSection = {
  id?: string;
  type: string;
  icon?: string | null;
  color?: string | null;
  placement?: string;
  layoutType?: string;
  order: number;
  isActive?: boolean;
  items: CvSectionItem[];
  translations: Array<{ locale: string; title?: string }>;
} & Record<string, unknown>;

type CvSkill = {
  id?: string;
  category: string;
  level: number;
  showAsBar?: boolean;
  order: number;
  isActive?: boolean;
  translations: Array<{ locale: string; title?: string }>;
};

type CvSocialLink = {
  id?: string;
  platform: string;
  url: string;
  label?: string | null;
  order: number;
};

type CvRecord = {
  id: string;
  fullName?: string | null;
  badgeFr?: string | null;
  badgeEn?: string | null;
  photo?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  location?: string | null;
  linkedInUrl?: string | null;
  headlineFr?: string | null;
  headlineEn?: string | null;
  bioFr?: string | null;
  bioEn?: string | null;
  layout?: string | null;
  accentColor?: string | null;
  showPhoto?: boolean | null;
  theme?: unknown;
  sections: CvSection[];
  skills: CvSkill[];
  socialLinks: CvSocialLink[];
};

const toIsoString = (value: unknown): string | null => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (value && typeof (value as { toISOString?: unknown }).toISOString === "function") {
    return (value as { toISOString: () => string }).toISOString();
  }

  return null;
};

const transformCv = (cv: unknown): CVData => {
  const typed = cv as CvRecord;

  const theme = (typed as { theme?: unknown })?.theme ?? null;
  const accent =
    typed.accentColor || ((theme as { primary?: string } | null)?.primary ?? undefined);

  return {
    id: typed.id,
    fullName: typed.fullName,
    badgeFr: typed.badgeFr,
    badgeEn: typed.badgeEn,
    photo: typed.photo,
    phone: typed.phone,
    email: typed.email,
    website: typed.website,
    location: typed.location,
    linkedInUrl: typed.linkedInUrl,
    headlineFr: typed.headlineFr,
    headlineEn: typed.headlineEn,
    bioFr: typed.bioFr,
    bioEn: typed.bioEn,
    layout: typed.layout ?? "creative",
    accentColor: accent,
    showPhoto: typed.showPhoto ?? true,
    theme: theme as CVTheme | null,
    sections: typed.sections.map((section) => ({
      ...section,
      items: section.items.map((item: CvSectionItem) => ({
        ...item,
        startDate: toIsoString(item.startDate),
        endDate: toIsoString(item.endDate),
      })),
    })),
    skills: typed.skills ?? [],
    socialLinks: typed.socialLinks ?? [],
  };
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const localeParam = searchParams.get("locale") ?? searchParams.get("lang") ?? "fr";

  try {
    const cv = await prisma.cV.findFirst({
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            translations: true,
            items: {
              where: { isActive: true },
              orderBy: { order: "asc" },
              include: {
                translations: true,
              },
            },
          },
        },
        skills: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          include: {
            translations: true,
          },
        },
        socialLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    const transformedCV = cv ? transformCv(cv) : await buildFallback();
    const resolvedPhoto =
      transformedCV.photo && transformedCV.photo.startsWith("http")
        ? transformedCV.photo
        : path.resolve(`./public${transformedCV.photo || "/img/slider/loic-studio-front.jpg"}`);

    const pdfData = {
      ...transformedCV,
      photo: resolvedPhoto,
    };

    const buffer = await renderToBuffer(<CVDocumentCreative data={pdfData} locale={localeParam} />);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Loic_Ghanem_CV_${localeParam.toUpperCase()}.pdf"`,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating PDF:", error);
    return new NextResponse("Error generating PDF", { status: 500 });
  }
}
