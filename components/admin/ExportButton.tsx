"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileJson, FileText, Sheet, Loader2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ExportType = "albums" | "videos" | "services";
type ExportFormat = "xlsx" | "csv" | "json" | "txt";

interface ExportButtonProps {
  type: ExportType;
  label?: string;
}

const formatOptions: {
  format: ExportFormat;
  label: string;
  icon: typeof Download;
  description: string;
}[] = [
  {
    format: "xlsx",
    label: "Excel (.xlsx)",
    icon: Sheet,
    description: "Fichier tableur",
  },
  {
    format: "csv",
    label: "CSV (.csv)",
    icon: FileSpreadsheet,
    description: "Valeurs séparées",
  },
  {
    format: "json",
    label: "JSON (.json)",
    icon: FileJson,
    description: "Données structurées",
  },
  {
    format: "txt",
    label: "Texte (.txt)",
    icon: FileText,
    description: "Texte formaté",
  },
];

const typeLabels: Record<ExportType, string> = {
  albums: "les albums",
  videos: "les vidéos",
  services: "les services",
};

export function ExportButton({ type, label = "Exporter" }: ExportButtonProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    try {
      const response = await fetch(`/api/admin/export?type=${type}&format=${format}`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erreur export");

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
        title: "Export réussi",
        description: `Export ${format.toUpperCase()} de ${typeLabels[type]} téléchargé`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible d'exporter ${typeLabels[type]}`,
      });
    } finally {
      setExporting(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200"
          disabled={exporting !== null}
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {label}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-neutral-900 border-white/10"
      >
        <DropdownMenuLabel className="text-xs text-neutral-400">
          Format d'export
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {formatOptions.map((option) => {
          const Icon = option.icon;
          const isLoading = exporting === option.format;

          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={exporting !== null}
              className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
            >
              <div className="flex items-center gap-3 w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-admin-accent" />
                ) : (
                  <Icon className="h-4 w-4 text-neutral-400" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm text-neutral-200">{option.label}</span>
                  <span className="text-xs text-neutral-500">{option.description}</span>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
