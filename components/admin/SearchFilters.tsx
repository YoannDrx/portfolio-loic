"use client";

import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface FilterState {
  search: string;
  style?: string;
  published?: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  styles?: Array<{ value: string; label: string }>;
  showStyleFilter?: boolean;
}

const STYLES = [
  { value: "film", label: "Film" },
  { value: "music-video", label: "Music Video" },
  { value: "concert", label: "Concert" },
  { value: "session", label: "Session" },
  { value: "other", label: "Autre" },
];

/* ============================================
   NEO SELECT COMPONENT
   ============================================ */

interface NeoSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

function NeoSelect({ value, onChange, options, placeholder = "Sélectionner..." }: NeoSelectProps) {
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

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 px-3 flex items-center justify-between",
          "bg-neo-surface border-2 border-neo-border",
          "text-neo-text font-mono text-sm",
          "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
          "hover:bg-neo-bg transition-colors",
          isOpen && "border-neo-accent"
        )}
      >
        <span className={!selectedOption ? "text-neo-text/50" : ""}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neo-bg border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left font-mono text-sm",
                "hover:bg-neo-surface transition-colors",
                value === option.value && "bg-neo-accent text-neo-text-inverse"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export function SearchFilters({
  filters,
  onFiltersChange,
  styles = STYLES,
  showStyleFilter = true,
}: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const hasActiveFilters = filters.search || filters.style || filters.published !== undefined;

  function resetFilters() {
    onFiltersChange({
      search: "",
      style: undefined,
      published: undefined,
      sortBy: "sortedDate",
      sortOrder: "desc",
    });
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche principale */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neo-text/40" />
          <input
            type="search"
            placeholder="Rechercher par titre..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className={cn(
              "w-full pl-10 pr-4 h-11",
              "bg-neo-surface border-2 border-neo-border",
              "text-neo-text placeholder-neo-text/40",
              "font-mono text-sm",
              "focus:outline-none focus:border-neo-accent",
              "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
              "transition-all duration-200"
            )}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            "flex items-center gap-2 h-11 px-4",
            "border-2 border-neo-border",
            "font-mono text-sm font-bold uppercase",
            "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
            "transition-all duration-200",
            showAdvanced
              ? "bg-neo-accent text-neo-text-inverse"
              : "bg-neo-surface text-neo-text hover:bg-neo-bg"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtres</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center bg-neo-text text-neo-bg text-xs font-bold">
              {[filters.search, filters.style, filters.published !== undefined].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className={cn(
              "flex items-center gap-2 h-11 px-4",
              "border-2 border-neo-border bg-red-500/10",
              "text-red-500 font-mono text-sm font-bold uppercase",
              "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
              "hover:bg-red-500 hover:text-white",
              "transition-all duration-200"
            )}
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid gap-4 p-5 border-2 border-neo-border bg-neo-surface shadow-[4px_4px_0px_0px_var(--neo-shadow)] md:grid-cols-4">
          {showStyleFilter && (
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-neo-accent uppercase tracking-wider">
                Style
              </label>
              <NeoSelect
                value={filters.style || "all"}
                onChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    style: value === "all" ? undefined : value,
                  })
                }
                options={[{ value: "all", label: "Tous" }, ...styles]}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neo-accent uppercase tracking-wider">
              Statut
            </label>
            <NeoSelect
              value={
                filters.published === undefined
                  ? "all"
                  : filters.published
                    ? "published"
                    : "draft"
              }
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  published:
                    value === "all"
                      ? undefined
                      : value === "published"
                        ? true
                        : false,
                })
              }
              options={[
                { value: "all", label: "Tous" },
                { value: "published", label: "Publié" },
                { value: "draft", label: "Brouillon" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neo-accent uppercase tracking-wider">
              Trier par
            </label>
            <NeoSelect
              value={filters.sortBy}
              onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
              options={[
                { value: "sortedDate", label: "Date" },
                { value: "title", label: "Titre" },
                { value: "order", label: "Ordre" },
                { value: "createdAt", label: "Création" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-neo-accent uppercase tracking-wider">
              Ordre
            </label>
            <NeoSelect
              value={filters.sortOrder}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortOrder: value as "asc" | "desc",
                })
              }
              options={[
                { value: "desc", label: "Décroissant" },
                { value: "asc", label: "Croissant" },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
