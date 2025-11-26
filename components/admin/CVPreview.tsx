"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type ThemePalette = {
  primary?: string;
  secondary?: string;
  accent?: string;
  muted?: string;
  sidebar?: string;
  divider?: string;
  tagBg?: string;
  tagText?: string;
  gradientFrom?: string;
  gradientTo?: string;
};

type Profile = {
  photo?: string | null;
  name?: string | null;
  roleFr?: string | null;
  roleEn?: string | null;
  headlineFr?: string | null;
  headlineEn?: string | null;
};

type Section = {
  slug: string;
  titleEn?: string;
  titleFr?: string;
  type: string;
  entryType?: string;
  entryIds?: string[];
  order?: number;
  published?: boolean;
};

type Entry = {
  id?: string;
  type?: string;
  value?: number | null;
  [key: string]: unknown;
};

interface CVPreviewProps {
  profile: Profile;
  theme: ThemePalette;
  sections: Section[];
  entries: Entry[];
  locale: string;
}

const buildPalette = (theme: ThemePalette) => ({
  primary: theme?.primary || "#1bd99a",
  secondary: theme?.secondary || "#5dd6ff",
  accent: theme?.accent || "#ff6bd6",
  muted: theme?.muted || "#6b7280",
  sidebar: theme?.sidebar || "#f5f7fb",
  divider: theme?.divider || "#e5e7eb",
  tagBg: theme?.tagBg || "#eef2ff",
  tagText: theme?.tagText || "#0b1021",
  gradientFrom: theme?.gradientFrom || "#1bd99a",
  gradientTo: theme?.gradientTo || "#5dd6ff",
});

const resolveEntriesForSection = (section: Section, entries: Entry[]) => {
  if (!section) return [];
  if (section.entryIds && Array.isArray(section.entryIds) && section.entryIds.length > 0) {
    return entries.filter((e) => (e.id ? section.entryIds?.includes(e.id) : false));
  }
  if (section.entryType) {
    return entries.filter((e) => e.type === section.entryType);
  }
  return [];
};

export function CVPreview({ profile, theme, sections, entries, locale }: CVPreviewProps) {
  const isFr = locale === "fr";
  const palette = buildPalette(theme);
  const defaultSections = [
    { slug: "experience", titleEn: "Experience", titleFr: "Expérience", type: "TIMELINE", entryType: "EXPERIENCE", order: 1, published: true },
    { slug: "awards", titleEn: "Awards", titleFr: "Récompenses", type: "TIMELINE", entryType: "AWARD", order: 2, published: true },
    { slug: "skills", titleEn: "Skills", titleFr: "Compétences", type: "SKILL_BARS", entryType: "SKILL", order: 3, published: true },
    { slug: "clients", titleEn: "Clients & Sync", titleFr: "Clients & Sync", type: "TAG_CLOUD", entryType: "CLIENT", order: 4, published: true },
    { slug: "languages", titleEn: "Languages", titleFr: "Langues", type: "SIDEBAR_LIST", entryType: "LANGUAGE", order: 5, published: true },
    { slug: "interests", titleEn: "Interests", titleFr: "Centres d'intérêt", type: "TAG_CLOUD", entryType: "INTEREST", order: 6, published: true },
  ];

  const resolvedSections = (sections && sections.length > 0 ? sections : defaultSections).filter((s) => s.published !== false);
  const sortedSections = [...resolvedSections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const sidebarSections = sortedSections.filter((s) => ["SKILL_BARS", "TAG_CLOUD", "SIDEBAR_LIST"].includes(s.type));
  const timelineSections = sortedSections.filter((s) => s.type === "TIMELINE");

  const textFor = (entry: Entry, field: string) => {
    const localizedField = `${field}${isFr ? "Fr" : "En"}`;
    const val = entry?.[localizedField];
    const fallback = entry?.[`${field}En`];
    return (val as string) || (fallback as string) || "";
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
      <div
        className="rounded-xl border border-white/10 bg-white text-slate-900 shadow-lg overflow-hidden"
        style={{ aspectRatio: "1/1.414", minHeight: 600 }}
      >
        <div
          className="relative flex items-center gap-4 px-6 py-4"
          style={{
            background: `linear-gradient(120deg, ${palette.gradientFrom} 0%, ${palette.gradientTo} 100%)`,
          }}
        >
          <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
            <Image
              src={profile.photo || "/img/slider/loic-studio-front.jpg"}
              alt="Portrait"
              width={120}
              height={120}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1">
            <div className="text-white text-2xl font-black uppercase tracking-wide">{profile.name}</div>
            <div className="text-sm font-semibold text-white/90 tracking-[0.2em] mt-1">
              {isFr ? profile.roleFr || profile.roleEn : profile.roleEn || profile.roleFr}
            </div>
            {profile.headlineEn || profile.headlineFr ? (
              <p className="text-white/80 text-xs mt-2 max-w-2xl">
                {isFr ? profile.headlineFr || profile.headlineEn : profile.headlineEn || profile.headlineFr}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4">
          <aside
            className="col-span-1 rounded-lg p-3"
            style={{ backgroundColor: palette.sidebar, border: `1px solid ${palette.divider}` }}
          >
            {sidebarSections.map((section) => {
              const list = resolveEntriesForSection(section, entries);
              if (!list.length) return null;

              if (section.type === "SKILL_BARS") {
                return (
                  <div key={section.slug} className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-2">{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</h4>
                    <div className="space-y-2">
                      {list.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-800">
                            <span>{textFor(skill, "title")}</span>
                            {skill.value !== null && skill.value !== undefined && <span className="text-slate-500">{skill.value}%</span>}
                          </div>
                          {skill.value !== null && skill.value !== undefined && (
                            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${skill.value}%`, backgroundColor: palette.primary }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (section.type === "SIDEBAR_LIST") {
                return (
                  <div key={section.slug} className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-2">{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</h4>
                    <div className="space-y-2">
                      {list.map((item) => (
                        <div key={item.id}>
                          <div className="text-[11px] font-bold text-slate-900">{textFor(item, "title")}</div>
                          {textFor(item, "description") && <div className="text-[10px] text-slate-600">{textFor(item, "description")}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={section.slug} className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wide mb-2">{isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((item) => (
                      <span
                        key={item.id}
                        className="px-2 py-1 rounded border text-[10px] font-semibold"
                        style={{ backgroundColor: palette.tagBg, color: palette.tagText, borderColor: palette.divider }}
                      >
                        {textFor(item, "title")}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </aside>

          <div className="col-span-2 space-y-4">
            {timelineSections.map((section) => {
              const list = resolveEntriesForSection(section, entries);
              if (!list.length) return null;
              return (
                <div key={section.slug} className="relative pl-3">
                  <div
                    className="text-xs font-bold uppercase tracking-wide mb-2 inline-block"
                    style={{ borderBottom: `2px solid ${palette.primary}`, paddingBottom: 4 }}
                  >
                    {isFr ? section.titleFr || section.titleEn : section.titleEn || section.titleFr}
                  </div>
                  <div className={cn("absolute top-2 bottom-0 left-0 w-px", "bg-slate-200")} />
                  <div className="space-y-3">
                    {list.map((item) => (
                      <div key={item.id} className="pl-3 relative">
                        <span
                          className="absolute left-[-8px] top-1 h-3 w-3 rounded-full border-2 bg-white"
                          style={{ borderColor: palette.primary }}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-[12px] font-bold text-slate-900">{textFor(item, "title")}</div>
                          {textFor(item, "dateRange") && <div className="text-[10px] text-slate-500">{textFor(item, "dateRange")}</div>}
                        </div>
                        {textFor(item, "subtitle") && <div className="text-[10px] text-[color:var(--accent,inherit)] font-semibold" style={{ color: palette.accent }}>{textFor(item, "subtitle")}</div>}
                        {textFor(item, "description") && <p className="text-[10px] text-slate-700 leading-relaxed">{textFor(item, "description")}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
