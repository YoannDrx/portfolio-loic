"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Pencil, Plus } from "lucide-react";
import { DeleteAlbumButton } from "@/components/admin/delete-album-button";

interface Album {
  id: string;
  img: string;
  title: string;
  date: string;
  style: string;
  published: boolean;
}

interface AlbumsListProps {
  albums: Album[];
  locale: string;
}

export function AlbumsList({ albums, locale }: AlbumsListProps) {
  const [search, setSearch] = useState("");

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Albums</h1>
          <p className="text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">
            Gérez vos albums photo ({albums.length} au total)
          </p>
        </div>
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

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-admin-text-tertiary dark:text-dark-admin-text-tertiary transition-colors duration-300" />
          <Input
            placeholder="Rechercher un album..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-lg border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary shadow-sm overflow-hidden transition-colors duration-300">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-admin-bg-secondary dark:bg-dark-admin-bg-tertiary z-10 border-b border-admin-border dark:border-dark-admin-border transition-colors duration-300">
              <TableRow className="hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary">
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Aperçu</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Titre</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Date</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Style</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Statut</TableHead>
                <TableHead className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlbums.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300"
                  >
                    Aucun album trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlbums.map((album) => (
                  <TableRow
                    key={album.id}
                    className="group hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary transition-colors duration-150 border-b border-admin-border-light dark:border-dark-admin-border-light last:border-b-0"
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
                      <span className="font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">{album.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-admin-text-secondary dark:text-dark-admin-text-secondary text-sm transition-colors duration-300">{album.date}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize border-admin-accent-500/30 dark:border-admin-accent-400/30 bg-admin-accent-50 dark:bg-admin-accent-900/20 text-admin-accent-500 dark:text-admin-accent-400 font-medium transition-colors duration-300">
                        {album.style}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {album.published ? (
                        <Badge className="bg-admin-success-500 dark:bg-admin-success-600 hover:bg-admin-success-600 dark:hover:bg-admin-success-700 text-white font-medium shadow-sm transition-colors duration-300">Publié</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700 font-medium transition-colors duration-300">Brouillon</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0 hover:bg-admin-primary-50 dark:hover:bg-admin-primary-900/20 hover:text-admin-primary-600 dark:hover:text-admin-primary-400 transition-all duration-200">
                          <Link href={`/${locale}/albums/${album.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="h-9 w-9 p-0 hover:bg-admin-accent-50 dark:hover:bg-admin-accent-900/20 hover:text-admin-accent-600 dark:hover:text-admin-accent-400 transition-all duration-200">
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">
        {filteredAlbums.length} résultat{filteredAlbums.length > 1 ? "s" : ""}
        {search && ` sur ${albums.length} au total`}
      </div>
    </div>
  );
}
