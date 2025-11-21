'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Video } from '@/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Play, Tag } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  OriginalMusic: { label: 'Original Music', color: 'neon-cyan' },
  Sync: { label: 'Sync Placement', color: 'neon-magenta' },
  MusicToPicture: { label: 'Music to Picture', color: 'neon-purple' },
};

export default function VideoCard({ video }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const typeInfo = typeLabels[video.type] || { label: video.type, color: 'neon-cyan' };

  return (
    <GlassCard variant="default" hover className="group h-full flex flex-col overflow-hidden">
      {/* Video Thumbnail / Player */}
      <div className="relative aspect-video w-full overflow-hidden bg-obsidian-200">
        {!isPlaying ? (
          <>
            {/* Thumbnail */}
            <Image
              src={video.img}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />

            {/* Play Button */}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group/play"
              aria-label="Play video"
            >
              <div className="w-16 h-16 rounded-full bg-neon-cyan/20 backdrop-blur-sm flex items-center justify-center border-2 border-neon-cyan group-hover/play:bg-neon-cyan/30 group-hover/play:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 text-neon-cyan fill-neon-cyan ml-1" />
              </div>
            </button>

            {/* Type Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 bg-${typeInfo.color}/20 backdrop-blur-sm rounded-full text-xs font-semibold text-${typeInfo.color} border border-${typeInfo.color}/30`}
                style={{
                  backgroundColor: `var(--tw-${typeInfo.color}-rgb, rgba(0, 240, 255, 0.2))`,
                  borderColor: `var(--tw-${typeInfo.color}-rgb, rgba(0, 240, 255, 0.3))`,
                }}
              >
                <Tag className="w-3 h-3" />
                {typeInfo.label}
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
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gradient-neon transition-all line-clamp-2">
          {video.title}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-auto">
          <Calendar className="w-4 h-4" />
          <span>{video.date}</span>
        </div>
      </div>
    </GlassCard>
  );
}
