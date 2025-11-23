'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Video } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Play, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface VideoCardProps {
  video: Video;
}

const typeConfig: Record<string, { translationKey: string; color: string }> = {
  OriginalMusic: { translationKey: 'filterOriginalMusic', color: 'cyan' },
  Sync: { translationKey: 'filterSync', color: 'magenta' },
  MusicToPicture: { translationKey: 'filterMusicToPicture', color: 'purple' },
};

const colorClasses = {
  cyan: {
    badge: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    icon: 'text-neon-cyan',
    border: 'group-hover:border-neon-cyan/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
  },
  magenta: {
    badge: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
    icon: 'text-neon-magenta',
    border: 'group-hover:border-neon-magenta/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,0,110,0.3)]',
  },
  purple: {
    badge: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    icon: 'text-neon-purple',
    border: 'group-hover:border-neon-purple/50',
    glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
  },
};

export default function VideoCard({ video }: VideoCardProps) {
  const t = useTranslations('videos');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const config = typeConfig[video.type] || { translationKey: 'filterOriginalMusic', color: 'cyan' };
  const colors = colorClasses[config.color as keyof typeof colorClasses] || colorClasses.cyan;

  return (
    <GlassCard
      variant="default"
      hover
      triggerOnLoad
      className={`group h-full flex flex-col overflow-hidden border-white/5 ${colors.border} ${colors.glow}`}
    >
      {/* Video Thumbnail / Player */}
      <div className="relative aspect-video w-full overflow-hidden bg-obsidian-200">
        {!isPlaying ? (
          <>
            {/* Thumbnail */}
            <Image
              src={video.img}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group/play z-10"
              aria-label="Play video"
            >
              <div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover/play:bg-${config.color === 'cyan' ? 'neon-cyan' : config.color === 'magenta' ? 'neon-magenta' : 'neon-purple'}/80 group-hover/play:scale-110 transition-all duration-300 group-hover/play:border-transparent shadow-lg`}>
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </button>

            {/* Type Badge */}
            <div className="absolute top-4 right-4 z-10">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider border ${colors.badge}`}>
                <Tag className="w-3 h-3" />
                {t(config.translationKey)}
              </span>
            </div>
          </>
        ) : (
          /* YouTube Embed */
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>

      {/* Video Info */}
      <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-obsidian/50 to-transparent">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gradient-neon transition-all line-clamp-2 font-montserrat uppercase tracking-wide">
          {video.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest mt-auto">
          <Calendar className={`w-3 h-3 ${colors.icon}`} />
          <span>{video.date}</span>
        </div>
      </div>
    </GlassCard>
  );
}
