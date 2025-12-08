"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SectionHeader } from './ui/SectionHeader';

// Format date consistently to avoid hydration mismatch
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export interface Album {
  id: string;
  title: string;
  img: string | null;
  style: string | null;
  date: string;
  listenLink: string | null;
}

interface NeoAlbumsProps {
  albums: Album[];
}

export const NeoAlbums: React.FC<NeoAlbumsProps> = ({ albums }) => {
  const t = useTranslations('home.sections');

  return (
    <section id="albums" className="container mx-auto px-4 md:px-6 py-32">
      <SectionHeader number="01" title={t('albumsTitle')} subtitle={t('albumsSection')} />

      <div className="border-t-4 border-neo-border">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative border-b-2 border-neo-border bg-neo-surface hover:bg-neo-text hover:text-neo-accent transition-colors duration-300 cursor-pointer overflow-hidden"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-6">
                <span className="font-mono text-xl font-bold text-neo-text group-hover:text-neo-accent">0{index + 1}</span>
                {/* Cover placeholder or image */}
                <div
                  className="w-12 h-12 border-2 border-neo-border group-hover:border-neo-accent bg-neo-bg-alt bg-cover bg-center"
                  style={{ backgroundImage: album.img ? `url(${album.img})` : undefined }}
                ></div>
                <div>
                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neo-text group-hover:text-neo-accent">{album.title}</h3>
                   <div className="flex gap-4 font-mono text-xs mt-1">
                      <span>{album.style || t('genre')}</span>
                      <span>—</span>
                      <span>{formatDate(album.date)}</span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-8 self-end md:self-auto">
                {album.listenLink ? (
                  <a
                    href={album.listenLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border-2 border-neo-border group-hover:border-neo-accent flex items-center justify-center bg-neo-accent text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text-inverse transition-transform group-hover:scale-110 shadow-[4px_4px_0px_0px_var(--neo-shadow)] group-hover:shadow-[4px_4px_0px_0px_var(--neo-accent)]"
                    aria-label={`Écouter ${album.title}`}
                  >
                    <Play size={20} fill="currentColor" />
                  </a>
                ) : (
                  <div
                    className="w-12 h-12 border-2 border-neo-border/50 flex items-center justify-center bg-neo-surface text-neo-text/30 cursor-not-allowed"
                    title="Bientôt disponible"
                    aria-label="Lien d'écoute bientôt disponible"
                  >
                    <Play size={20} fill="currentColor" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
         <a
           href="https://soundcloud.com/loic-ghanem"
           target="_blank"
           rel="noopener noreferrer"
           className="font-mono font-bold text-sm uppercase underline decoration-2 decoration-neo-accent underline-offset-4 hover:bg-neo-text hover:text-neo-accent px-2 py-1 transition-colors text-neo-text"
         >
           {t('viewAllAlbumsSoundcloud')}
         </a>
      </div>
    </section>
  );
};
