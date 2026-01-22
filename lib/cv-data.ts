import { prisma } from "@/lib/prisma";
import type { CVData, CVTheme } from "@/types/cv";

export const defaultCVTheme: CVTheme = {
  primary: "#F73604",
  secondary: "#F73604",
  header: "#0B0C12",
  sidebar: "#F4F5F7",
  surface: "#FFFFFF",
  text: "#0B0C12",
  muted: "#666666",
  border: "#0B0C12",
  badge: "#F73604",
};

const SECTION_PALETTE = {
  experience: "#F73604",
  education: "#0A66C2",
  skills: "#00A67E",
  achievements: "#7C3AED",
  languages: "#EC4899",
  default: "#06B6D4",
};

const sampleSections = [
  {
    type: "experience",
    placement: "main",
    layoutType: "timeline",
    order: 0,
    isActive: true,
    color: SECTION_PALETTE.experience,
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
          {
            locale: "fr",
            title: "Compositeur freelance",
            subtitle: "Projets cinéma, jeux, pub",
            location: "Paris",
            description: "Création de bandes originales et supervision musicale.",
          },
          {
            locale: "en",
            title: "Freelance Composer",
            subtitle: "Film, game & ad projects",
            location: "Paris",
            description: "Original scores, sound design and music supervision.",
          },
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
    color: SECTION_PALETTE.education,
    translations: [
      { locale: "fr", title: "Formation" },
      { locale: "en", title: "Education" },
    ],
    items: [
      {
        order: 0,
        isActive: true,
        translations: [
          {
            locale: "fr",
            title: "Master Musique à l'image",
            subtitle: "Paris",
            description: "Orchestration & sound design",
          },
          {
            locale: "en",
            title: "Master in Scoring",
            subtitle: "Paris",
            description: "Orchestration & sound design",
          },
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

async function buildFallback(): Promise<CVData> {
  const profile = await prisma.resumeProfile.findFirst().catch(() => null);

  return {
    sections: sampleSections,
    skills: sampleSkills,
    socialLinks: [],
    fullName: profile?.name ?? "Loïc Ghanem",
    badgeFr: profile?.roleFr ?? "Compositeur & producteur",
    badgeEn: profile?.roleEn ?? "Composer & producer",
    headlineFr:
      profile?.headlineFr ?? "Compositeur pour l'image, superviseur musical et sound designer.",
    headlineEn:
      profile?.headlineEn ?? "Composer & producer crafting cinematic and electronic textures.",
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
    accentColor: defaultCVTheme.primary,
    showPhoto: true,
    layout: "creative",
    theme: defaultCVTheme,
  };
}

export async function getCVData(): Promise<CVData> {
  try {
    const cv = await prisma.cV.findFirst({
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            translations: true,
            items: {
              orderBy: { order: "asc" },
              include: {
                translations: true,
              },
            },
          },
        },
        skills: {
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

    if (!cv) {
      return buildFallback();
    }

    const theme = (cv as { theme?: unknown })?.theme ?? null;
    const accentColor =
      cv.accentColor || (theme as { primary?: string } | null)?.primary || undefined;

    return {
      id: cv.id,
      fullName: cv.fullName,
      badgeFr: cv.badgeFr,
      badgeEn: cv.badgeEn,
      photo: cv.photo,
      phone: cv.phone,
      email: cv.email,
      website: cv.website,
      location: cv.location,
      linkedInUrl: cv.linkedInUrl,
      headlineFr: cv.headlineFr,
      headlineEn: cv.headlineEn,
      bioFr: cv.bioFr,
      bioEn: cv.bioEn,
      layout: cv.layout,
      accentColor,
      showPhoto: cv.showPhoto,
      theme,
      sections: cv.sections.map((section) => ({
        id: section.id,
        type: section.type,
        icon: section.icon,
        color: section.color,
        placement: section.placement,
        layoutType: section.layoutType,
        order: section.order,
        isActive: section.isActive,
        translations: section.translations.map((t) => ({
          locale: t.locale,
          title: t.title,
        })),
        items: section.items.map((item) => ({
          id: item.id,
          startDate: item.startDate?.toISOString() ?? null,
          endDate: item.endDate?.toISOString() ?? null,
          isCurrent: item.isCurrent,
          order: item.order,
          isActive: item.isActive,
          translations: item.translations.map((t) => ({
            locale: t.locale,
            title: t.title,
            subtitle: t.subtitle,
            location: t.location,
            description: t.description,
          })),
        })),
      })),
      skills: cv.skills.map((skill) => ({
        id: skill.id,
        category: skill.category,
        level: skill.level,
        showAsBar: skill.showAsBar,
        order: skill.order,
        isActive: skill.isActive,
        translations: skill.translations.map((t) => ({
          locale: t.locale,
          name: t.name,
        })),
      })),
      socialLinks: cv.socialLinks.map((link) => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        label: link.label,
        order: link.order,
      })),
    };
  } catch {
    return buildFallback();
  }
}
