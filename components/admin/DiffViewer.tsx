"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Edit } from "lucide-react";

interface DiffItem {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  type: "added" | "removed" | "modified";
}

interface DiffViewerProps {
  changes: DiffItem[];
}

export function DiffViewer({ changes }: DiffViewerProps) {
  if (!changes || changes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Aucune modification enregistrée</p>
        </CardContent>
      </Card>
    );
  }

  function formatFieldName(field: string): string {
    const labels: Record<string, string> = {
      title: "Titre",
      img: "Image",
      poster: "Artiste / Poster",
      date: "Date",
      sortedDate: "Date de tri",
      style: "Style",
      listenLink: "Lien d'écoute",
      collabName: "Nom collaboration",
      collabLink: "Lien collaboration",
      descriptionsFr: "Description FR",
      descriptionsEn: "Description EN",
      published: "Statut publication",
      order: "Ordre",
      videoId: "ID Vidéo",
      type: "Type",
      no: "Numéro",
      text: "Texte court",
      largeImg: "Image large",
      largeTitle: "Titre large",
      author: "Auteur",
      fullDescription: "Description complète",
    };

    return labels[field] || field;
  }

  function formatValue(value: unknown): string {
    if (value === null || value === undefined) return "(vide)";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (typeof value === "string") {
      // Tronquer les longues chaînes (descriptions HTML)
      if (value.length > 200) {
        return `${value.substring(0, 200)}...`;
      }
      return value;
    }
    return String(value);
  }

  function getChangeIcon(type: DiffItem["type"]) {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4" />;
      case "removed":
        return <Minus className="h-4 w-4" />;
      case "modified":
        return <Edit className="h-4 w-4" />;
    }
  }

  function getChangeColor(type: DiffItem["type"]) {
    switch (type) {
      case "added":
        return "text-green-600 dark:text-green-400";
      case "removed":
        return "text-red-600 dark:text-red-400";
      case "modified":
        return "text-blue-600 dark:text-blue-400";
    }
  }

  function getBadgeVariant(type: DiffItem["type"]): "default" | "destructive" | "secondary" {
    switch (type) {
      case "added":
        return "default";
      case "removed":
        return "destructive";
      case "modified":
        return "secondary";
    }
  }

  function getTypeLabel(type: DiffItem["type"]): string {
    switch (type) {
      case "added":
        return "Ajouté";
      case "removed":
        return "Supprimé";
      case "modified":
        return "Modifié";
    }
  }

  return (
    <div className="space-y-3">
      {changes.map((change, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={getChangeColor(change.type)}>
                    {getChangeIcon(change.type)}
                  </span>
                  <span className="font-semibold">
                    {formatFieldName(change.field)}
                  </span>
                </div>
                <Badge variant={getBadgeVariant(change.type)}>
                  {getTypeLabel(change.type)}
                </Badge>
              </div>

              {/* Values */}
              <div className="grid gap-2">
                {change.type !== "added" && (
                  <div className="rounded bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-900">
                    <div className="text-xs text-red-700 dark:text-red-400 font-medium mb-1">
                      Ancienne valeur
                    </div>
                    <div className="text-sm font-mono break-all">
                      {formatValue(change.oldValue)}
                    </div>
                  </div>
                )}

                {change.type !== "removed" && (
                  <div className="rounded bg-green-50 dark:bg-green-950/20 p-3 border border-green-200 dark:border-green-900">
                    <div className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                      Nouvelle valeur
                    </div>
                    <div className="text-sm font-mono break-all">
                      {formatValue(change.newValue)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
