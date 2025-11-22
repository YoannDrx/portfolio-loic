"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database, FileText, FileJson, FileSpreadsheet, Loader2, Save, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { SocialMediaSettings } from "@/components/admin/settings/SocialMediaSettings";
import { ContentSettings } from "@/components/admin/settings/ContentSettings";
import { ProfileSettings } from "@/components/admin/settings/ProfileSettings";

interface SettingsContentProps {
  locale: string;
}

type ContentType = "albums" | "videos" | "services";
type ExportFormat = "csv" | "json" | "txt";

const DEBOUNCE_DELAY = 1000; // 1 seconde

export function SettingsContent({ locale }: SettingsContentProps) {
  const [settings, setSettings] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [exportingState, setExportingState] = useState<Record<string, boolean>>({});

  // Charger les settings et le user au montage
  useEffect(() => {
    loadSettings();
    loadUser();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings", {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur de chargement");

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paramètres",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const response = await fetch("/api/admin/profile/me", {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erreur lors du chargement du profil");
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Erreur chargement user:", error);
    }
  };

  // Debounced save
  const saveSettings = useCallback(
    async (newSettings: any) => {
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
        toast({
          title: "Sauvegardé ✓",
          description: "Les paramètres ont été mis à jour",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres",
        });
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // Gérer les changements avec debounce
  const handleChange = useCallback(
    (field: string, value: any) => {
      const newSettings = { ...settings, [field]: value };
      setSettings(newSettings);

      // Debounce save
      const timeoutId = setTimeout(() => {
        saveSettings(newSettings);
      }, DEBOUNCE_DELAY);

      return () => clearTimeout(timeoutId);
    },
    [settings, saveSettings]
  );

  // Export
  const handleExport = async (type: ContentType, format: ExportFormat) => {
    const key = `${type}-${format}`;
    setExportingState((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/admin/export?type=${type}&format=${format}`, {
        credentials: "include",
      });

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

      toast({
        title: "Export réussi ✓",
        description: `Les ${type} ont été exportés en ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
      });
    } finally {
      setExportingState((prev) => ({ ...prev, [key]: false }));
    }
  };

  const exportCards = [
    {
      type: "albums" as ContentType,
      title: "Albums",
      description: "Exporter tous les albums avec leurs métadonnées",
      icon: Database,
      color: "text-neon-cyan",
    },
    {
      type: "videos" as ContentType,
      title: "Vidéos",
      description: "Exporter toutes les vidéos et leurs informations",
      icon: Database,
      color: "text-neon-magenta",
    },
    {
      type: "services" as ContentType,
      title: "Services",
      description: "Exporter tous les services proposés",
      icon: Database,
      color: "text-neon-purple",
    },
  ];

  const formatButtons = [
    {
      format: "csv" as ExportFormat,
      label: "CSV",
      icon: FileSpreadsheet,
      description: "Format tableur",
    },
    {
      format: "json" as ExportFormat,
      label: "JSON",
      icon: FileJson,
      description: "Format structuré",
    },
    {
      format: "txt" as ExportFormat,
      label: "TXT",
      icon: FileText,
      description: "Texte lisible",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres et les exports de votre portfolio
          </p>
        </div>

        {/* Indicateur de sauvegarde */}
        <div className="flex items-center gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Sauvegarde...</span>
            </>
          ) : lastSaved ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Sauvegardé {lastSaved.toLocaleTimeString()}
              </span>
            </>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="social">Réseaux</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        {/* ONGLET PROFIL */}
        <TabsContent value="profile" className="space-y-6">
          {user ? (
            <ProfileSettings user={user} onUserUpdate={loadUser} />
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </TabsContent>

        {/* ONGLET GÉNÉRAL */}
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings settings={settings} onChange={handleChange} />
        </TabsContent>

        {/* ONGLET RÉSEAUX SOCIAUX */}
        <TabsContent value="social" className="space-y-6">
          <SocialMediaSettings settings={settings} onChange={handleChange} />
        </TabsContent>

        {/* ONGLET CONTENU */}
        <TabsContent value="content" className="space-y-6">
          <ContentSettings settings={settings} onChange={handleChange} />
        </TabsContent>

        {/* ONGLET EXPORT */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export de Données
              </CardTitle>
              <CardDescription>
                Téléchargez vos données dans différents formats pour backup ou analyse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {exportCards.map((card) => (
                <div key={card.type} className="rounded-lg border p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                        <h3 className="font-semibold text-lg">{card.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formatButtons.map((btn) => {
                      const key = `${card.type}-${btn.format}`;
                      const isLoading = exportingState[key];

                      return (
                        <Button
                          key={btn.format}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(card.type, btn.format)}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <btn.icon className="h-4 w-4" />
                          )}
                          {btn.label}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({btn.description})
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  À propos des formats d'export
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>CSV</strong> - Idéal pour Excel, Google Sheets, ou analyses de données
                  </li>
                  <li>
                    <strong>JSON</strong> - Format structuré pour développeurs et APIs
                  </li>
                  <li>
                    <strong>TXT</strong> - Texte brut lisible, parfait pour archivage
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
