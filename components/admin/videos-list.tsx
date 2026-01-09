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
import { Search, Pencil, Plus, Video as VideoIcon } from "lucide-react";
import { DeleteVideoButton } from "@/components/admin/delete-video-button";
import { ExportButton } from "@/components/admin/ExportButton";

interface Video {
  id: string;
  title: string;
  type: string;
  img: string | null;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1 sm:mb-2 font-montserrat tracking-tight">
            Video Library
          </h1>
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">
            Manage your video content / {videos.length} total entries
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ExportButton type="videos" />
          <Button
            asChild
            size="sm"
            className="h-9 gap-2 bg-gradient-to-r from-[var(--admin-neon-magenta)] to-[var(--admin-neon-purple)] text-white font-bold hover:shadow-[0_0_20px_rgba(255,0,110,0.4)] transition-all border-none"
          >
            <Link href={`/${locale}/admin/videos/new`}>
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[var(--glass-subtle)] border-[var(--glass-border)] text-foreground focus:border-[var(--admin-neon-magenta)]/50 focus:ring-[var(--admin-neon-magenta)]/20"
          />
        </div>
      </div>

      {/* Mobile: Cards view */}
      <div className="sm:hidden space-y-3">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Aucune vidéo trouvée</div>
        ) : (
          filteredVideos.map((video) => (
            <div
              key={video.id}
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm p-3"
            >
              <div className="flex gap-3">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                  {video.img ? (
                    <Image src={video.img} alt="" fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <VideoIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm truncate">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="capitalize border-[var(--admin-neon-magenta)]/30 bg-[var(--admin-neon-magenta)]/10 text-[var(--admin-neon-magenta)] font-medium text-xs"
                    >
                      {video.type}
                    </Badge>
                    {video.published ? (
                      <span className="inline-flex items-center gap-1 text-xs text-neon-green">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                        Publié
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Brouillon</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{video.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-[var(--glass-border-subtle)]">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10"
                >
                  <Link href={`/${locale}/admin/videos/${video.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteVideoButton videoId={video.id} videoTitle={video.title} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table view */}
      <div className="hidden sm:block rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="max-h-[calc(100vh-400px)] min-h-[200px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-[var(--glass-subtle)] backdrop-blur-md z-10 border-b border-[var(--glass-border)] transition-colors duration-300">
              <TableRow className="hover:bg-[var(--glass-subtle)] border-[var(--glass-border)]">
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Aperçu
                </TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Titre
                </TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Type
                </TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Date
                </TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Statut
                </TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Aucune vidéo trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredVideos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="group hover:bg-[var(--glass-subtle)] transition-colors duration-150 border-b border-[var(--glass-border-subtle)] last:border-b-0"
                  >
                    <TableCell>
                      <div className="relative h-14 w-24 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        {video.img ? (
                          <Image
                            src={video.img}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <VideoIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-foreground">{video.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="capitalize border-[var(--admin-neon-magenta)]/30 bg-[var(--admin-neon-magenta)]/10 text-[var(--admin-neon-magenta)] font-medium"
                      >
                        {video.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm font-mono">{video.date}</span>
                    </TableCell>
                    <TableCell>
                      {video.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                          Publié
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-[var(--glass-subtle)] text-muted-foreground border border-[var(--glass-border)]">
                          Brouillon
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10 transition-all duration-200"
                        >
                          <Link href={`/${locale}/admin/videos/${video.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteVideoButton videoId={video.id} videoTitle={video.title} />
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
      <div className="text-sm text-muted-foreground font-mono">
        {filteredVideos.length} result{filteredVideos.length > 1 ? "s" : ""}
        {search && ` of ${videos.length} total`}
      </div>
    </div>
  );
}
