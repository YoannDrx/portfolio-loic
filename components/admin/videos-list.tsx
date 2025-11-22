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
import { Search, Pencil, Plus } from "lucide-react";
import { DeleteVideoButton } from "@/components/admin/delete-video-button";

interface Video {
  id: string;
  title: string;
  type: string;
  img: string;
  date: string;
  published: boolean;
}

interface VideosListProps {
  videos: Video[];
  locale: string;
}

export function VideosList({ videos, locale }: VideosListProps) {
  const [search, setSearch] = useState("");

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vidéos</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez vos vidéos YouTube
          </p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/videos/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle vidéo
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher une vidéo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
              <TableRow>
                <TableHead>Aperçu</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    Aucune vidéo trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredVideos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                  <TableCell>
                    <div className="relative h-12 w-20 overflow-hidden rounded">
                      <Image
                        src={video.img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{video.title}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {video.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{video.date}</TableCell>
                  <TableCell>
                    {video.published ? (
                      <Badge className="bg-green-500">Publié</Badge>
                    ) : (
                      <Badge variant="secondary">Brouillon</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${locale}/admin/videos/${video.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteVideoButton
                        videoId={video.id}
                        videoTitle={video.title}
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
      <div className="text-sm text-gray-500">
        {filteredVideos.length} résultat{filteredVideos.length > 1 ? "s" : ""}
        {search && ` sur ${videos.length} au total`}
      </div>
    </div>
  );
}
