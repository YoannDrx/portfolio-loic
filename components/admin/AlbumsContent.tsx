"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Eye, Pencil, Image as ImageIcon } from "lucide-react";
import { DeleteAlbumButton } from "@/components/admin/delete-album-button";
import { SearchFilters, type FilterState } from "@/components/admin/SearchFilters";
import { Pagination } from "@/components/admin/Pagination";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { ExportButton } from "@/components/admin/ExportButton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NeoAdminCard, NeoTableBadge } from "@/components/admin/neo";

interface Album {
  id: string;
  img: string;
  title: string;
  date: string;
  style: string;
  published: boolean;
}

interface AlbumsContentProps {
  initialAlbums: Album[];
  locale: string;
}

export function AlbumsContent({ initialAlbums, locale }: AlbumsContentProps) {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(initialAlbums.length);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track le premier chargement

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    style: undefined,
    published: undefined,
    sortBy: "sortedDate",
    sortOrder: "desc",
  });

  // Fetch albums avec filtres et pagination
  useEffect(() => {
    if (isInitialLoad) {
      // Premier render : on a déjà les données du serveur, pas besoin de fetch
      setIsInitialLoad(false);
      return;
    }

    // Toutes les fois suivantes : fetch avec les filtres/pagination
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        if (filters.search) params.append("search", filters.search);
        if (filters.style) params.append("style", filters.style);
        if (filters.published !== undefined) {
          params.append("published", filters.published.toString());
        }

        const response = await fetch(`/api/admin/albums?${params}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Erreur lors du chargement");

        const data = await response.json();
        setAlbums(data.items || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      } catch {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les albums",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [currentPage, filters, isInitialLoad]);

  // Reset page quand filtres changent
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-4 border-neo-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neo-text mb-1 sm:mb-2 uppercase tracking-tight">
            Albums Library
          </h1>
          <p className="text-neo-text/60 font-mono text-xs sm:text-sm uppercase tracking-wider">
            Gérez vos albums photos / {total} éléments
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ExportButton type="albums" />
          <Link
            href={`/${locale}/admin/albums/new`}
            className={cn(
              "flex items-center gap-2 h-10 px-4",
              "bg-neo-accent text-neo-text-inverse",
              "font-mono text-sm font-bold uppercase",
              "border-2 border-neo-border",
              "shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
              "hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)]",
              "hover:-translate-y-0.5",
              "transition-all duration-200"
            )}
          >
            <Plus className="h-4 w-4" />
            Nouveau
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Table ou états */}
      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : albums.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={filters.search || filters.style ? "Aucun résultat" : "Aucun album"}
          description={
            filters.search || filters.style
              ? "Essayez de modifier vos filtres"
              : "Créez votre premier album pour commencer"
          }
          action={
            !filters.search && !filters.style
              ? {
                  label: "Créer un album",
                  onClick: () => router.push(`/${locale}/admin/albums/new`),
                }
              : undefined
          }
        />
      ) : (
        <>
          {/* Mobile: Cards view */}
          <div className="sm:hidden space-y-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="border-2 border-neo-border bg-neo-surface p-3 shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden border-2 border-neo-border">
                    <Image
                      src={album.img}
                      alt={album.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neo-text text-sm truncate uppercase">{album.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <NeoTableBadge variant="accent">
                        {album.style}
                      </NeoTableBadge>
                      {album.published ? (
                        <NeoTableBadge variant="success">Publié</NeoTableBadge>
                      ) : (
                        <NeoTableBadge variant="default">Brouillon</NeoTableBadge>
                      )}
                    </div>
                    <p className="text-xs text-neo-text/60 font-mono mt-1">{album.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t-2 border-neo-border/50">
                  <Link
                    href={`/${locale}/albums/${album.id}${!album.published ? "?preview=true" : ""}`}
                    target="_blank"
                    className="w-8 h-8 flex items-center justify-center border-2 border-neo-border bg-neo-bg text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/admin/albums/${album.id}`}
                    className="w-8 h-8 flex items-center justify-center border-2 border-neo-border bg-neo-bg text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteAlbumButton
                    albumId={album.id}
                    albumTitle={album.title}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table view */}
          <div className="hidden sm:block border-2 border-neo-border bg-neo-bg shadow-[4px_4px_0px_0px_var(--neo-shadow)] overflow-hidden">
            <div className="max-h-[calc(100vh-400px)] min-h-[200px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-neo-surface border-b-2 border-neo-border z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Aperçu</th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Titre</th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Date</th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Style</th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Statut</th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-neo-text">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {albums.map((album, index) => (
                    <tr
                      key={album.id}
                      className={cn(
                        "group border-b border-neo-border/50 transition-colors hover:bg-neo-surface",
                        index % 2 === 0 ? "bg-neo-bg" : "bg-neo-bg-alt/30"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="relative h-14 w-24 overflow-hidden border-2 border-neo-border group-hover:border-neo-accent transition-colors">
                          <Image
                            src={album.img}
                            alt={album.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                            sizes="96px"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-neo-text uppercase">{album.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-neo-text/60 text-sm font-mono">{album.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <NeoTableBadge variant="accent">
                          {album.style}
                        </NeoTableBadge>
                      </td>
                      <td className="px-4 py-3">
                        {album.published ? (
                          <NeoTableBadge variant="success">Publié</NeoTableBadge>
                        ) : (
                          <NeoTableBadge variant="default">Brouillon</NeoTableBadge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/${locale}/albums/${album.id}${!album.published ? "?preview=true" : ""}`}
                            target="_blank"
                            className={cn(
                              "w-8 h-8 flex items-center justify-center",
                              "border-2 border-neo-border bg-neo-bg",
                              "text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse",
                              "shadow-[1px_1px_0px_0px_var(--neo-shadow)]",
                              "hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                              "transition-all duration-200"
                            )}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/${locale}/admin/albums/${album.id}`}
                            className={cn(
                              "w-8 h-8 flex items-center justify-center",
                              "border-2 border-neo-border bg-neo-bg",
                              "text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse",
                              "shadow-[1px_1px_0px_0px_var(--neo-shadow)]",
                              "hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                              "transition-all duration-200"
                            )}
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <DeleteAlbumButton
                            albumId={album.id}
                            albumTitle={album.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
