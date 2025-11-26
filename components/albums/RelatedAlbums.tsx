'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ImmersiveAlbumCard from './ImmersiveAlbumCard';
import { ImmersiveTitle } from '@/components/immersive/ImmersivePage';

/* ============================================
   TYPES
   ============================================ */

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
}

interface RelatedAlbumsProps {
  albums: Album[];
  currentAlbumId: string;
  currentAlbumStyle: string;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function RelatedAlbums({
  albums,
  currentAlbumId,
  currentAlbumStyle,
}: RelatedAlbumsProps) {
  const t = useTranslations('albums.detail');

  // Filter related albums (same genre, exclude current)
  const relatedAlbums = albums
    .filter((album) => album.id !== currentAlbumId && album.style === currentAlbumStyle)
    .slice(0, 3);

  // If no albums with same genre, show random albums
  const fallbackAlbums =
    relatedAlbums.length === 0
      ? albums.filter((album) => album.id !== currentAlbumId).slice(0, 3)
      : relatedAlbums;

  if (fallbackAlbums.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container-custom">
        {/* Section Title */}
        <ImmersiveTitle
          subtitle={currentAlbumStyle.toUpperCase()}
          gradient="magenta"
          align="center"
          className="mb-12"
        >
          {t('relatedAlbums')}
        </ImmersiveTitle>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {fallbackAlbums.map((album, index) => (
            <ImmersiveAlbumCard key={album.id} album={album} index={index} compact />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
