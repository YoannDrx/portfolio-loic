"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Database, FileText, FileJson, FileSpreadsheet, Sheet, Loader2, CheckCircle2, User, Settings, Share2, FileStack, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { SocialMediaSettings } from "@/components/admin/settings/SocialMediaSettings";
import { ContentSettings } from "@/components/admin/settings/ContentSettings";
import { ProfileSettings } from "@/components/admin/settings/ProfileSettings";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type ContentType = "albums" | "videos" | "services";
type ExportFormat = "csv" | "json" | "txt" | "xlsx";
type TabValue = "profile" | "general" | "social" | "content" | "export";

const DEBOUNCE_DELAY = 1000;

const tabs = [
  { value: "profile" as TabValue, label: "Profil", icon: User, color: "#00F0FF" },
  { value: "general" as TabValue, label: "Général", icon: Settings, color: "#D5FF0A" },
  { value: "social" as TabValue, label: "Social", icon: Share2, color: "#FF006E" },
  { value: "content" as TabValue, label: "Contenu", icon: FileStack, color: "#8B5CF6" },
  { value: "export" as TabValue, label: "Export", icon: Download, color: "#FF3300" },
];

export function SettingsContent() {
  const t = useTranslations("admin");
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabValue>(() => {
    const tabParam = searchParams.get("tab");
    return (tabParam as TabValue) || "profile";
  });
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [exportingState, setExportingState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSettings();
    loadUser();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabValue;
    if (tabParam && tabs.some(t => t.value === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", { credentials: "include" });
      if (!response.ok) throw new Error("Erreur de chargement");
      const data = await response.json();
      setSettings(data);
    } catch {
      toast({ variant: "destructive", title: t("common.error"), description: "Impossible de charger les paramètres" });
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const response = await fetch("/api/admin/profile/me", { credentials: "include" });
      if (!response.ok) {
        toast({ variant: "destructive", title: t("common.error"), description: "Impossible de charger le profil" });
        return;
      }
      const data = await response.json();
      setUser(data.user);
    } catch {
      toast({ variant: "destructive", title: t("common.error"), description: "Impossible de charger le profil" });
    }
  };

  const saveSettings = useCallback(
    async (newSettings: Record<string, unknown>) => {
      setSaving(true);
      try {
        const response = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSettings),
          credentials: "include",
        });
        if (!response.ok) throw new Error("Erreur de sauvegarde");
        setLastSaved(new Date());
        toast({ title: `${t("common.saved")}`, description: "Les paramètres ont été mis à jour" });
      } catch {
        toast({ variant: "destructive", title: t("common.error"), description: "Impossible de sauvegarder les paramètres" });
      } finally {
        setSaving(false);
      }
    },
    [t]
  );

  const handleChange = useCallback(
    (field: string, value: unknown) => {
      const newSettings = { ...settings, [field]: value };
      setSettings(newSettings);
      const timeoutId = setTimeout(() => { saveSettings(newSettings); }, DEBOUNCE_DELAY);
      return () => clearTimeout(timeoutId);
    },
    [settings, saveSettings]
  );

  const handleExport = async (type: ContentType, format: ExportFormat) => {
    const key = `${type}-${format}`;
    setExportingState((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await fetch(`/api/admin/export?type=${type}&format=${format}`, { credentials: "include" });
      if (!response.ok) throw new Error("Erreur lors de l'export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({ title: `${t("settings.export.success")}`, description: t("settings.export.successDesc", { type, format: format.toUpperCase() }) });
    } catch {
      toast({ variant: "destructive", title: t("settings.export.error"), description: "Impossible d'exporter les données" });
    } finally {
      setExportingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  const exportCards = [
    { type: "albums" as ContentType, title: "Albums", description: "Exporter tous les albums avec leurs métadonnées", icon: Database, color: "#00F0FF" },
    { type: "videos" as ContentType, title: "Vidéos", description: "Exporter toutes les vidéos et leurs informations", icon: Database, color: "#FF006E" },
    { type: "services" as ContentType, title: "Services", description: "Exporter tous les services proposés", icon: Database, color: "#8B5CF6" },
  ];

  const formatButtons = [
    { format: "xlsx" as ExportFormat, label: "Excel", icon: Sheet, description: ".xlsx" },
    { format: "csv" as ExportFormat, label: "CSV", icon: FileSpreadsheet, description: ".csv" },
    { format: "json" as ExportFormat, label: "JSON", icon: FileJson, description: ".json" },
    { format: "txt" as ExportFormat, label: "TXT", icon: FileText, description: ".txt" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neo-border border-t-neo-accent animate-spin" />
          <span className="font-mono text-sm text-neo-text/60 uppercase tracking-wider">Chargement...</span>
        </div>
      </div>
    );
  }

  const activeTabConfig = tabs.find(t => t.value === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-4 border-neo-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neo-text uppercase tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-neo-text/60 font-mono text-xs sm:text-sm uppercase tracking-wider">
            {t("settings.description")}
          </p>
        </div>

        {/* Save indicator */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2",
          "border-2 border-neo-border bg-neo-surface",
          "shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
        )}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-neo-accent" />
              <span className="text-xs font-mono text-neo-text/60 uppercase">{t("common.saving")}</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-[#00F0FF]" />
              <span className="text-xs font-mono text-neo-text/60 uppercase">
                {t("common.saved")} {lastSaved.toLocaleTimeString()}
              </span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 text-neo-text/40" />
              <span className="text-xs font-mono text-neo-text/40 uppercase">Auto-save actif</span>
            </>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-3",
                "font-mono text-sm font-bold uppercase tracking-wide",
                "border-2 border-neo-border",
                "transition-all duration-200",
                isActive
                  ? "bg-neo-text text-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)]"
                  : "bg-neo-surface text-neo-text hover:bg-neo-bg-alt hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
              )}
            >
              <Icon
                className="h-4 w-4"
                style={isActive ? { color: tab.color } : {}}
              />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className={cn(
        "border-2 border-neo-border bg-neo-bg",
        "shadow-[4px_4px_0px_0px_var(--neo-shadow)]"
      )}>
        {/* Tab Header */}
        <div
          className="px-6 py-4 border-b-2 border-neo-border"
          style={{ borderLeftWidth: 4, borderLeftColor: activeTabConfig?.color }}
        >
          <div className="flex items-center gap-3">
            {activeTabConfig && (
              <div
                className="w-10 h-10 flex items-center justify-center border-2 border-neo-border"
                style={{ backgroundColor: activeTabConfig.color }}
              >
                <activeTabConfig.icon className="h-5 w-5 text-neo-text" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-neo-text uppercase tracking-tight">
                {activeTabConfig?.label}
              </h2>
              <p className="text-xs font-mono text-neo-text/60 uppercase tracking-wider">
                Configurez vos préférences
              </p>
            </div>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === "profile" && (
            user ? (
              <ProfileSettings user={user} onUserUpdate={loadUser} />
            ) : (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-6 w-6 animate-spin text-neo-accent" />
              </div>
            )
          )}

          {activeTab === "general" && (
            <GeneralSettings settings={settings} onChange={handleChange} />
          )}

          {activeTab === "social" && (
            <SocialMediaSettings settings={settings as Record<string, string | undefined>} onChange={handleChange} />
          )}

          {activeTab === "content" && (
            <ContentSettings settings={settings} onChange={handleChange} />
          )}

          {activeTab === "export" && (
            <div className="space-y-6">
              {exportCards.map((card) => (
                <div
                  key={card.type}
                  className={cn(
                    "border-2 border-neo-border bg-neo-surface p-6",
                    "shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center border-2 border-neo-border"
                        style={{ backgroundColor: card.color }}
                      >
                        <card.icon className="h-5 w-5 text-neo-text" />
                      </div>
                      <div>
                        <h3 className="font-black text-neo-text uppercase tracking-tight">{card.title}</h3>
                        <p className="text-xs font-mono text-neo-text/60">{card.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formatButtons.map((btn) => {
                      const key = `${card.type}-${btn.format}`;
                      const isLoading = exportingState[key];

                      return (
                        <button
                          key={btn.format}
                          onClick={() => handleExport(card.type, btn.format)}
                          disabled={isLoading}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2",
                            "border-2 border-neo-border bg-neo-bg",
                            "font-mono text-xs font-bold uppercase",
                            "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                            "hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                            "hover:-translate-y-0.5",
                            "transition-all duration-200",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <btn.icon className="h-4 w-4" />
                          )}
                          <span>{btn.label}</span>
                          <span className="text-neo-text/40">{btn.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Info box */}
              <div className={cn(
                "border-2 border-neo-border bg-neo-bg-alt/50 p-4",
                "border-l-4 border-l-[#D5FF0A]"
              )}>
                <h4 className="font-bold text-neo-text uppercase tracking-tight mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t("settings.export.info.title")}
                </h4>
                <ul className="text-xs font-mono text-neo-text/70 space-y-1">
                  <li><strong>Excel (.xlsx)</strong> - Fichier tableur compatible Excel, Numbers, Google Sheets</li>
                  <li><strong>CSV</strong> - {t("settings.export.info.csv")}</li>
                  <li><strong>JSON</strong> - {t("settings.export.info.json")}</li>
                  <li><strong>TXT</strong> - {t("settings.export.info.txt")}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
