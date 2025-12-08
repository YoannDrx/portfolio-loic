"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import {
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  Settings,
  ChevronDown,
  Eye,
  RefreshCw,
  FileText,
  Palette,
  User,
  Briefcase,
  GraduationCap,
  X,
} from "lucide-react";
import { ColorPicker } from "@/components/admin/color-picker";
import { CVDocument } from "@/components/cv/pdf-document";
import { PDFDownloadButton } from "@/components/cv/pdf-download-button";
import type { CVData, CVTheme, CVSection, CVItem, CVTranslation } from "@/types/cv";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Neo-brutalist theme - single accent
const defaultTheme: CVTheme = {
  primary: "#F73604", // Orange-rouge (accent unique)
  secondary: "#F73604", // Même accent
  header: "#0B0C12", // Noir
  sidebar: "#F4F5F7", // Gris clair
  surface: "#FFFFFF", // Blanc
  text: "#0B0C12", // Noir
  muted: "#666666", // Gris
  border: "#0B0C12", // Bordure noire
  badge: "#F73604", // Même accent
};

// Palette de couleurs prédéfinies pour les sections
const SECTION_PALETTE = [
  { name: "Orange", hex: "#F73604" },
  { name: "Bleu", hex: "#0A66C2" },
  { name: "Vert", hex: "#00A67E" },
  { name: "Violet", hex: "#7C3AED" },
  { name: "Rose", hex: "#EC4899" },
  { name: "Cyan", hex: "#06B6D4" },
];

// Recommandations de couleurs par type de section
const SECTION_COLOR_RECOMMENDATIONS: Record<string, { hex: string; label: string }> = {
  experience: { hex: "#F73604", label: "Orange (recommandé)" },
  education: { hex: "#0A66C2", label: "Bleu (recommandé)" },
  awards: { hex: "#7C3AED", label: "Violet (recommandé)" },
  achievements: { hex: "#7C3AED", label: "Violet (recommandé)" },
  skills: { hex: "#00A67E", label: "Vert (recommandé)" },
  clients: { hex: "#0A66C2", label: "Bleu (recommandé)" },
  interests: { hex: "#00A67E", label: "Vert (recommandé)" },
  languages: { hex: "#EC4899", label: "Rose (recommandé)" },
  certifications: { hex: "#06B6D4", label: "Cyan (recommandé)" },
  custom: { hex: "#06B6D4", label: "Cyan (suggéré)" },
};

// Composant de sélection de couleur avec palette
function ColorPaletteSelector({
  value,
  onChange,
  sectionType,
}: {
  value: string;
  onChange: (color: string) => void;
  sectionType?: string;
}) {
  const [showCustom, setShowCustom] = useState(false);
  const isCustomColor = !SECTION_PALETTE.some((c) => c.hex.toLowerCase() === value.toLowerCase());

  // Récupérer la recommandation pour ce type de section
  const recommendation = sectionType ? SECTION_COLOR_RECOMMENDATIONS[sectionType] : null;
  const isRecommended = recommendation && value.toLowerCase() === recommendation.hex.toLowerCase();

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {SECTION_PALETTE.map((color) => {
          const isThisRecommended =
            recommendation && color.hex.toLowerCase() === recommendation.hex.toLowerCase();
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => {
                onChange(color.hex);
                setShowCustom(false);
              }}
              className={cn(
                "w-7 h-7 border-2 transition-all relative",
                value.toLowerCase() === color.hex.toLowerCase()
                  ? "border-neo-text scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                  : "border-neo-border hover:scale-105",
                isThisRecommended && "ring-2 ring-offset-1 ring-neo-text/30"
              )}
              style={{ backgroundColor: color.hex }}
              title={isThisRecommended ? `${color.name} - ${recommendation.label}` : color.name}
            >
              {isThisRecommended && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-neo-text rounded-full" />
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className={cn(
            "w-7 h-7 border-2 border-dashed flex items-center justify-center text-xs font-bold transition-all",
            showCustom || isCustomColor
              ? "border-neo-text bg-neo-bg"
              : "border-neo-border hover:border-neo-text"
          )}
          title="Personnalisé"
        >
          +
        </button>
      </div>
      {recommendation && !isRecommended && (
        <button
          type="button"
          onClick={() => {
            onChange(recommendation.hex);
            setShowCustom(false);
          }}
          className="text-[10px] font-mono text-neo-text/60 hover:text-neo-text flex items-center gap-1"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: recommendation.hex }} />
          {recommendation.label}
        </button>
      )}
      {(showCustom || isCustomColor) && <ColorPicker value={value} onChange={onChange} />}
    </div>
  );
}

const PDFViewerClient = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-neo-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-neo-border border-t-neo-accent animate-spin" />
        <span className="font-mono text-xs text-neo-text/60 uppercase">Chargement PDF...</span>
      </div>
    </div>
  ),
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
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [versions, setVersions] = useState<CVVersion[]>([]);
  const [versionName, setVersionName] = useState("");
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fabPosition, setFabPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, fabX: 0, fabY: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        fabX: fabPosition.x,
        fabY: fabPosition.y,
      };
      setIsDragging(true);
    },
    [fabPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const deltaX = dragStartRef.current.x - touch.clientX;
      const deltaY = dragStartRef.current.y - touch.clientY;
      const newX = Math.max(
        16,
        Math.min(window.innerWidth - 72, dragStartRef.current.fabX + deltaX)
      );
      const newY = Math.max(
        16,
        Math.min(window.innerHeight - 72, dragStartRef.current.fabY + deltaY)
      );
      setFabPosition({ x: newX, y: newY });
    },
    [isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

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
    } catch {
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
        body: JSON.stringify({ name: versionName.trim() || defaultName, data }),
      });
      if (!res.ok) throw new Error("Failed to save version");
      const created = (await res.json()) as CVVersion;
      setVersions((prev) => [created, ...prev]);
      setVersionName("");
      toast({ title: "Version enregistrée" });
    } catch {
      toast({ title: "Erreur lors de l'enregistrement", variant: "destructive" });
    } finally {
      setIsSavingVersion(false);
    }
  };

  const addSection = () => {
    // Attribuer une couleur de la palette en rotation
    const colorIndex = data.sections.length % SECTION_PALETTE.length;
    const newSection: CVSection = {
      type: "custom",
      placement: "main",
      layoutType: "list",
      order: data.sections.length,
      isActive: true,
      color: SECTION_PALETTE[colorIndex].hex,
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

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    field: keyof CVItem,
    value: unknown
  ) => {
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
    value: string
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
    newSections[sectionIndex].items = newSections[sectionIndex].items.filter(
      (_, i) => i !== itemIndex
    );
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
    } catch {
      toast({ title: "Erreur lors de la sauvegarde", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const getT = (arr: CVTranslation[], loc: string): CVTranslation =>
    arr.find((t) => t.locale === loc) ?? { locale: loc };

  const toggleSection = (idx: number) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Neo-brutalist button component
  const NeoButton = ({
    children,
    onClick,
    disabled,
    variant = "default",
    size = "default",
    className = "",
  }: {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant?: "default" | "accent" | "danger" | "ghost";
    size?: "default" | "sm" | "icon";
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-mono font-bold uppercase tracking-wide transition-all duration-200",
        "border-2 border-neo-border disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "default" &&
          "bg-neo-surface text-neo-text hover:bg-neo-bg-alt shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
        variant === "accent" &&
          "bg-neo-accent text-neo-text-inverse hover:brightness-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        variant === "danger" &&
          "bg-[#FF006E] text-white hover:brightness-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        variant === "ghost" &&
          "bg-transparent border-transparent hover:bg-neo-surface hover:border-neo-border",
        size === "default" && "px-4 py-2 text-xs",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "icon" && "w-8 h-8 flex items-center justify-center p-0",
        className
      )}
    >
      {children}
    </button>
  );

  // Neo-brutalist input component
  const NeoInput = ({
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    className?: string;
  }) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 bg-neo-surface border-2 border-neo-border",
        "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
        "focus:outline-none focus:border-neo-accent",
        "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        className
      )}
    />
  );

  // Neo-brutalist textarea component
  const NeoTextarea = ({
    value,
    onChange,
    placeholder,
    className = "",
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    className?: string;
  }) => (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 bg-neo-surface border-2 border-neo-border",
        "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
        "focus:outline-none focus:border-neo-accent",
        "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        "min-h-[80px] resize-y",
        className
      )}
    />
  );

  // Neo-brutalist select component
  const NeoSelect = ({
    value,
    onChange,
    options,
    className = "",
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    className?: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full px-3 py-2 bg-neo-surface border-2 border-neo-border",
        "text-neo-text font-mono text-sm",
        "focus:outline-none focus:border-neo-accent",
        "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        "cursor-pointer appearance-none",
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
        backgroundPosition: "right 0.5rem center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "1.5em 1.5em",
        paddingRight: "2.5rem",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  // Neo-brutalist collapsible card
  const NeoCollapsible = ({
    title,
    icon: Icon,
    isOpen,
    onToggle,
    accentColor,
    children,
  }: {
    title: string;
    icon: typeof Settings;
    isOpen: boolean;
    onToggle: () => void;
    accentColor?: string;
    children: React.ReactNode;
  }) => (
    <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-neo-surface transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center border-2 border-neo-border"
            style={{ backgroundColor: accentColor || "var(--neo-accent)" }}
          >
            <Icon className="h-5 w-5 text-neo-text" />
          </div>
          <span className="font-black text-neo-text uppercase tracking-tight">{title}</span>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 text-neo-text/60 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && <div className="border-t-2 border-neo-border p-4">{children}</div>}
    </div>
  );

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 min-h-0 lg:h-[calc(100vh-6rem)]">
      {/* Left Panel - Editor */}
      <div className="space-y-4 pb-8 lg:overflow-y-auto lg:pr-2 order-last lg:order-first">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between pb-4 border-b-4 border-neo-border">
          <div>
            <h1 className="text-2xl font-black text-neo-text uppercase tracking-tight">
              CV Editor
            </h1>
            <p className="text-xs font-mono text-neo-text/60 uppercase tracking-wider">
              Éditeur de curriculum vitae
            </p>
          </div>
          <NeoButton onClick={handleSave} disabled={isSaving} variant="accent">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "..." : "Sauvegarder"}
          </NeoButton>
        </div>

        {/* General Settings */}
        <NeoCollapsible
          title="Paramètres Généraux"
          icon={Settings}
          isOpen={settingsOpen}
          onToggle={() => setSettingsOpen(!settingsOpen)}
          accentColor="#F73604"
        >
          <div className="space-y-4">
            {/* Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neo-text/60 uppercase tracking-wider">
                  Nom complet
                </label>
                <NeoInput
                  value={data.fullName || ""}
                  onChange={(e) => updateGlobal("fullName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neo-text/60 uppercase tracking-wider">
                  Badge (FR)
                </label>
                <NeoInput
                  value={data.badgeFr || ""}
                  onChange={(e) => updateGlobal("badgeFr", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-neo-text/60 uppercase tracking-wider">
                  Badge (EN)
                </label>
                <NeoInput
                  value={data.badgeEn || ""}
                  onChange={(e) => updateGlobal("badgeEn", e.target.value)}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="border-t-2 border-neo-border pt-4">
              <h4 className="text-xs font-mono font-bold text-neo-text/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4" /> Couleurs du thème
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Accent principal</label>
                  <ColorPicker
                    value={data.theme?.primary || defaultTheme.primary}
                    onChange={(c) => updateTheme("primary", c)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Accent secondaire</label>
                  <ColorPicker
                    value={data.theme?.secondary || defaultTheme.secondary}
                    onChange={(c) => updateTheme("secondary", c)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Header</label>
                  <ColorPicker
                    value={data.theme?.header || defaultTheme.header}
                    onChange={(c) => updateTheme("header", c)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Sidebar</label>
                  <ColorPicker
                    value={data.theme?.sidebar || defaultTheme.sidebar}
                    onChange={(c) => updateTheme("sidebar", c)}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-t-2 border-neo-border pt-4">
              <h4 className="text-xs font-mono font-bold text-neo-text/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="h-4 w-4" /> Informations personnelles
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Titre (FR)</label>
                  <NeoInput
                    value={data.headlineFr || ""}
                    onChange={(e) => updateGlobal("headlineFr", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Titre (EN)</label>
                  <NeoInput
                    value={data.headlineEn || ""}
                    onChange={(e) => updateGlobal("headlineEn", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Bio (FR)</label>
                  <NeoTextarea
                    value={data.bioFr || ""}
                    onChange={(e) => updateGlobal("bioFr", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-neo-text/60">Bio (EN)</label>
                  <NeoTextarea
                    value={data.bioEn || ""}
                    onChange={(e) => updateGlobal("bioEn", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <NeoInput
                  value={data.email || ""}
                  onChange={(e) => updateGlobal("email", e.target.value)}
                  placeholder="Email"
                />
                <NeoInput
                  value={data.phone || ""}
                  onChange={(e) => updateGlobal("phone", e.target.value)}
                  placeholder="Téléphone"
                />
                <NeoInput
                  value={data.website || ""}
                  onChange={(e) => updateGlobal("website", e.target.value)}
                  placeholder="Site Web"
                />
                <NeoInput
                  value={data.location || ""}
                  onChange={(e) => updateGlobal("location", e.target.value)}
                  placeholder="Localisation"
                />
                <NeoInput
                  value={data.linkedInUrl || ""}
                  onChange={(e) => updateGlobal("linkedInUrl", e.target.value)}
                  placeholder="LinkedIn URL"
                  className="sm:col-span-2"
                />
                <NeoInput
                  value={data.photo || ""}
                  onChange={(e) => updateGlobal("photo", e.target.value)}
                  placeholder="Photo URL"
                  className="sm:col-span-2"
                />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={data.showPhoto}
                  onChange={(e) => updateGlobal("showPhoto", e.target.checked)}
                  className="w-4 h-4 border-2 border-neo-border"
                />
                <label className="text-sm font-mono text-neo-text">Afficher la photo</label>
              </div>
            </div>
          </div>
        </NeoCollapsible>

        {/* Sections */}
        <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
          <div className="flex items-center justify-between p-4 border-b-2 border-neo-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[#F73604] border-2 border-neo-border">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-black text-neo-text uppercase tracking-tight">Sections</span>
                <p className="text-xs font-mono text-neo-text/60">
                  {data.sections.length} sections
                </p>
              </div>
            </div>
            <NeoButton onClick={addSection} variant="accent" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </NeoButton>
          </div>

          <div className="p-4 space-y-3">
            {data.sections.map((section, sIndex) => {
              const isOpen = openSections[sIndex] ?? false;
              return (
                <div key={sIndex} className="border-2 border-neo-border bg-neo-surface">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSection(sIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") toggleSection(sIndex);
                    }}
                    className="w-full flex items-center justify-between p-3 hover:bg-neo-bg-alt transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3"
                        style={{ backgroundColor: section.color || "#D5FF0A" }}
                      />
                      <span className="font-bold text-neo-text uppercase text-sm">
                        {getT(section.translations, "fr").title || "Section"}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-neo-bg border border-neo-border text-neo-text/60 uppercase">
                        {section.placement || "main"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <NeoButton
                        size="icon"
                        variant="ghost"
                        onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                          e?.stopPropagation();
                          moveSection(sIndex, "up");
                        }}
                        disabled={sIndex === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </NeoButton>
                      <NeoButton
                        size="icon"
                        variant="ghost"
                        onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                          e?.stopPropagation();
                          moveSection(sIndex, "down");
                        }}
                        disabled={sIndex === data.sections.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </NeoButton>
                      <NeoButton
                        size="icon"
                        variant="ghost"
                        onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                          e?.stopPropagation();
                          removeSection(sIndex);
                        }}
                        className="text-[#FF006E] hover:text-[#FF006E]"
                      >
                        <Trash2 className="h-3 w-3" />
                      </NeoButton>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-neo-text/60 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 border-t-2 border-neo-border space-y-4">
                      {/* Section settings */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neo-text/60">Type</label>
                          <NeoSelect
                            value={section.type || "custom"}
                            onChange={(v) => updateSection(sIndex, "type", v)}
                            options={[
                              { value: "experience", label: "Expérience" },
                              { value: "education", label: "Formation" },
                              { value: "awards", label: "Prix" },
                              { value: "skills", label: "Compétences" },
                              { value: "clients", label: "Clients" },
                              { value: "interests", label: "Intérêts" },
                              { value: "languages", label: "Langues" },
                              { value: "certifications", label: "Certifications" },
                              { value: "custom", label: "Personnalisé" },
                            ]}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neo-text/60">Placement</label>
                          <NeoSelect
                            value={section.placement || "main"}
                            onChange={(v) => updateSection(sIndex, "placement", v)}
                            options={[
                              { value: "main", label: "Principal" },
                              { value: "sidebar", label: "Sidebar" },
                            ]}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neo-text/60">Style</label>
                          <NeoSelect
                            value={section.layoutType || "list"}
                            onChange={(v) => updateSection(sIndex, "layoutType", v)}
                            options={[
                              { value: "list", label: "Liste" },
                              { value: "timeline", label: "Timeline" },
                              { value: "grid", label: "Grille" },
                            ]}
                          />
                        </div>
                        <div className="space-y-1 col-span-2 sm:col-span-1">
                          <label className="text-xs font-mono text-neo-text/60">Couleur</label>
                          <ColorPaletteSelector
                            value={section.color || defaultTheme.primary}
                            onChange={(v) => updateSection(sIndex, "color", v)}
                            sectionType={section.type}
                          />
                        </div>
                      </div>

                      {/* Section titles */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neo-text/60">Titre (FR)</label>
                          <NeoInput
                            value={getT(section.translations, "fr").title ?? ""}
                            onChange={(e) => updateSectionTranslation(sIndex, "fr", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-mono text-neo-text/60">Titre (EN)</label>
                          <NeoInput
                            value={getT(section.translations, "en").title ?? ""}
                            onChange={(e) => updateSectionTranslation(sIndex, "en", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <div className="border-t-2 border-neo-border pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-neo-text/60 uppercase">
                            Éléments ({section.items?.length || 0})
                          </span>
                          <NeoButton size="sm" onClick={() => addItem(sIndex)}>
                            <Plus className="h-3 w-3 mr-1" /> Élément
                          </NeoButton>
                        </div>

                        {section.items?.map((item, iIndex) => (
                          <div
                            key={iIndex}
                            className="border-2 border-neo-border/50 bg-neo-bg p-3 mb-2"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 text-xs text-neo-text/60">
                                <input
                                  type="date"
                                  className="bg-neo-surface border border-neo-border px-2 py-1 text-neo-text text-xs"
                                  value={
                                    item.startDate
                                      ? new Date(item.startDate).toISOString().split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateItem(sIndex, iIndex, "startDate", e.target.value)
                                  }
                                />
                                <span>→</span>
                                <input
                                  type="date"
                                  className="bg-neo-surface border border-neo-border px-2 py-1 text-neo-text text-xs"
                                  value={
                                    item.endDate
                                      ? new Date(item.endDate).toISOString().split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateItem(sIndex, iIndex, "endDate", e.target.value)
                                  }
                                  disabled={item.isCurrent}
                                />
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.isCurrent}
                                    onChange={(e) =>
                                      updateItem(sIndex, iIndex, "isCurrent", e.target.checked)
                                    }
                                    className="w-3 h-3"
                                  />
                                  <span>Actuel</span>
                                </label>
                              </div>
                              <div className="flex gap-1">
                                <NeoButton
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => moveItem(sIndex, iIndex, "up")}
                                  disabled={iIndex === 0}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </NeoButton>
                                <NeoButton
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => moveItem(sIndex, iIndex, "down")}
                                  disabled={iIndex === section.items.length - 1}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </NeoButton>
                                <NeoButton
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeItem(sIndex, iIndex)}
                                  className="text-[#FF006E]"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </NeoButton>
                              </div>
                            </div>

                            {/* FR fields */}
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] px-2 py-0.5 bg-neo-accent text-neo-text-inverse font-bold uppercase">
                                  FR
                                </span>
                              </div>
                              <NeoInput
                                placeholder="Titre / Poste"
                                value={getT(item.translations, "fr").title ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "fr",
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoInput
                                placeholder="Sous-titre / Entreprise"
                                value={getT(item.translations, "fr").subtitle ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "fr",
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoInput
                                placeholder="Lieu"
                                value={getT(item.translations, "fr").location ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "fr",
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoTextarea
                                placeholder="Description"
                                value={getT(item.translations, "fr").description ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "fr",
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {/* EN fields */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] px-2 py-0.5 bg-[#FF006E] text-white font-bold uppercase">
                                  EN
                                </span>
                              </div>
                              <NeoInput
                                placeholder="Title / Position"
                                value={getT(item.translations, "en").title ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "en",
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoInput
                                placeholder="Subtitle / Company"
                                value={getT(item.translations, "en").subtitle ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "en",
                                    "subtitle",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoInput
                                placeholder="Location"
                                value={getT(item.translations, "en").location ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "en",
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                              <NeoTextarea
                                placeholder="Description"
                                value={getT(item.translations, "en").description ?? ""}
                                onChange={(e) =>
                                  updateItemTranslation(
                                    sIndex,
                                    iIndex,
                                    "en",
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {data.sections.length === 0 && (
              <p className="text-center text-neo-text/50 font-mono text-sm py-8">Aucune section</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <NeoCollapsible
          title="Compétences"
          icon={GraduationCap}
          isOpen={skillsOpen}
          onToggle={() => setSkillsOpen(!skillsOpen)}
          accentColor="#F73604"
        >
          <div className="space-y-3">
            <NeoButton onClick={addSkill} variant="accent" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Ajouter une compétence
            </NeoButton>

            {data.skills.map((skill, idx) => (
              <div key={skill.id || idx} className="border-2 border-neo-border bg-neo-surface p-3">
                <div className="flex items-center justify-between mb-3">
                  <NeoSelect
                    value={skill.category || "technical"}
                    onChange={(v) => updateSkill(idx, "category", v)}
                    options={[
                      { value: "technical", label: "Technique" },
                      { value: "software", label: "Logiciel" },
                      { value: "language", label: "Langue" },
                    ]}
                    className="w-32"
                  />
                  <div className="flex gap-1">
                    <NeoButton
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSkill(idx, "up")}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </NeoButton>
                    <NeoButton
                      size="icon"
                      variant="ghost"
                      onClick={() => moveSkill(idx, "down")}
                      disabled={idx === data.skills.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </NeoButton>
                    <NeoButton
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSkill(idx)}
                      className="text-[#FF006E]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </NeoButton>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neo-text/60">Nom (FR)</label>
                    <NeoInput
                      value={getSkillT(skill.translations || [], "fr").name || ""}
                      onChange={(e) => updateSkillTranslation(idx, "fr", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-neo-text/60">Name (EN)</label>
                    <NeoInput
                      value={getSkillT(skill.translations || [], "en").name || ""}
                      onChange={(e) => updateSkillTranslation(idx, "en", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-mono text-neo-text/60">Niveau</label>
                    <NeoSelect
                      value={String(skill.level || 3)}
                      onChange={(v) => updateSkill(idx, "level", Number(v))}
                      options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: String(n) }))}
                      className="w-16"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-mono text-neo-text/60 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skill.showAsBar ?? true}
                      onChange={(e) => updateSkill(idx, "showAsBar", e.target.checked)}
                      className="w-4 h-4"
                    />
                    Barre
                  </label>
                </div>
              </div>
            ))}

            {data.skills.length === 0 && (
              <p className="text-center text-neo-text/50 font-mono text-sm py-4">
                Aucune compétence
              </p>
            )}
          </div>
        </NeoCollapsible>

        {/* Versions */}
        <NeoCollapsible
          title="Versions"
          icon={FileText}
          isOpen={versionsOpen}
          onToggle={() => setVersionsOpen(!versionsOpen)}
          accentColor="#F73604"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <NeoInput
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="Nom de la version"
                className="flex-1"
              />
              <NeoButton onClick={handleSaveVersion} disabled={isSavingVersion} variant="accent">
                {isSavingVersion ? "..." : "Sauver"}
              </NeoButton>
              <NeoButton onClick={fetchVersions} disabled={isLoadingVersions} variant="ghost">
                <RefreshCw className={cn("h-4 w-4", isLoadingVersions && "animate-spin")} />
              </NeoButton>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between border-2 border-neo-border bg-neo-surface p-3"
                >
                  <div>
                    <div className="font-bold text-neo-text text-sm">{version.name}</div>
                    <div className="text-xs font-mono text-neo-text/60">
                      {new Date(version.createdAt).toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <NeoButton size="sm" onClick={() => setData(normalizeData(version.data))}>
                    Charger
                  </NeoButton>
                </div>
              ))}
              {versions.length === 0 && !isLoadingVersions && (
                <p className="text-neo-text/50 font-mono text-sm text-center py-4">
                  Aucune version
                </p>
              )}
            </div>
          </div>
        </NeoCollapsible>
      </div>

      {/* Right Panel - Preview (Desktop only) */}
      <div className="hidden lg:flex flex-col lg:h-full overflow-hidden">
        <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)] flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b-2 border-neo-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[#F73604] border-2 border-neo-border">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-neo-text uppercase tracking-tight">Preview PDF</span>
            </div>
            <div className="flex items-center gap-3">
              <PDFDownloadButton data={data} locale={previewLocale} />
              <div className="flex border-2 border-neo-border">
                <button
                  onClick={() => setPreviewLocale("fr")}
                  className={cn(
                    "px-4 py-2 font-mono text-xs font-bold uppercase",
                    previewLocale === "fr"
                      ? "bg-neo-accent text-neo-text-inverse"
                      : "bg-neo-surface text-neo-text"
                  )}
                >
                  FR
                </button>
                <button
                  onClick={() => setPreviewLocale("en")}
                  className={cn(
                    "px-4 py-2 font-mono text-xs font-bold uppercase border-l-2 border-neo-border",
                    previewLocale === "en"
                      ? "bg-neo-accent text-neo-text-inverse"
                      : "bg-neo-surface text-neo-text"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 bg-neo-surface/50">
            <PDFViewerClient
              width="100%"
              height="100%"
              className="border-none w-full h-full min-h-[300px]"
            >
              <CVDocument data={data} locale={previewLocale} />
            </PDFViewerClient>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      {mounted &&
        createPortal(
          <button
            ref={fabRef}
            onClick={() => !isDragging && setPreviewOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="lg:hidden h-14 w-14 flex items-center justify-center bg-neo-accent border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)] touch-none"
            style={{
              position: "fixed",
              right: fabPosition.x,
              bottom: fabPosition.y,
              zIndex: 9999,
            }}
          >
            <Eye className="h-6 w-6 text-neo-text-inverse" />
          </button>,
          document.body
        )}

      {/* Mobile Preview Dialog */}
      {previewOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-neo-bg flex flex-col lg:hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-neo-border">
              <button
                onClick={() => setPreviewOpen(false)}
                className="w-10 h-10 flex items-center justify-center border-2 border-neo-border bg-neo-surface"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="font-black text-neo-text uppercase">Preview</span>
              <div className="flex items-center gap-2">
                <PDFDownloadButton data={data} locale={previewLocale} iconOnly />
                <div className="flex border-2 border-neo-border">
                  <button
                    onClick={() => setPreviewLocale("fr")}
                    className={cn(
                      "px-3 py-1.5 font-mono text-xs font-bold",
                      previewLocale === "fr"
                        ? "bg-neo-accent text-neo-text-inverse"
                        : "bg-neo-surface"
                    )}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => setPreviewLocale("en")}
                    className={cn(
                      "px-3 py-1.5 font-mono text-xs font-bold border-l-2 border-neo-border",
                      previewLocale === "en"
                        ? "bg-neo-accent text-neo-text-inverse"
                        : "bg-neo-surface"
                    )}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-neo-surface/50">
              <PDFViewerClient width="100%" height="100%" className="border-none w-full h-full">
                <CVDocument data={data} locale={previewLocale} />
              </PDFViewerClient>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
