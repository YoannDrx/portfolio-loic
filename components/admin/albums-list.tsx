'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { DeleteAlbumButton } from '@/components/admin/delete-album-button';
import { GlassCard } from '@/components/ui/GlassCard';

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
  const [search, setSearch] = useState('');

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2 font-montserrat tracking-tight">
            Album Library
          </h2>
          <p className="text-gray-400 font-mono text-sm">
            Manage your discography / {albums.length} total entries
          </p>
        </div>
        <Link href={`/${locale}/admin/albums/new`}>
          <Button className="bg-gradient-to-r from-neon-lime to-neon-green text-obsidian font-bold hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all border-none">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <GlassCard variant="subtle" className="p-4 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white focus:border-neon-lime/50 focus:ring-neon-lime/20"
          />
        </div>
      </GlassCard>

      {/* Data Table */}
      <GlassCard variant="default" className="overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider">Preview</TableHead>
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider">Title</TableHead>
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider">Date</TableHead>
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider">Style</TableHead>
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider">Status</TableHead>
                <TableHead className="text-neon-cyan font-bold uppercase text-xs tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlbums.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No albums found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlbums.map((album) => (
                  <TableRow
                    key={album.id}
                    className="border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <TableCell>
                      <div className="relative h-12 w-12 rounded overflow-hidden border border-white/10 group-hover:border-neon-lime/50 transition-colors">
                        <Image
                          src={album.img}
                          alt={album.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-white">{album.title}</TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs">{album.date}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-bold bg-white/5 border border-white/10 text-neon-purple">
                        {album.style}
                      </span>
                    </TableCell>
                    <TableCell>
                      {album.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold bg-white/5 text-gray-500 border border-white/10">
                          Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10">
                          <Link href={`/${locale}/albums/${album.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-neon-lime hover:bg-neon-lime/10">
                          <Link href={`/${locale}/admin/albums/${album.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        {/* Wrap Delete button to style it if needed, or assume component handles it */}
                        <div className="text-gray-400 hover:text-red-500">
                           <DeleteAlbumButton albumId={album.id} albumTitle={album.title} />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
}