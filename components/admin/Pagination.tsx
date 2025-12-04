"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  const showPages = pages.filter((page) => {
    // Toujours montrer première, dernière, et 2 pages autour de la page actuelle
    return (
      page === 0 ||
      page === totalPages - 1 ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    );
  });

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          "flex items-center gap-1 px-3 py-2",
          "font-mono text-xs font-bold uppercase",
          "border-2 border-neo-border",
          "transition-all duration-200",
          currentPage === 0
            ? "bg-neo-surface text-neo-text/30 cursor-not-allowed"
            : "bg-neo-bg text-neo-text hover:bg-neo-surface shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Précédent</span>
      </button>

      <div className="flex items-center gap-1">
        {showPages.map((page, index) => {
          const prevPage = showPages[index - 1];
          const showEllipsis = prevPage !== undefined && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="text-neo-text/40 font-mono px-2">...</span>
              )}
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center",
                  "font-mono text-xs font-bold",
                  "border-2 border-neo-border",
                  "transition-all duration-200",
                  page === currentPage
                    ? "bg-neo-text text-neo-bg shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                    : "bg-neo-bg text-neo-text hover:bg-neo-surface"
                )}
              >
                {page + 1}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={cn(
          "flex items-center gap-1 px-3 py-2",
          "font-mono text-xs font-bold uppercase",
          "border-2 border-neo-border",
          "transition-all duration-200",
          currentPage === totalPages - 1
            ? "bg-neo-surface text-neo-text/30 cursor-not-allowed"
            : "bg-neo-bg text-neo-text hover:bg-neo-surface shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
        )}
      >
        <span className="hidden sm:inline">Suivant</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
