"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { PlusIcon, TrashIcon, SaveIcon, ArrowUpIcon, ArrowDownIcon, SettingsIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "@/components/admin/color-picker";
import { CVDocument } from "@/components/cv/pdf-document";
import { PDFDownloadButton } from "@/components/cv/pdf-download-button";
import type { CVData, CVTheme, CVSection, CVItem, CVTranslation } from "@/types/cv";
import { toast } from "@/hooks/use-toast";

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

const PDFViewerClient = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-[var(--glass-subtle)] text-foreground">Chargement du PDF...</div>,
});

const normalizeData = (input?: CVData | null): CVData => {
  const base: CVData = {
    sections: [],
    skills: [],
    socialLinks: [],
    accentColor: defaultTheme.primary,
    showPhoto: true,
    layout: "creative",
    fullName: "Loïc Ghanem",
    badgeFr: "Compositeur & producteur",
    badgeEn: "Composer & producer",
    ...(input ?? {}),
  };

  const mergedTheme: CVTheme = {
    ...defaultTheme,
    ...(base.theme || {}),
    primary: base.accentColor || base.theme?.primary || defaultTheme.primary,
  };

  base.theme = mergedTheme;
  base.accentColor = mergedTheme.primary;

  return base;
};

type CVVersion = {
  id: string;
  name: string;
  data: CVData;
  createdAt: string;
};

export function CVEditor({ initialData, locale }: { initialData: CVData | null; locale: string }) {
  const baseData: CVData = useMemo(() => normalizeData(initialData), [initialData]);

  const [data, setData] = useState<CVData>(baseData);
  const [isSaving, setIsSaving] = useState(false);
  const [previewLocale, setPreviewLocale] = useState(locale);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [versionName, setVersionName] = useState("");
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  const updateGlobal = (field: keyof CVData, value: unknown) => {
    setData({ ...data, [field]: value });
  };

  const updateTheme = (field: keyof CVTheme, value: string) => {
    const nextTheme: CVTheme = { ...defaultTheme, ...(data.theme || {}), [field]: value };
    const nextData: CVData = { ...data, theme: nextTheme };
    if (field === "primary") {
      nextData.accentColor = value;
    }
    setData(nextData);
  };

  const fetchVersions = async () => {
    setIsLoadingVersions(true);
    try {
      const res = await fetch("/api/cv/versions");
      if (!res.ok) throw new Error("Failed to load versions");
      const payload = (await res.json()) as CVVersion[];
      setVersions(payload);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({ title: "Impossible de charger les versions", variant: "destructive" });
    } finally {
      setIsLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleSaveVersion = async () => {
    setIsSavingVersion(true);
    const defaultName = `Version ${new Date().toLocaleString("fr-FR")}`;
    try {
      const res = await fetch("/api/cv/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: versionName.trim() || defaultName,
          data,
        }),
      });
      if (!res.ok) throw new Error("Failed to save version");
      const created = (await res.json()) as CVVersion;
      setVersions((prev) => [created, ...prev]);
      setVersionName("");
      toast({ title: "Version enregistrée" });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({ title: "Erreur lors de l'enregistrement de la version", variant: "destructive" });
    } finally {
      setIsSavingVersion(false);
    }
  };

  const addSection = () => {
    const newSection: CVSection = {
      type: "custom",
      placement: "main",
      layoutType: "list",
      order: data.sections.length,
      isActive: true,
      color: data.theme?.secondary || data.accentColor || defaultTheme.primary,
      icon: "Sparkles",
      translations: [
        { locale: "fr", title: "Nouvelle Section" },
        { locale: "en", title: "New Section" },
      ],
      items: [],
    };
    setData({ ...data, sections: [...data.sections, newSection] });
  };

  const updateSection = (index: number, field: keyof CVSection, value: unknown) => {
    const newSections = [...data.sections];
    // @ts-expect-error dynamic assignment
    newSections[index][field] = value;
    setData({ ...data, sections: newSections });
  };

  const updateSectionTranslation = (index: number, loc: string, value: string) => {
    const newSections = [...data.sections];
    const translations = [...newSections[index].translations];
    const tIndex = translations.findIndex((t) => t.locale === loc);
    if (tIndex >= 0) {
      translations[tIndex] = { ...translations[tIndex], title: value };
    } else {
      translations.push({ locale: loc, title: value });
    }
    newSections[index].translations = translations;
    setData({ ...data, sections: newSections });
  };

  const removeSection = (index: number) => {
    const newSections = data.sections.filter((_, i) => i !== index);
    setData({ ...data, sections: newSections });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === data.sections.length - 1) return;

    const newSections = [...data.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    newSections.forEach((s, i) => {
      s.order = i;
    });
    setData({ ...data, sections: newSections });
  };

  const addItem = (sectionIndex: number) => {
    const newSections = [...data.sections];
    const newItem: CVItem = {
      order: newSections[sectionIndex].items?.length ?? 0,
      isActive: true,
      isCurrent: false,
      translations: [
        { locale: "fr", title: "Nouveau Poste", subtitle: "", description: "", location: "" },
        { locale: "en", title: "New Position", subtitle: "", description: "", location: "" },
      ],
    };
    newSections[sectionIndex].items = [...(newSections[sectionIndex].items || []), newItem];
    setData({ ...data, sections: newSections });
  };

  const updateItem = (sectionIndex: number, itemIndex: number, field: keyof CVItem, value: unknown) => {
    const newSections = [...data.sections];
    const items = [...newSections[sectionIndex].items];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    newSections[sectionIndex].items = items;
    setData({ ...data, sections: newSections });
  };

  const updateItemTranslation = (
    sectionIndex: number,
    itemIndex: number,
    loc: string,
    field: keyof CVTranslation,
    value: string,
  ) => {
    const newSections = [...data.sections];
    const items = [...newSections[sectionIndex].items];
    const translations = [...items[itemIndex].translations];
    const tIndex = translations.findIndex((t) => t.locale === loc);

    if (tIndex >= 0) {
      translations[tIndex] = { ...translations[tIndex], [field]: value };
    } else {
      const newT: CVTranslation = { locale: loc };
      newT[field] = value;
      translations.push(newT);
    }

    items[itemIndex].translations = translations;
    newSections[sectionIndex].items = items;
    setData({ ...data, sections: newSections });
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...data.sections];
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
    setData({ ...data, sections: newSections });
  };

  const moveItem = (sectionIndex: number, itemIndex: number, direction: "up" | "down") => {
    const newSections = [...data.sections];
    const items = [...newSections[sectionIndex].items];
    if (direction === "up" && itemIndex === 0) return;
    if (direction === "down" && itemIndex === items.length - 1) return;
    const targetIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    [items[itemIndex], items[targetIndex]] = [items[targetIndex], items[itemIndex]];
    items.forEach((item, i) => {
      item.order = i;
    });
    newSections[sectionIndex].items = items;
    setData({ ...data, sections: newSections });
  };

  // === GESTION DES COMPÉTENCES ===
  const addSkill = () => {
    const newSkill = {
      id: `skill_${Date.now()}`,
      category: "technical" as const,
      level: 3,
      showAsBar: true,
      order: data.skills.length,
      isActive: true,
      translations: [
        { locale: "fr", name: "Nouvelle compétence" },
        { locale: "en", name: "New skill" },
      ],
    };
    setData({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkill = (index: number, field: string, value: unknown) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData({ ...data, skills: newSkills });
  };

  const updateSkillTranslation = (index: number, locale: string, name: string) => {
    const newSkills = [...data.skills];
    const translations = [...(newSkills[index].translations || [])];
    const tIndex = translations.findIndex((t) => t.locale === locale);
    if (tIndex >= 0) {
      translations[tIndex] = { ...translations[tIndex], name };
    } else {
      translations.push({ locale, name });
    }
    newSkills[index] = { ...newSkills[index], translations };
    setData({ ...data, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    setData({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const moveSkill = (index: number, direction: "up" | "down") => {
    const newSkills = [...data.skills];
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === newSkills.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSkills[index], newSkills[targetIndex]] = [newSkills[targetIndex], newSkills[index]];
    newSkills.forEach((skill, i) => {
      skill.order = i;
    });
    setData({ ...data, skills: newSkills });
  };

  const getSkillT = (translations: Array<{ locale: string; name?: string }>, loc: string) => {
    return translations?.find((t) => t.locale === loc) ?? { locale: loc, name: "" };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({ title: "CV sauvegardé" });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const getT = (arr: CVTranslation[], loc: string): CVTranslation => arr.find((t) => t.locale === loc) ?? { locale: loc };

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4 pb-8">
        <Card className="bg-card border-[var(--glass-border)]">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--glass-subtle)] transition-colors"
            onClick={() => setSettingsOpen(!settingsOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSettingsOpen(!settingsOpen); }}
          >
            <CardTitle className="text-foreground flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Paramètres Généraux
            </CardTitle>
            <ChevronDown className={`h-5 w-5 text-foreground/60 transition-transform ${settingsOpen ? "rotate-180" : ""}`} />
          </div>
          {settingsOpen && <CardContent className="space-y-4 pt-0 border-t border-[var(--glass-border)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Nom complet</Label>
                <Input
                  value={data.fullName || ""}
                  onChange={(e) => updateGlobal("fullName", e.target.value)}
                  className="bg-card border-[var(--glass-border)] text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Badge (FR)</Label>
                <Input
                  value={data.badgeFr || ""}
                  onChange={(e) => updateGlobal("badgeFr", e.target.value)}
                  className="bg-card border-[var(--glass-border)] text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Badge (EN)</Label>
                <Input
                  value={data.badgeEn || ""}
                  onChange={(e) => updateGlobal("badgeEn", e.target.value)}
                  className="bg-card border-[var(--glass-border)] text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Accent principal</Label>
                <ColorPicker value={data.theme?.primary || data.accentColor || defaultTheme.primary} onChange={(c) => updateTheme("primary", c)} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Accent secondaire</Label>
                <ColorPicker value={data.theme?.secondary || defaultTheme.secondary} onChange={(c) => updateTheme("secondary", c)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Fond du header</Label>
                <ColorPicker value={data.theme?.header || defaultTheme.header} onChange={(c) => updateTheme("header", c)} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Fond de la sidebar</Label>
                <ColorPicker value={data.theme?.sidebar || defaultTheme.sidebar} onChange={(c) => updateTheme("sidebar", c)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Couleur du texte</Label>
                <ColorPicker value={data.theme?.text || defaultTheme.text} onChange={(c) => updateTheme("text", c)} />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Séparateurs / contours</Label>
                <ColorPicker value={data.theme?.border || defaultTheme.border} onChange={(c) => updateTheme("border", c)} />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" checked={data.showPhoto} onChange={(e) => updateGlobal("showPhoto", e.target.checked)} className="w-4 h-4" />
              <Label className="text-foreground">Afficher la photo</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Titre (FR)</Label>
                <Input value={data.headlineFr || ""} onChange={(e) => updateGlobal("headlineFr", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Titre (EN)</Label>
                <Input value={data.headlineEn || ""} onChange={(e) => updateGlobal("headlineEn", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground/70">Bio (FR)</Label>
                <Textarea value={data.bioFr || ""} onChange={(e) => updateGlobal("bioFr", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground h-20" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground/70">Bio (EN)</Label>
                <Textarea value={data.bioEn || ""} onChange={(e) => updateGlobal("bioEn", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground h-20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--glass-border)]">
              <Input placeholder="Email" value={data.email || ""} onChange={(e) => updateGlobal("email", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              <Input placeholder="Téléphone" value={data.phone || ""} onChange={(e) => updateGlobal("phone", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              <Input placeholder="Site Web" value={data.website || ""} onChange={(e) => updateGlobal("website", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              <Input placeholder="Localisation" value={data.location || ""} onChange={(e) => updateGlobal("location", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground" />
              <Input placeholder="LinkedIn" value={data.linkedInUrl || ""} onChange={(e) => updateGlobal("linkedInUrl", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground col-span-2" />
              <Input placeholder="Photo (URL public/…)" value={data.photo || ""} onChange={(e) => updateGlobal("photo", e.target.value)} className="bg-card border-[var(--glass-border)] text-foreground col-span-2" />
            </div>
          </CardContent>}
        </Card>

        <Card className="bg-card border-[var(--glass-border)]">
          <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-[var(--glass-border)]">
            <CardTitle className="text-foreground">Sections</CardTitle>
            <Button onClick={handleSave} disabled={isSaving} className="bg-lime-300 text-black hover:bg-lime-400">
              <SaveIcon className="mr-2 h-4 w-4" />
              {isSaving ? "..." : "Sauvegarder"}
            </Button>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {data.sections.map((section, sIndex) => {
              const isOpen = openSections[sIndex] ?? true;
              return (
                <div key={sIndex} className="border border-[var(--glass-border)] rounded-lg px-4 bg-[var(--glass-subtle)]">
                  <div
                    className="flex w-full items-center justify-between py-3 cursor-pointer"
                    onClick={() => toggleSection(sIndex)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection(sIndex); }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-foreground">{getT(section.translations, "fr").title || "Nouvelle Section"}</span>
                      <span className="text-xs bg-[var(--glass-active)] px-2 py-1 rounded text-foreground/50 uppercase">{section.placement || "main"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); moveSection(sIndex, "up"); }} disabled={sIndex === 0}>
                        <ArrowUpIcon className="h-4 w-4 text-foreground/50" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); moveSection(sIndex, "down"); }} disabled={sIndex === data.sections.length - 1}>
                        <ArrowDownIcon className="h-4 w-4 text-foreground/50" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); removeSection(sIndex); }} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                      <ChevronDown className={`h-4 w-4 transition-transform text-foreground/60 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="space-y-6 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-md mb-4">
                        <div className="space-y-2">
                          <Label className="text-foreground/70">Placement</Label>
                          <Select value={section.placement || "main"} onValueChange={(v) => updateSection(sIndex, "placement", v)}>
                            <SelectTrigger className="bg-card border-[var(--glass-border)] text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">Principal (Main)</SelectItem>
                              <SelectItem value="sidebar">Latéral (Sidebar)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground/70">Style d'affichage</Label>
                          <Select value={section.layoutType || "list"} onValueChange={(v) => updateSection(sIndex, "layoutType", v)}>
                            <SelectTrigger className="bg-card border-[var(--glass-border)] text-foreground">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="list">Liste Simple</SelectItem>
                              <SelectItem value="timeline">Chronologie (Timeline)</SelectItem>
                              <SelectItem value="grid">Grille</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground/70">Couleur du bloc</Label>
                          <ColorPicker
                            value={section.color || data.theme?.secondary || data.accentColor || defaultTheme.primary}
                            onChange={(v) => updateSection(sIndex, "color", v)}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2 lg:col-span-3">
                          <Label className="text-foreground/70">Icône (nom Lucide, optionnel)</Label>
                          <Input
                            value={section.icon || ""}
                            onChange={(e) => updateSection(sIndex, "icon", e.target.value)}
                            placeholder="Briefcase, GraduationCap..."
                            className="bg-card border-[var(--glass-border)] text-foreground"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground/70">Titre (FR)</Label>
                          <Input
                            value={getT(section.translations, "fr").title ?? ""}
                            onChange={(e) => {
                              updateSectionTranslation(sIndex, "fr", e.target.value);
                            }}
                            className="bg-card border-[var(--glass-border)] text-foreground"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground/70">Titre (EN)</Label>
                          <Input
                            value={getT(section.translations, "en").title ?? ""}
                            onChange={(e) => {
                              updateSectionTranslation(sIndex, "en", e.target.value);
                            }}
                            className="bg-card border-[var(--glass-border)] text-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2">
                          <h4 className="text-sm font-medium text-foreground/70 uppercase">Éléments de contenu</h4>
                          <Button size="sm" variant="outline" onClick={() => addItem(sIndex)} className="border-[var(--glass-border-strong)] text-foreground hover:bg-[var(--glass-active)]">
                            <PlusIcon className="mr-2 h-3 w-3" /> Ajouter un élément
                          </Button>
                        </div>

                        {section.items?.map((item, iIndex) => (
                          <div key={iIndex} className="p-4 border border-[var(--glass-border)] rounded-md bg-muted/40 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="grid grid-cols-2 gap-2 text-xs text-foreground/50 w-full pr-4">
                                <div className="space-y-1">
                                  <span>Début</span>
                                  <input
                                    type="date"
                                    className="w-full bg-[var(--glass-subtle)] rounded border border-[var(--glass-border)] text-foreground p-1"
                                    value={item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : ""}
                                    onChange={(e) => {
                                      updateItem(sIndex, iIndex, "startDate", e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span>Fin</span>
                                  <input
                                    type="date"
                                    className="w-full bg-[var(--glass-subtle)] rounded border border-[var(--glass-border)] text-foreground p-1"
                                    value={item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : ""}
                                    onChange={(e) => {
                                      updateItem(sIndex, iIndex, "endDate", e.target.value);
                                    }}
                                    disabled={item.isCurrent}
                                  />
                                </div>
                                <div className="col-span-2 pt-2">
                                  <label className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                                    <input
                                      type="checkbox"
                                      checked={item.isCurrent}
                                      onChange={(e) => {
                                        updateItem(sIndex, iIndex, "isCurrent", e.target.checked);
                                      }}
                                      className="rounded border-[var(--glass-border-strong)] bg-[var(--glass-subtle)]"
                                    />
                                    En poste actuellement
                                  </label>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    moveItem(sIndex, iIndex, "up");
                                  }}
                                  disabled={iIndex === 0}
                                >
                                  <ArrowUpIcon className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    moveItem(sIndex, iIndex, "down");
                                  }}
                                  disabled={iIndex === section.items.length - 1}
                                >
                                  <ArrowDownIcon className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 text-red-400"
                                  onClick={() => {
                                    removeItem(sIndex, iIndex);
                                  }}
                                >
                                  <TrashIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <Tabs defaultValue="fr" className="w-full">
                              <TabsList className="bg-[var(--glass-active)] h-8 w-full justify-start">
                                <TabsTrigger value="fr" className="text-xs h-7 px-4">
                                  Français
                                </TabsTrigger>
                                <TabsTrigger value="en" className="text-xs h-7 px-4">
                                  English
                                </TabsTrigger>
                              </TabsList>
                              <TabsContent value="fr" className="space-y-3 mt-3">
                                <Input
                                  placeholder="Titre / Poste"
                                  value={getT(item.translations, "fr").title ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "fr", "title", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Input
                                  placeholder="Sous-titre / Entreprise"
                                  value={getT(item.translations, "fr").subtitle ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "fr", "subtitle", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Input
                                  placeholder="Lieu"
                                  value={getT(item.translations, "fr").location ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "fr", "location", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Textarea
                                  placeholder="Description"
                                  value={getT(item.translations, "fr").description ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "fr", "description", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground min-h-[80px]"
                                />
                              </TabsContent>
                              <TabsContent value="en" className="space-y-3 mt-3">
                                <Input
                                  placeholder="Title / Position"
                                  value={getT(item.translations, "en").title ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "en", "title", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Input
                                  placeholder="Subtitle / Company"
                                  value={getT(item.translations, "en").subtitle ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "en", "subtitle", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Input
                                  placeholder="Location"
                                  value={getT(item.translations, "en").location ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "en", "location", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground h-9"
                                />
                                <Textarea
                                  placeholder="Description"
                                  value={getT(item.translations, "en").description ?? ""}
                                  onChange={(e) => {
                                    updateItemTranslation(sIndex, iIndex, "en", "description", e.target.value);
                                  }}
                                  className="bg-card border-[var(--glass-border)] text-foreground min-h-[80px]"
                                />
                              </TabsContent>
                            </Tabs>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Button variant="outline" className="w-full border-dashed border-[var(--glass-border-strong)] hover:bg-[var(--glass-subtle)] text-foreground py-8 mt-4" onClick={addSection}>
              <PlusIcon className="mr-2 h-4 w-4" /> Ajouter une nouvelle section
            </Button>
          </CardContent>
        </Card>

        {/* CARD COMPÉTENCES */}
        <Card className="bg-card border-[var(--glass-border)]">
          <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-[var(--glass-border)]">
            <CardTitle className="text-foreground text-base">Compétences</CardTitle>
            <Button size="sm" onClick={addSkill} className="bg-lime-300 text-black hover:bg-lime-400">
              <PlusIcon className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {data.skills.map((skill, idx) => (
              <div key={skill.id || idx} className="border border-[var(--glass-border)] rounded-lg p-3 bg-[var(--glass-subtle)]">
                {/* Header avec catégorie et actions */}
                <div className="flex items-center justify-between mb-3">
                  <Select value={skill.category || "technical"} onValueChange={(v) => updateSkill(idx, "category", v)}>
                    <SelectTrigger className="w-32 h-8 bg-card border-[var(--glass-border)] text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technique</SelectItem>
                      <SelectItem value="software">Logiciel</SelectItem>
                      <SelectItem value="language">Langue</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => moveSkill(idx, "up")} disabled={idx === 0} className="h-8 w-8">
                      <ArrowUpIcon className="h-4 w-4 text-foreground/50" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveSkill(idx, "down")} disabled={idx === data.skills.length - 1} className="h-8 w-8">
                      <ArrowDownIcon className="h-4 w-4 text-foreground/50" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Traductions FR/EN */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="text-xs text-foreground/60">Nom (FR)</Label>
                    <Input
                      value={getSkillT(skill.translations || [], "fr").name || ""}
                      onChange={(e) => updateSkillTranslation(idx, "fr", e.target.value)}
                      className="h-8 bg-card border-[var(--glass-border)] text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-foreground/60">Name (EN)</Label>
                    <Input
                      value={getSkillT(skill.translations || [], "en").name || ""}
                      onChange={(e) => updateSkillTranslation(idx, "en", e.target.value)}
                      className="h-8 bg-card border-[var(--glass-border)] text-foreground"
                    />
                  </div>
                </div>

                {/* Niveau et options */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-foreground/60">Niveau</Label>
                    <Select value={String(skill.level || 3)} onValueChange={(v) => updateSkill(idx, "level", Number(v))}>
                      <SelectTrigger className="w-16 h-8 bg-card border-[var(--glass-border)] text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={skill.showAsBar ?? true}
                      onChange={(e) => updateSkill(idx, "showAsBar", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label className="text-xs text-foreground/60">Afficher barre</Label>
                  </div>
                </div>
              </div>
            ))}
            {data.skills.length === 0 && (
              <p className="text-foreground/50 text-sm text-center py-4">Aucune compétence</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-[var(--glass-border)]">
          <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-[var(--glass-border)]">
            <CardTitle className="text-foreground text-base">Versions du CV</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchVersions} disabled={isLoadingVersions} className="border-[var(--glass-border-strong)] text-foreground h-8">
                {isLoadingVersions ? "..." : "Rafraîchir"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nom de la version"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                className="bg-card border-[var(--glass-border)] text-foreground h-9"
              />
              <Button onClick={handleSaveVersion} disabled={isSavingVersion} size="sm" className="bg-lime-300 text-black hover:bg-lime-400 h-9 px-4">
                {isSavingVersion ? "..." : "Sauver"}
              </Button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {versions.map((version) => (
                <div key={version.id} className="flex items-center justify-between rounded-md border border-[var(--glass-border)] px-3 py-2 bg-[var(--glass-subtle)]">
                  <div>
                    <div className="text-foreground text-sm font-medium">{version.name}</div>
                    <div className="text-foreground/50 text-xs">{new Date(version.createdAt).toLocaleString("fr-FR")}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[var(--glass-border-strong)] text-foreground h-7 text-xs"
                    onClick={() => setData(normalizeData(version.data))}
                  >
                    Charger
                  </Button>
                </div>
              ))}
              {versions.length === 0 && !isLoadingVersions && (
                <p className="text-foreground/50 text-sm">Aucune version enregistrée.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="xl:sticky xl:top-4 xl:self-start xl:max-h-[calc(100vh-2rem)]">
        <Card className="bg-card border-[var(--glass-border)]">
          <CardHeader className="flex flex-row items-center justify-between py-4 bg-card z-20 border-b border-[var(--glass-border)]">
            <CardTitle className="text-foreground">Prévisualisation PDF</CardTitle>
            <div className="flex items-center gap-3">
              <PDFDownloadButton data={data} locale={previewLocale} />
              <Tabs value={previewLocale} onValueChange={setPreviewLocale}>
                <TabsList className="bg-[var(--glass-active)] border border-lime-400/50">
                  <TabsTrigger value="fr" className="data-[state=active]:bg-lime-400 data-[state=active]:text-black">FR</TabsTrigger>
                  <TabsTrigger value="en" className="data-[state=active]:bg-lime-400 data-[state=active]:text-black">EN</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-zinc-900/50">
            <PDFViewerClient width="100%" height={850} className="border-none w-full">
              <CVDocument data={data} locale={previewLocale} />
            </PDFViewerClient>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
