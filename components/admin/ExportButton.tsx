"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileJson, FileText, Sheet, Loader2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ExportType = "albums" | "videos" | "services";
type ExportFormat = "xlsx" | "csv" | "json" | "txt";

interface ExportButtonProps {
  type: ExportType;
  label?: string;
  iconOnly?: boolean;
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

export function ExportButton({ type, label = "Exporter", iconOnly = false }: ExportButtonProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    setIsOpen(false);
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting !== null}
        className={cn(
          "flex items-center gap-2",
          "border-2 border-neo-border bg-neo-surface",
          "text-neo-text font-mono text-sm",
          "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
          "hover:bg-neo-bg transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          iconOnly ? "h-10 w-10 justify-center" : "h-10 px-3"
        )}
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {!iconOnly && (
          <>
            <span className="hidden sm:inline font-bold uppercase">{label}</span>
            <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 right-0 mt-1 w-52 bg-neo-bg border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
          <div className="px-3 py-2 border-b-2 border-neo-border bg-neo-surface">
            <span className="font-mono text-xs font-bold text-neo-text/60 uppercase tracking-wider">
              Format d'export
            </span>
          </div>
          {formatOptions.map((option) => {
            const Icon = option.icon;
            const isLoading = exporting === option.format;

            return (
              <button
                key={option.format}
                type="button"
                onClick={() => handleExport(option.format)}
                disabled={exporting !== null}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2",
                  "hover:bg-neo-surface transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neo-accent" />
                ) : (
                  <Icon className="h-4 w-4 text-neo-text/60" />
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-bold text-neo-text">{option.label}</span>
                  <span className="text-xs font-mono text-neo-text/50">{option.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
