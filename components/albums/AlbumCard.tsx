'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import type { Album } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Disc, ExternalLink, Users } from 'lucide-react';

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`}>
      <GlassCard
        variant="default"
        hover
        className="group h-full flex flex-col overflow-hidden cursor-pointer"
      >
        {/* Album Cover */}
        <div className="relative aspect-square w-full overflow-hidden bg-obsidian-200">
          <Image
            src={album.img}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Listen Link Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/20 backdrop-blur-sm rounded-full border border-neon-cyan/30">
              <ExternalLink className="w-3 h-3 text-neon-cyan" />
              <span className="text-xs font-semibold text-neon-cyan">Écouter</span>
            </div>
          </div>
        </div>

        {/* Album Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-neon transition-all line-clamp-2">
            {album.title}
          </h3>

          {/* Style Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neon-purple/20 rounded-full text-xs font-semibold text-neon-purple border border-neon-purple/30">
              <Disc className="w-3 h-3" />
              {album.style}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{album.date}</span>
          </div>

          {/* Collaborators */}
          {album.collabName && (
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-auto">
              <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{album.collabName}</span>
            </div>
          )}
        </div>
      </GlassCard>
    </Link>
  );
}
