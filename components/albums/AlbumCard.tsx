'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Disc, ExternalLink, Users } from 'lucide-react';

interface Album {
  id: string;
  title: string;
  img: string;
  poster: string;
  date: string;
  sortedDate: string;
  style: string;
  listenLink: string;
  collabName?: string;
  collabLink?: string;
  descriptions?: string;
}

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} className="block h-full">
      <GlassCard
        variant="default"
        hover
        className="group h-full flex flex-col overflow-hidden cursor-pointer border-white/5 hover:border-neon-purple/30"
      >
        {/* Album Cover */}
        <div className="relative aspect-square w-full overflow-hidden bg-obsidian-200">
          <Image
            src={album.img}
            alt={album.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
          
          {/* Hover Glow Effect */}
          <div className="absolute inset-0 bg-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

          {/* Listen Link Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-obsidian/80 backdrop-blur-md rounded-full border border-neon-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <ExternalLink className="w-3 h-3 text-neon-cyan" />
              <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">Listen</span>
            </div>
          </div>
        </div>

        {/* Album Info */}
        <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-obsidian/50 to-transparent">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient-neon transition-all line-clamp-2 font-montserrat uppercase tracking-wide leading-tight">
            {album.title}
          </h3>

          {/* Style Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neon-purple/10 rounded border border-neon-purple/20 text-xs font-bold text-neon-purple uppercase tracking-wider">
              <Disc className="w-3 h-3" />
              {album.style}
            </span>
          </div>

          {/* Metadata */}
          <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2">
             {/* Date */}
             <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
                <Calendar className="w-3 h-3 text-neon-magenta" />
                <span>{album.date}</span>
             </div>
             
             {/* Collaborators */}
             {album.collabName && (
                <div className="flex items-start gap-2 text-xs font-medium text-gray-400">
                   <Users className="w-3 h-3 flex-shrink-0 mt-0.5 text-neon-blue" />
                   <span className="line-clamp-1">{album.collabName}</span>
                </div>
             )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}