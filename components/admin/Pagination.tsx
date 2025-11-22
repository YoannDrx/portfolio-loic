"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeft className="h-4 w-4" />
        Précédent
      </Button>

      {showPages.map((page, index) => {
        const prevPage = showPages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {showEllipsis && <span className="text-muted-foreground">...</span>}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page + 1}
            </Button>
          </div>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Suivant
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
