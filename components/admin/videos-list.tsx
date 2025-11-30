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
          <h1 className="text-3xl font-black text-white mb-2 font-montserrat tracking-tight">
            Video Library
          </h1>
          <p className="text-neutral-400 font-mono text-sm">
            Manage your video content / {videos.length} total entries
          </p>
        </div>
        <Button
          asChild
          className="gap-2 bg-gradient-to-r from-[var(--admin-neon-magenta)] to-[var(--admin-neon-purple)] text-white font-bold hover:shadow-[0_0_20px_rgba(255,0,110,0.4)] transition-all border-none"
        >
          <Link href={`/${locale}/admin/videos/new`}>
            <Plus className="h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white focus:border-[var(--admin-neon-magenta)]/50 focus:ring-[var(--admin-neon-magenta)]/20"
          />
        </div>
      </div>

      {/* Table with fixed height and scroll */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white/5 backdrop-blur-md z-10 border-b border-white/10 transition-colors duration-300">
              <TableRow className="hover:bg-white/5 border-white/10">
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Aperçu</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Titre</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Type</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Statut</TableHead>
                <TableHead className="font-bold text-[var(--admin-neon-cyan)] uppercase text-xs tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-neutral-500"
                  >
                    Aucune vidéo trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredVideos.map((video) => (
                  <TableRow
                    key={video.id}
                    className="group hover:bg-white/5 transition-colors duration-150 border-b border-white/5 last:border-b-0"
                  >
                  <TableCell>
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200">
                      <Image
                        src={video.img}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-white">{video.title}</span>
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
                    <span className="text-neutral-400 text-sm font-mono">{video.date}</span>
                  </TableCell>
                  <TableCell>
                    {video.published ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                        Publié
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-white/5 text-neutral-500 border border-white/10">
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
                        className="h-9 w-9 p-0 text-neutral-400 hover:text-[var(--admin-neon-lime)] hover:bg-[var(--admin-neon-lime)]/10 transition-all duration-200"
                      >
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
      <div className="text-sm text-neutral-500 font-mono">
        {filteredVideos.length} result{filteredVideos.length > 1 ? "s" : ""}
        {search && ` of ${videos.length} total`}
      </div>
    </div>
  );
}
