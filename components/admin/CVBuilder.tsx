"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { CVPreview } from "@/components/admin/CVPreview";
import { Plus, Save, Download, LayoutTemplate, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface CVBuilderProps {
  profile: any;
  theme: any;
  sections: any[];
  entries: any[];
  locale: string;
}

const defaultPalette = {
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

const defaultSections = [
  { slug: "experience", titleEn: "Experience", titleFr: "Expérience", type: "TIMELINE", entryType: "EXPERIENCE", order: 1, published: true },
  { slug: "awards", titleEn: "Awards", titleFr: "Récompenses", type: "TIMELINE", entryType: "AWARD", order: 2, published: true },
  { slug: "skills", titleEn: "Skills", titleFr: "Compétences", type: "SKILL_BARS", entryType: "SKILL", order: 3, published: true },
  { slug: "clients", titleEn: "Clients & Sync", titleFr: "Clients & Sync", type: "TAG_CLOUD", entryType: "CLIENT", order: 4, published: true },
  { slug: "languages", titleEn: "Languages", titleFr: "Langues", type: "SIDEBAR_LIST", entryType: "LANGUAGE", order: 5, published: true },
  { slug: "interests", titleEn: "Interests", titleFr: "Centres d'intérêt", type: "TAG_CLOUD", entryType: "INTEREST", order: 6, published: true },
];

export function CVBuilder({ profile, theme, sections, entries, locale }: CVBuilderProps) {
  const [profileState, setProfile] = useState(profile);
  const [themeState, setTheme] = useState({ ...defaultPalette, ...theme });
  const [sectionsState, setSections] = useState(
    (sections && sections.length > 0 ? sections : defaultSections).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingSections, setSavingSections] = useState(false);

  const downloadPDF = (lang: string) => {
    window.open(`/api/cv/download?locale=${lang}`, "_blank");
  };

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true);
      const res = await fetch("/api/admin/resume/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileState),
      });
      if (!res.ok) throw new Error("failed");
      toast({ title: "Profil mis à jour" });
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde du profil", variant: "destructive" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleThemeSave = async () => {
    try {
      setSavingTheme(true);
      const res = await fetch("/api/admin/resume/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(themeState),
      });
      if (!res.ok) throw new Error("failed");
      toast({ title: "Thème mis à jour" });
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde du thème", variant: "destructive" });
    } finally {
      setSavingTheme(false);
    }
  };

  const normalizeEntryIds = (value?: string) =>
    value
      ? value
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean)
      : [];

  const handleSaveSections = async () => {
    try {
      setSavingSections(true);
      const updated: any[] = [];
      for (const section of sectionsState) {
        const payload = {
          slug: section.slug,
          titleEn: section.titleEn,
          titleFr: section.titleFr,
          type: section.type,
          entryType: section.entryType,
          entryIds: section.entryIds,
          order: section.order ?? 0,
          published: section.published ?? true,
        };

        if (!section.id || section.id.toString().startsWith("temp-")) {
          const res = await fetch("/api/admin/resume/sections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("failed");
          const data = await res.json();
          updated.push(data);
        } else {
          const res = await fetch(`/api/admin/resume/sections/${section.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("failed");
          const data = await res.json();
          updated.push(data);
        }
      }
      setSections(updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      toast({ title: "Sections mises à jour" });
    } catch (error) {
      toast({ title: "Erreur lors de la sauvegarde des sections", variant: "destructive" });
    } finally {
      setSavingSections(false);
    }
  };

  const handleDeleteSection = async (id?: string) => {
    if (!id || id.toString().startsWith("temp-")) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      return;
    }
    if (!confirm("Supprimer cette section ?")) return;
    try {
      const res = await fetch(`/api/admin/resume/sections/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Section supprimée" });
    } catch (error) {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const addSection = () => {
    const nextOrder = (sectionsState[sectionsState.length - 1]?.order ?? 0) + 1;
    setSections((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        slug: `section-${prev.length + 1}`,
        titleEn: "New section",
        titleFr: "Nouvelle section",
        type: "TIMELINE",
        entryType: "EXPERIENCE",
        entryIds: [],
        order: nextOrder,
        published: true,
      },
    ]);
  };

  const moveSection = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= sectionsState.length) return;
    const copy = [...sectionsState];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    const reOrdered = copy.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(reOrdered);
  };

  const orderedEntries = useMemo(
    () => [...entries].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [entries]
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-admin-primary-500 via-admin-accent-500 to-admin-primary-600 rounded-2xl p-8 shadow-xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-white space-y-2">
            <div className="flex items-center gap-3">
              <LayoutTemplate className="h-6 w-6" />
              <h1 className="text-4xl font-bold tracking-tight">CV Builder</h1>
            </div>
            <p className="text-white/80 text-lg">
              Éditez le profil, la palette, les sections et prévisualisez le rendu avant export PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => downloadPDF("fr")}
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Download className="h-4 w-4" />
              PDF FR
            </Button>
            <Button
              onClick={() => downloadPDF("en")}
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Download className="h-4 w-4" />
              PDF EN
            </Button>
            <Button asChild className="gap-2 bg-white text-admin-primary-700 hover:bg-white/90">
              <Link href={`/${locale}/admin/resume/new`}>
                <Plus className="h-4 w-4" />
                Nouvelle entrée
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="space-y-6 xl:col-span-1">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Profil</h3>
              <NeonButton color="lime" onClick={handleProfileSave} disabled={savingProfile} className="px-4 py-2 text-sm">
                <Save className="h-4 w-4" />
                Sauvegarder
              </NeonButton>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Input
                value={profileState.name}
                onChange={(e) => setProfile({ ...profileState, name: e.target.value })}
                placeholder="Nom"
              />
              <Input
                value={profileState.roleFr}
                onChange={(e) => setProfile({ ...profileState, roleFr: e.target.value })}
                placeholder="Rôle (FR)"
              />
              <Input
                value={profileState.roleEn}
                onChange={(e) => setProfile({ ...profileState, roleEn: e.target.value })}
                placeholder="Role (EN)"
              />
              <Textarea
                value={profileState.headlineFr || ""}
                onChange={(e) => setProfile({ ...profileState, headlineFr: e.target.value })}
                placeholder="Pitch (FR)"
                className="min-h-[80px]"
              />
              <Textarea
                value={profileState.headlineEn || ""}
                onChange={(e) => setProfile({ ...profileState, headlineEn: e.target.value })}
                placeholder="Pitch (EN)"
                className="min-h-[80px]"
              />
              <Input
                value={profileState.email}
                onChange={(e) => setProfile({ ...profileState, email: e.target.value })}
                placeholder="Email"
              />
              <Input
                value={profileState.phone || ""}
                onChange={(e) => setProfile({ ...profileState, phone: e.target.value })}
                placeholder="Téléphone"
              />
              <Input
                value={profileState.location || ""}
                onChange={(e) => setProfile({ ...profileState, location: e.target.value })}
                placeholder="Localisation"
              />
              <Input
                value={profileState.website || ""}
                onChange={(e) => setProfile({ ...profileState, website: e.target.value })}
                placeholder="Site web"
              />
              <Input
                value={profileState.photo || ""}
                onChange={(e) => setProfile({ ...profileState, photo: e.target.value })}
                placeholder="URL de la photo (public/...)"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Thème</h3>
              <NeonButton color="cyan" onClick={handleThemeSave} disabled={savingTheme} className="px-4 py-2 text-sm">
                <Save className="h-4 w-4" />
                Sauvegarder
              </NeonButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(themeState).map(([key, value]) => {
                const isColor = key !== "fontHeadings" && key !== "fontBody";
                const stringValue = String(value ?? "");
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-xs text-white/70 uppercase tracking-wide">{key}</label>
                    {isColor ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={stringValue}
                          onChange={(e) => setTheme({ ...themeState, [key]: e.target.value })}
                          className="h-10 w-12 rounded-md border border-white/10 bg-obsidian"
                        />
                        <Input
                          value={stringValue}
                          onChange={(e) => setTheme({ ...themeState, [key]: e.target.value })}
                          className="bg-white/5 text-white"
                        />
                      </div>
                    ) : (
                      <Input
                        value={stringValue}
                        onChange={(e) => setTheme({ ...themeState, [key]: e.target.value })}
                        className="bg-white/5 text-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Sections et blocs</h3>
                <p className="text-sm text-white/60">Réorganisez les blocs, affectez des types et des sources d'entrées.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={addSection} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une section
                </Button>
                <NeonButton onClick={handleSaveSections} disabled={savingSections} className="px-4 py-2 text-sm">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </NeonButton>
              </div>
            </div>

            <div className="space-y-4">
              {sectionsState.map((section, idx) => (
                <div key={section.id} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white/60">#{section.order ?? idx + 1}</span>
                      <Input
                        value={section.slug}
                        onChange={(e) => {
                          const next = [...sectionsState];
                          next[idx] = { ...next[idx], slug: e.target.value };
                          setSections(next);
                        }}
                        className="max-w-[180px] bg-white/5 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => moveSection(idx, -1)}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => moveSection(idx, 1)}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteSection(section.id)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      value={section.titleFr || ""}
                      onChange={(e) => {
                        const next = [...sectionsState];
                        next[idx] = { ...next[idx], titleFr: e.target.value };
                        setSections(next);
                      }}
                      placeholder="Titre FR"
                      className="bg-white/5 text-white"
                    />
                    <Input
                      value={section.titleEn || ""}
                      onChange={(e) => {
                        const next = [...sectionsState];
                        next[idx] = { ...next[idx], titleEn: e.target.value };
                        setSections(next);
                      }}
                      placeholder="Title EN"
                      className="bg-white/5 text-white"
                    />
                    <select
                      value={section.type}
                      onChange={(e) => {
                        const next = [...sectionsState];
                        next[idx] = { ...next[idx], type: e.target.value };
                        setSections(next);
                      }}
                      className="bg-white/5 text-white rounded-md border border-white/10 h-10 px-3"
                    >
                      <option value="TIMELINE">Timeline (main)</option>
                      <option value="SKILL_BARS">Skills (sidebar)</option>
                      <option value="TAG_CLOUD">Tags (sidebar)</option>
                      <option value="SIDEBAR_LIST">Liste (sidebar)</option>
                    </select>
                    <Input
                      value={section.entryType || ""}
                      onChange={(e) => {
                        const next = [...sectionsState];
                        next[idx] = { ...next[idx], entryType: e.target.value };
                        setSections(next);
                      }}
                      placeholder="Type d'entrée (EXPERIENCE, AWARD...)"
                      className="bg-white/5 text-white"
                    />
                    <Input
                      value={(section.entryIds || []).join(", ")}
                      onChange={(e) => {
                        const next = [...sectionsState];
                        next[idx] = { ...next[idx], entryIds: normalizeEntryIds(e.target.value) };
                        setSections(next);
                      }}
                      placeholder="IDs d'entrées (optionnel, séparés par des virgules)"
                      className="bg-white/5 text-white col-span-2"
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/70">Publié</span>
                      <Checkbox
                        checked={section.published ?? true}
                        onCheckedChange={(checked) => {
                          const next = [...sectionsState];
                          next[idx] = { ...next[idx], published: Boolean(checked) };
                          setSections(next);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Entrées du CV</h3>
                <p className="text-sm text-white/60">Gérez les entrées avant de les placer dans les sections.</p>
              </div>
              <Button asChild className="gap-2 bg-admin-primary-500 hover:bg-admin-primary-600">
                <Link href={`/${locale}/admin/resume/new`}>
                  <Plus className="h-4 w-4" />
                  Nouvelle entrée
                </Link>
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {orderedEntries.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-white/60">{entry.type}</span>
                    <span className="text-[11px] text-white/60">#{entry.order}</span>
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">{entry.titleEn}</div>
                  <div className="text-xs text-white/60">{entry.subtitleEn}</div>
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/${locale}/admin/resume/${entry.id}`}
                      className="text-xs text-neon-cyan hover:text-white underline"
                    >
                      Modifier
                    </Link>
                    <span className="text-[10px] text-white/50">{entry.published ? "Publié" : "Brouillon"}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-4 border border-white/10">
            <CVPreview profile={profileState} theme={themeState} sections={sectionsState} entries={orderedEntries} locale={locale} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
