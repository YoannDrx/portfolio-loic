import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

export async function GET() {
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
      return NextResponse.json(await buildFallback());
    }

    const theme = (cv as { theme?: unknown })?.theme ?? null;
    const accentColor =
      cv.accentColor || (theme as { primary?: string } | null)?.primary || undefined;

    const transformed: CVData = {
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

    return NextResponse.json(transformed);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching CV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as CVData;
    const { sections, skills, socialLinks, ...cvData } = body;

    let cv = await prisma.cV.findFirst();

    if (cv) {
      await prisma.cV.update({
        where: { id: cv.id },
        data: {
          fullName: cvData.fullName,
          badgeFr: cvData.badgeFr,
          badgeEn: cvData.badgeEn,
          photo: cvData.photo,
          phone: cvData.phone,
          email: cvData.email,
          website: cvData.website,
          location: cvData.location,
          linkedInUrl: cvData.linkedInUrl,
          headlineFr: cvData.headlineFr,
          headlineEn: cvData.headlineEn,
          bioFr: cvData.bioFr,
          bioEn: cvData.bioEn,
          layout: cvData.layout,
          accentColor: cvData.accentColor || cvData.theme?.primary,
          showPhoto: cvData.showPhoto,
          theme: cvData.theme ?? undefined,
        },
      });
    } else {
      cv = await prisma.cV.create({
        data: {
          fullName: cvData.fullName,
          badgeFr: cvData.badgeFr,
          badgeEn: cvData.badgeEn,
          photo: cvData.photo,
          phone: cvData.phone,
          email: cvData.email,
          website: cvData.website,
          location: cvData.location,
          linkedInUrl: cvData.linkedInUrl,
          headlineFr: cvData.headlineFr,
          headlineEn: cvData.headlineEn,
          bioFr: cvData.bioFr,
          bioEn: cvData.bioEn,
          layout: cvData.layout || "creative",
          accentColor: cvData.accentColor || cvData.theme?.primary || defaultTheme.primary,
          showPhoto: cvData.showPhoto ?? true,
          theme: cvData.theme ?? defaultTheme,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      if (cv) {
        if (sections) {
          await tx.cVSection.deleteMany({ where: { cvId: cv.id } });
          for (const section of sections) {
            await tx.cVSection.create({
              data: {
                cvId: cv.id,
                type: section.type,
                placement: section.placement || "main",
                layoutType: section.layoutType || "list",
                color: section.color,
                icon: section.icon,
                order: section.order,
                isActive: section.isActive ?? true,
                translations: {
                  create: section.translations.map((t) => ({
                    locale: t.locale,
                    title: t.title || "",
                  })),
                },
                items: {
                  create: section.items?.map((item) => ({
                    startDate: item.startDate ? new Date(item.startDate) : null,
                    endDate: item.endDate ? new Date(item.endDate) : null,
                    isCurrent: item.isCurrent ?? false,
                    order: item.order,
                    isActive: item.isActive ?? true,
                    translations: {
                      create: item.translations.map((t) => ({
                        locale: t.locale,
                        title: t.title || "",
                        subtitle: t.subtitle,
                        location: t.location,
                        description: t.description,
                      })),
                    },
                  })),
                },
              },
            });
          }
        }

        if (skills) {
          await tx.cVSkill.deleteMany({ where: { cvId: cv.id } });
          for (const skill of skills) {
            await tx.cVSkill.create({
              data: {
                cvId: cv.id,
                category: skill.category,
                level: skill.level,
                showAsBar: skill.showAsBar ?? true,
                order: skill.order,
                isActive: skill.isActive ?? true,
                translations: {
                  create: skill.translations.map((t) => ({
                    locale: t.locale,
                    name: t.name || "",
                  })),
                },
              },
            });
          }
        }

        if (socialLinks) {
          await tx.cVSocialLink.deleteMany({ where: { cvId: cv.id } });
          for (const link of socialLinks) {
            await tx.cVSocialLink.create({
              data: {
                cvId: cv.id,
                platform: link.platform,
                url: link.url,
                label: link.label,
                order: link.order,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving CV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
