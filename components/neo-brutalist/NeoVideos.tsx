"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BrutalistButton } from './ui/BrutalistButton';

export interface Video {
  id: string;
  title: string;
  videoId: string;
  type: string;
}

interface NeoVideosProps {
  videos: Video[];
}

export const NeoVideos: React.FC<NeoVideosProps> = ({ videos }) => {
  const t = useTranslations('home.sections');

  return (
    <section id="videos" className="bg-neo-contrast-bg text-neo-contrast-text py-32">
      <div className="container mx-auto px-4 md:px-6">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-neo-accent pb-6">
            <div>
              <div className="font-mono font-bold text-neo-accent mb-2">SECT. 02 // {t('videosSection').toUpperCase()}</div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-neo-contrast-text">{t('videosTitle')}</h2>
            </div>
            <BrutalistButton variant="primary" className="mb-2">{t('youtubeChannel')}</BrutalistButton>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="group relative bg-white border-2 border-black hover:border-neo-accent transition-colors p-4 pb-8">
                 <div className="aspect-video bg-neutral-100 mb-6 relative overflow-hidden cursor-pointer">
                    {/* Thumbnail or Video Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                       <Play size={48} className="text-neo-accent" fill="currentColor"/>
                    </div>
                    {/* If we had an image, we'd show it here. For now, use a placeholder with the video ID logic if possible, or just text */}
                    <div
                      className="w-full h-full bg-neutral-200 flex items-center justify-center text-black/40 font-black text-4xl bg-cover bg-center"
                      style={{ backgroundImage: `url(https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg)` }}
                    >
                       {!video.videoId && "VIDEO"}
                    </div>
                 </div>
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="font-mono text-neo-accent text-xs mb-1">{video.type}</div>
                       <h3 className="text-2xl font-bold uppercase leading-tight mb-2 group-hover:underline decoration-neo-accent text-black">{video.title}</h3>
                       <p className="font-mono text-sm text-black/60">{t('officialVideo')}</p>
                    </div>
                    <span className="font-mono text-xs border border-black/20 px-2 py-1 text-black/60">2024</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};
