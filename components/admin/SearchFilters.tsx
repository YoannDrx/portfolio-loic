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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            placeholder="Search by title..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9 h-11 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-[var(--admin-neon-cyan)]/50 focus:ring-2 focus:ring-[var(--admin-neon-cyan)]/20 transition-all duration-200"
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`gap-2 h-11 px-4 border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200 ${
            showAdvanced ? "bg-[var(--admin-neon-cyan)]/10 border-[var(--admin-neon-cyan)]/30 text-[var(--admin-neon-cyan)]" : ""
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--admin-neon-cyan)] text-xs text-black font-bold">
              {[filters.search, filters.style, filters.published].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="gap-2 h-11 px-4 text-[var(--admin-neon-magenta)] hover:bg-[var(--admin-neon-magenta)]/10 hover:text-[var(--admin-neon-magenta)] transition-all duration-200"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid gap-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 md:grid-cols-4">
          {showStyleFilter && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--admin-neon-cyan)]">Style</label>
              <Select
                value={filters.style || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    style: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="bg-[var(--admin-bg)] border-white/10">
                  <SelectItem value="all">All</SelectItem>
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
            <label className="text-sm font-bold text-[var(--admin-neon-cyan)]">Status</label>
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
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--admin-bg)] border-white/10">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--admin-neon-cyan)]">Sort by</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--admin-bg)] border-white/10">
                <SelectItem value="sortedDate">Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--admin-neon-cyan)]">Order</label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortOrder: value as "asc" | "desc",
                })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[var(--admin-bg)] border-white/10">
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
