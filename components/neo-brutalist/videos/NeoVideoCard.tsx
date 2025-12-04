"use client";

import React, { useState, useRef } from 'react';
import { Play, X, ExternalLink, Maximize2 } from 'lucide-react';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  type: string;
  date: string;
  img?: string | null;
}

interface NeoVideoCardProps {
  video: VideoItem;
}

export const NeoVideoCard: React.FC<NeoVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const thumbnailUrl = video.img || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <NeoCard
      variant="dark-ghost"
      hover="none"
      padding="md"
      className="hover:border-neo-accent transition-colors duration-300"
    >
      {/* Container Video/Thumbnail */}
      <div className="aspect-video bg-black relative overflow-hidden mb-6 border border-white/10">
        {isPlaying ? (
          // Iframe YouTube
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={video.title}
          />
        ) : (
          // Thumbnail avec bouton play
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 hover:opacity-50 transition-opacity duration-300"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={`Lire ${video.title}`}
            >
              <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center group-hover:bg-neo-accent group-hover:border-neo-accent transition-all duration-300">
                <Play
                  size={32}
                  fill="currentColor"
                  className="ml-1 text-white group-hover:text-black"
                />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        {isPlaying && (
          <>
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1.5 font-mono text-xs font-bold uppercase border border-white/30 hover:bg-neo-accent hover:text-black hover:border-neo-accent transition-colors flex items-center gap-1.5"
            >
              <X size={14} />
              Fermer
            </button>
            <button
              onClick={handleFullscreen}
              className="px-3 py-1.5 font-mono text-xs font-bold uppercase border border-white/30 hover:bg-neo-accent hover:text-black hover:border-neo-accent transition-colors flex items-center gap-1.5"
            >
              <Maximize2 size={14} />
              Plein écran
            </button>
          </>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 font-mono text-xs font-bold uppercase border border-white/30 hover:bg-neo-accent hover:text-black hover:border-neo-accent transition-colors flex items-center gap-1.5"
        >
          <ExternalLink size={14} />
          YouTube
        </a>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <NeoTag variant="accent" size="sm" className="mb-2">
            {video.type}
          </NeoTag>
          <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-white">
            {video.title}
          </h3>
        </div>
        <span className="font-mono text-xs opacity-50 border border-white/20 px-2 py-1 flex-shrink-0 text-white">
          {new Date(video.date).getFullYear()}
        </span>
      </div>
    </NeoCard>
  );
};

export default NeoVideoCard;
