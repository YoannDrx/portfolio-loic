import { prisma } from "@/lib/prisma";
import { CVBuilder } from "@/components/admin/CVBuilder";

type Section = {
  id?: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  type: string;
  entryType: string;
  entryIds?: string[];
  order?: number;
  published?: boolean;
};

export default async function ResumePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await promise;
    } catch {
      return fallback;
    }
  };

  const [entries, profile, theme, rawSections] = await Promise.all([
    safeFetch(prisma.resumeEntry.findMany({ orderBy: { order: "asc" } }), []),
    safeFetch(prisma.resumeProfile.findFirst(), null),
    safeFetch(prisma.resumeTheme.findFirst(), null),
    safeFetch(prisma.resumeSection.findMany({ orderBy: { order: "asc" } }), []),
  ]);

  // Transform sections to match expected type (handle null values)
  const sections: Section[] = rawSections.map((s) => ({
    id: s.id,
    slug: s.slug,
    titleEn: s.titleEn ?? "",
    titleFr: s.titleFr ?? "",
    type: s.type,
    entryType: s.entryType ?? "",
    entryIds: Array.isArray(s.entryIds) ? s.entryIds as string[] : undefined,
    order: s.order,
    published: s.published,
  }));

  const fallbackProfile = {
    name: "Loïc Ghanem",
    roleEn: "Music Composer & Producer",
    roleFr: "Compositeur & Producteur",
    headlineEn: "Hybrid scores and bold electronic textures for film, games, and brands.",
    headlineFr: "Partitions hybrides et textures électroniques pour films, jeux et marques.",
    email: "loic.ghanem@outlook.com",
    phone: "",
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

  return (
    <CVBuilder
      entries={entries}
      profile={profile ?? fallbackProfile}
      theme={theme ?? fallbackTheme}
      sections={sections}
      locale={locale}
    />
  );
}
