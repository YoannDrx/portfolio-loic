"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-tertiary" />
          <Input
            placeholder="Rechercher par titre..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 h-11 bg-white border-admin-border focus:border-admin-primary-300 focus:ring-2 focus:ring-admin-primary-100 transition-all duration-200"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`gap-2 h-11 px-4 border-admin-border hover:bg-admin-bg-secondary hover:border-admin-primary-300 transition-all duration-200 ${
            showAdvanced ? "bg-admin-primary-50 border-admin-primary-300 text-admin-primary-700" : ""
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-admin-primary-500 text-xs text-white font-medium shadow-sm">
              {[filters.search, filters.style, filters.published].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="gap-2 h-11 px-4 text-admin-danger-600 hover:bg-admin-danger-50 hover:text-admin-danger-700 transition-all duration-200"
          >
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid gap-4 rounded-lg border border-admin-border bg-white p-5 shadow-sm md:grid-cols-4">
          {showStyleFilter && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-admin-text-primary">Style</label>
              <Select
                value={filters.style || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    style: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  {styles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-admin-text-primary">Statut</label>
            <Select
              value={
                filters.published === undefined
                  ? "all"
                  : filters.published
                    ? "published"
                    : "draft"
              }
              onValueChange={(value) =>
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
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="published">Publié</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-admin-text-primary">Trier par</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sortedDate">Date</SelectItem>
                <SelectItem value="title">Titre</SelectItem>
                <SelectItem value="order">Ordre</SelectItem>
                <SelectItem value="createdAt">Création</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-admin-text-primary">Ordre</label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortOrder: value as "asc" | "desc",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Décroissant</SelectItem>
                <SelectItem value="asc">Croissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
