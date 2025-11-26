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
import { Plus, Eye, Pencil, Download } from "lucide-react";
import { DeleteAlbumButton } from "@/components/admin/delete-album-button";
import { SearchFilters, type FilterState } from "@/components/admin/SearchFilters";
import { Pagination } from "@/components/admin/Pagination";
import { TableSkeleton } from "@/components/admin/TableSkeleton";
import { EmptyState } from "@/components/admin/EmptyState";
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

  // Export CSV
  async function handleExport() {
    try {
      const response = await fetch("/api/admin/export?type=albums&format=csv", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Erreur export");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `albums-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();

      toast({
        title: "Export réussi ✓",
        description: "Les albums ont été exportés en CSV",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'exporter les albums",
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary">Albums</h1>
          <p className="text-admin-text-secondary">
            Gérez vos albums photo ({total} au total)
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 border-admin-border hover:bg-admin-bg-secondary hover:border-admin-primary-300 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-admin-primary-500 to-admin-accent-500 hover:from-admin-primary-600 hover:to-admin-accent-600 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link href={`/${locale}/admin/albums/new`}>
              <Plus className="h-4 w-4" />
              Nouvel album
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
          <div className="rounded-lg border border-admin-border bg-white shadow-sm overflow-hidden">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-admin-bg-secondary z-10 border-b border-admin-border">
                  <TableRow className="hover:bg-admin-bg-secondary">
                    <TableHead className="font-semibold text-admin-text-primary">Aperçu</TableHead>
                    <TableHead className="font-semibold text-admin-text-primary">Titre</TableHead>
                    <TableHead className="font-semibold text-admin-text-primary">Date</TableHead>
                    <TableHead className="font-semibold text-admin-text-primary">Style</TableHead>
                    <TableHead className="font-semibold text-admin-text-primary">Statut</TableHead>
                    <TableHead className="font-semibold text-admin-text-primary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {albums.map((album) => (
                    <TableRow
                      key={album.id}
                      className="group hover:bg-admin-bg-secondary transition-colors duration-150 border-b border-admin-border-light last:border-b-0"
                    >
                      <TableCell>
                        <div className="relative h-14 w-24 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
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
                        <span className="font-semibold text-admin-text-primary">{album.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-admin-text-secondary text-sm">{album.date}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize border-admin-accent-200 bg-admin-accent-50 text-admin-accent-700 font-medium"
                        >
                          {album.style}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {album.published ? (
                          <Badge className="bg-admin-success-500 hover:bg-admin-success-600 text-white font-medium shadow-sm">
                            Publié
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 border border-gray-200 font-medium"
                          >
                            Brouillon
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-9 w-9 p-0 hover:bg-admin-primary-50 hover:text-admin-primary-600 transition-all duration-200"
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
                            className="h-9 w-9 p-0 hover:bg-admin-accent-50 hover:text-admin-accent-600 transition-all duration-200"
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
