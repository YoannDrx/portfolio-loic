"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil } from "lucide-react";
import { DeleteAlbumButton } from "@/components/admin/delete-album-button";
import { SearchFilters, type FilterState } from "@/components/admin/SearchFilters";
import { Pagination } from "@/components/admin/Pagination";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { ExportButton } from "@/components/admin/ExportButton";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1 sm:mb-2 font-montserrat tracking-tight">
            Albums Library
          </h1>
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            Manage your photo albums / {total} total entries
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ExportButton type="albums" />
          <Button
            asChild
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-[var(--admin-neon-lime)] to-[var(--admin-neon-cyan)] text-black font-bold hover:shadow-[0_0_20px_rgba(213,255,10,0.4)] transition-all border-none"
          >
            <Link href={`/${locale}/admin/albums/new`}>
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </Button>
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
                className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-3"
              >
                <div className="flex gap-3">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                    <Image
                      src={album.img}
                      alt={album.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{album.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="capitalize border-[var(--admin-neon-lime)]/30 bg-[var(--admin-neon-lime)]/10 text-[var(--admin-neon-lime)] font-bold text-xs"
                      >
                        {album.style}
                      </Badge>
                      {album.published ? (
                        <span className="inline-flex items-center gap-1 text-xs text-neon-green">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                          Publié
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Brouillon</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{album.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[var(--glass-border-subtle)]">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-[var(--admin-neon-cyan)] hover:bg-[var(--admin-neon-cyan)]/10"
                  >
                    <Link
                      href={`/${locale}/albums/${album.id}${!album.published ? "?preview=true" : ""}`}
                      target="_blank"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10"
                  >
                    <Link href={`/${locale}/admin/albums/${album.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DeleteAlbumButton
                    albumId={album.id}
                    albumTitle={album.title}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table view */}
          <div className="hidden sm:block rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden">
            <div className="max-h-[calc(100vh-400px)] min-h-[200px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-[var(--glass-subtle)] backdrop-blur-md z-10 border-b border-[var(--glass-border)]">
                  <TableRow className="hover:bg-[var(--glass-subtle)] border-[var(--glass-border)]">
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Aperçu</TableHead>
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Titre</TableHead>
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Date</TableHead>
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Style</TableHead>
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Statut</TableHead>
                    <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {albums.map((album) => (
                    <TableRow
                      key={album.id}
                      className="group hover:bg-[var(--glass-subtle)] transition-colors duration-150 border-b border-[var(--glass-border-subtle)] last:border-b-0"
                    >
                      <TableCell>
                        <div className="relative h-14 w-24 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200 ring-1 ring-white/10">
                          <Image
                            src={album.img}
                            alt={album.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-foreground">{album.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-sm font-mono">{album.date}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize border-[var(--admin-neon-lime)]/30 bg-[var(--admin-neon-lime)]/10 text-[var(--admin-neon-lime)] font-bold"
                        >
                          {album.style}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {album.published ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-[var(--glass-subtle)] text-muted-foreground border border-[var(--glass-border)]">
                            Draft
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-[var(--admin-neon-cyan)] hover:bg-[var(--admin-neon-cyan)]/10 transition-all duration-200"
                          >
                            <Link
                              href={`/${locale}/albums/${album.id}${!album.published ? "?preview=true" : ""}`}
                              target="_blank"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10 transition-all duration-200"
                          >
                            <Link href={`/${locale}/admin/albums/${album.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteAlbumButton
                            albumId={album.id}
                            albumTitle={album.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
