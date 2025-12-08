"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';

/* ============================================
   TYPES
   ============================================ */

export interface NeoColumn<T> {
  key: keyof T | "actions";
  label: string;
  render?: (value: T[keyof T] | null, item: T) => React.ReactNode;
}

interface NeoDataTableProps<T> {
  data: T[];
  columns: NeoColumn<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export function NeoDataTable<T extends { id: string }>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucun résultat trouvé.",
  pageSize = 10,
}: NeoDataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchKey || !search) return data;
    return data.filter((item) => {
      const value = item[searchKey];
      if (typeof value === "string") {
        return value.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    });
  }, [data, searchKey, search]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [search]);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neo-text/40" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              'w-full pl-10 pr-4 h-10',
              'bg-neo-surface border-2 border-neo-border',
              'text-neo-text placeholder-neo-text/40',
              'font-mono text-sm',
              'focus:outline-none focus:border-neo-accent',
              'shadow-[2px_2px_0px_0px_var(--neo-shadow)]'
            )}
          />
        </div>
      )}

      {/* Table Container */}
      <div className="border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b-2 border-neo-border bg-neo-surface">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-neo-text/60 font-mono"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={cn(
                      'border-b border-neo-border/50 transition-colors hover:bg-neo-surface',
                      index % 2 === 0 ? 'bg-neo-bg' : 'bg-neo-bg-alt/30'
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={`${item.id}-${String(column.key)}`}
                        className="px-4 py-3 text-sm text-neo-text font-mono"
                      >
                        {column.render
                          ? column.render(
                              column.key !== "actions"
                                ? item[column.key as keyof T]
                                : null,
                              item
                            )
                          : column.key !== "actions"
                            ? String(item[column.key as keyof T] || "")
                            : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs font-mono text-neo-text/60">
            Page {currentPage + 1} sur {totalPages} ({filteredData.length} éléments)
          </div>

          <div className="flex items-center gap-2">
            <NeoTableButton
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Précédent</span>
            </NeoTableButton>

            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum: number;

                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center',
                      'font-mono text-xs font-bold',
                      'border-2 border-neo-border',
                      'transition-all duration-200',
                      pageNum === currentPage
                        ? 'bg-neo-text text-neo-bg shadow-[2px_2px_0px_0px_var(--neo-shadow)]'
                        : 'bg-neo-bg text-neo-text hover:bg-neo-surface'
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <NeoTableButton
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <span className="hidden sm:inline">Suivant</span>
              <ChevronRight className="h-4 w-4" />
            </NeoTableButton>
          </div>
        </div>
      )}

      {/* Results count (when no pagination needed) */}
      {totalPages <= 1 && (
        <div className="text-xs font-mono text-neo-text/60">
          {filteredData.length} résultat{filteredData.length > 1 ? "s" : ""}
          {search && ` sur ${data.length} au total`}
        </div>
      )}
    </div>
  );
}

/* ============================================
   TABLE BUTTON COMPONENT
   ============================================ */

interface NeoTableButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function NeoTableButton({ children, onClick, disabled }: NeoTableButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1 px-3 py-2',
        'font-mono text-xs font-bold uppercase',
        'border-2 border-neo-border',
        'transition-all duration-200',
        disabled
          ? 'bg-neo-surface text-neo-text/30 cursor-not-allowed'
          : 'bg-neo-bg text-neo-text hover:bg-neo-surface shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]'
      )}
    >
      {children}
    </button>
  );
}

/* ============================================
   TABLE BADGE COMPONENT
   ============================================ */

interface NeoTableBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
}

export function NeoTableBadge({ children, variant = 'default' }: NeoTableBadgeProps) {
  const variantStyles = {
    default: 'bg-neo-surface text-neo-text border-neo-border',
    success: 'bg-green-500/10 text-green-500 border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
    danger: 'bg-red-500/10 text-red-500 border-red-500/30',
    accent: 'bg-neo-accent/10 text-neo-accent border-neo-accent/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'font-mono text-xs font-bold uppercase',
        'border',
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}

/* ============================================
   TABLE ACTION BUTTON
   ============================================ */

interface NeoTableActionProps {
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  label?: string;
}

export function NeoTableAction({ icon: Icon, onClick, variant = 'default', label }: NeoTableActionProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'w-8 h-8 flex items-center justify-center',
        'border-2 border-neo-border',
        'transition-all duration-200',
        'shadow-[1px_1px_0px_0px_var(--neo-shadow)]',
        'hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
        variant === 'danger'
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'
          : 'bg-neo-bg text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse'
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default NeoDataTable;
