"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, FileDown, Trash2, Calendar, Building2, GraduationCap, Briefcase, Star, Award, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResumeEntry {
  id: string;
  type: string;
  titleEn: string;
  titleFr: string;
  subtitleEn: string | null;
  dateRangeEn: string | null;
  published: boolean;
  order: number;
}

interface ResumeContentProps {
  initialEntries: ResumeEntry[];
  locale: string;
}

// Configuration des couleurs et icônes par type
const typeConfig: Record<string, { color: string; bgColor: string; borderColor: string; icon: ComponentType<{ className?: string }> }> = {
  EXPERIENCE: {
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: Briefcase
  },
  EDUCATION: {
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    icon: GraduationCap
  },
  SKILL: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: Star
  },
  LANGUAGE: {
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    icon: Building2
  },
  INTEREST: {
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: Star
  },
  KNOWLEDGE: {
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    icon: Building2
  },
  AWARD: {
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: Award
  },
  CLIENT: {
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    icon: Users
  },
};

export function ResumeContent({ initialEntries, locale }: ResumeContentProps) {
  const [entries, setEntries] = useState<ResumeEntry[]>(initialEntries);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) return;

    try {
      const res = await fetch(`/api/admin/resume/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setEntries(entries.filter((e) => e.id !== id));
      toast({ title: "Entrée supprimée avec succès" });
    } catch {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const downloadPDF = (lang: string) => {
    window.open(`/api/cv/download?locale=${lang}`, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-admin-primary-500 via-admin-accent-500 to-admin-primary-600 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-4xl font-bold tracking-tight mb-2">CV / Resume</h1>
            <p className="text-white/90 text-lg">
              Gérez vos entrées de CV et exportez-les en PDF
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => downloadPDF("fr")}
              className="gap-2 bg-[var(--glass-active)] hover:bg-foreground/10 text-white border-2 border-[var(--glass-border-strong)] backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <FileDown className="h-4 w-4" />
              PDF (FR)
            </Button>
            <Button
              onClick={() => downloadPDF("en")}
              className="gap-2 bg-[var(--glass-active)] hover:bg-foreground/10 text-white border-2 border-[var(--glass-border-strong)] backdrop-blur-sm transition-all duration-200 hover:scale-105"
            >
              <FileDown className="h-4 w-4" />
              PDF (EN)
            </Button>
            <Button
              asChild
              className="gap-2 bg-white hover:bg-white/90 text-admin-primary-600 shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Link href={`/${locale}/admin/resume/new`}>
                <Plus className="h-4 w-4" />
                Nouvelle entrée
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Grille de cartes */}
      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-gray-100 p-6">
              <FileDown className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground">Aucune entrée</h3>
            <p className="text-muted-foreground max-w-md">
              Commencez par créer votre première entrée de CV pour construire votre parcours professionnel.
            </p>
            <Button asChild className="mt-4 gap-2 bg-admin-primary-500 hover:bg-admin-primary-600">
              <Link href={`/${locale}/admin/resume/new`}>
                <Plus className="h-4 w-4" />
                Créer la première entrée
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {entries.map((entry) => {
            const config = typeConfig[entry.type] || typeConfig.EXPERIENCE;
            const Icon = config.icon;

            return (
              <div
                key={entry.id}
                className={`relative bg-white rounded-xl border-2 ${config.borderColor} shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group hover:-translate-y-1`}
              >
                {/* Header de la carte avec couleur */}
                <div className={`${config.bgColor} px-6 py-4 border-b-2 ${config.borderColor}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${config.bgColor} p-2 rounded-lg border-2 ${config.borderColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <Badge className={`${config.bgColor} ${config.color} border-2 ${config.borderColor} font-semibold px-3 py-1`}>
                        {entry.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.published ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
                          ✓ Publié
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-400 text-white border-0">
                          Brouillon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-6 space-y-4">
                  {/* Titres */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-admin-primary-600 transition-colors">
                      {entry.titleEn}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      🇫🇷 {entry.titleFr}
                    </p>
                  </div>

                  {/* Informations secondaires */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {entry.subtitleEn && (
                      <div className="flex items-center gap-2 text-foreground/75">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{entry.subtitleEn}</span>
                      </div>
                    )}
                    {entry.dateRangeEn && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{entry.dateRangeEn}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Button
                      asChild
                      className="flex-1 gap-2 bg-admin-primary-500 hover:bg-admin-primary-600 text-white transition-all duration-200"
                    >
                      <Link href={`/${locale}/admin/resume/${entry.id}`}>
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Link>
                    </Button>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      className="gap-2 bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>

                {/* Badge d'ordre */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-background text-foreground text-xs font-bold px-2 py-1 rounded border border-[var(--glass-border)]">
                    #{entry.order}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
