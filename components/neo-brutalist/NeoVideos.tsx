"use client";

import React, { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BrutalistButton } from './ui/BrutalistButton';

export interface Video {
  id: string;
  title: string;
  videoId: string;
  type: string;
  date?: string;
}

interface NeoVideosProps {
  videos: Video[];
}

export const NeoVideos: React.FC<NeoVideosProps> = ({ videos }) => {
  const t = useTranslations('home.sections');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const getYear = (video: Video) => {
    if (video.date) {
      const date = new Date(video.date);
      if (!isNaN(date.getTime())) {
        return date.getFullYear();
      }
    }
    return new Date().getFullYear();
  };

  return (
    <section id="videos" className="bg-neo-contrast-bg text-neo-contrast-text py-32">
      <div className="container mx-auto px-4 md:px-6">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-neo-accent pb-6">
            <div>
              <div className="font-mono font-bold text-neo-accent mb-2">SECT. 02 // {t('videosSection').toUpperCase()}</div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-neo-contrast-text">{t('videosTitle')}</h2>
            </div>
            <a
              href="https://www.youtube.com/@LoicGhanem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrutalistButton variant="primary" className="mb-2">{t('youtubeChannel')}</BrutalistButton>
            </a>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="group relative bg-white border-2 border-black hover:border-neo-accent transition-colors p-4 pb-8">
                 <div className="aspect-video bg-neutral-100 mb-6 relative overflow-hidden">
                    {playingVideoId === video.id ? (
                      <>
                        {/* YouTube Embed */}
                        <iframe
                          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          title={video.title}
                        />
                        {/* Close button */}
                        <button
                          onClick={() => setPlayingVideoId(null)}
                          className="absolute top-2 right-2 z-20 p-2 bg-black/80 text-white hover:bg-neo-accent hover:text-black transition-colors"
                          aria-label="Fermer la vidéo"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Thumbnail */}
                        <div
                          className="w-full h-full bg-neutral-200 bg-cover bg-center"
                          style={{ backgroundImage: `url(https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg)` }}
                        />
                        {/* Play button overlay */}
                        <button
                          onClick={() => setPlayingVideoId(video.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors cursor-pointer z-10"
                          aria-label={`Lire ${video.title}`}
                        >
                          <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center bg-black/50 group-hover:bg-neo-accent group-hover:border-neo-accent transition-all">
                            <Play size={28} className="text-white ml-1" fill="currentColor"/>
                          </div>
                        </button>
                      </>
                    )}
                 </div>
                 <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                       <div className="font-mono text-neo-accent text-xs mb-1">{video.type}</div>
                       <h3 className="text-2xl font-bold uppercase leading-tight mb-2 text-black">{video.title}</h3>
                       <a
                         href={`https://www.youtube.com/watch?v=${video.videoId}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-1 font-mono text-sm text-black/60 hover:text-neo-accent transition-colors"
                       >
                         <ExternalLink size={12} />
                         YouTube
                       </a>
                    </div>
                    <span className="font-mono text-xs border border-black/20 px-2 py-1 text-black/60 flex-shrink-0">
                      {getYear(video)}
                    </span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};
