"use client";

import { useState, useEffect, useCallback } from "react";
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
      } catch (error) {
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
    } catch (error) {
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
          <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
          <p className="text-muted-foreground">
            Gérez vos albums photo ({total} au total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/albums/new`}>
              <Plus className="mr-2 h-4 w-4" />
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
          <div className="rounded-lg border">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Aperçu</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Style</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {albums.map((album) => (
                    <TableRow key={album.id}>
                      <TableCell>
                        <div className="relative h-12 w-20 overflow-hidden rounded">
                          <Image
                            src={album.img}
                            alt={album.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{album.title}</span>
                      </TableCell>
                      <TableCell>{album.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {album.style}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {album.published ? (
                          <Badge className="bg-green-500">Publié</Badge>
                        ) : (
                          <Badge variant="secondary">Brouillon</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/${locale}/albums/${album.id}${!album.published ? "?preview=true" : ""}`}
                              target="_blank"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
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
