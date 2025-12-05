'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Disc, Music, Users, Calendar, Layers } from 'lucide-react';

// Immersive components
import ImmersivePage, { ImmersiveSection, ImmersiveTitle } from '@/components/immersive/ImmersivePage';
import GlowingStats from '@/components/immersive/GlowingStats';

// 3D Scene
import AlbumsScene from '@/components/three/scenes/AlbumsScene';

// Albums components
import AlbumsHero from '@/components/albums/AlbumsHero';
import ImmersiveAlbumCard from '@/components/albums/ImmersiveAlbumCard';
import AlbumsCTA from '@/components/albums/AlbumsCTA';

// UI components
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';

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
  collabName: string | null;
  collabLink: string | null;
  descriptionsFr: string;
  descriptionsEn: string;
}

interface AlbumsContentProps {
  albums: Album[];
  locale: string;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AlbumsContent({ albums, locale }: AlbumsContentProps) {
  const t = useTranslations('albums');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [highlightedAlbum, setHighlightedAlbum] = useState<number | null>(null);

  // Extract unique styles for filters
  const genres = useMemo(() => {
    const uniqueGenres = new Set(albums.map((album) => album.style));
    return ['All', ...Array.from(uniqueGenres).sort()];
  }, [albums]);

  // Get count for each genre
  const getGenreCount = (genre: string) => {
    if (genre === 'All') return albums.length;
    return albums.filter((album) => album.style === genre).length;
  };

  // Filter albums based on selected genre
  const filteredAlbums = useMemo(() => {
    if (activeFilter === 'All') return albums;
    return albums.filter((album) => album.style === activeFilter);
  }, [activeFilter, albums]);

  // Transform album data to match the expected format
  const transformedAlbums = filteredAlbums.map((album) => ({
    ...album,
    collabName: album.collabName || undefined,
    collabLink: album.collabLink || undefined,
    descriptions: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
  }));

  // Calculate stats for hero
  const collabCount = useMemo(() => {
    return albums.filter((album) => album.collabName).length;
  }, [albums]);

  // Get period from sorted dates
  const period = useMemo(() => {
    if (albums.length === 0) return '2019-2025';
    const dates = albums.map((a) => parseInt(a.sortedDate.substring(0, 4)));
    const minYear = Math.min(...dates);
    const maxYear = Math.max(...dates);
    return `${minYear}-${maxYear}`;
  }, [albums]);

  // Stats configuration for GlowingStats
  const stats = [
    {
      value: albums.length,
      label: t('stats.total'),
      icon: Layers,
      color: 'magenta' as const,
    },
    {
      value: genres.length - 1,
      label: t('stats.genres'),
      icon: Music,
      color: 'purple' as const,
    },
    {
      value: collabCount,
      label: t('stats.collaborations'),
      icon: Users,
      color: 'cyan' as const,
    },
    {
      value: period,
      label: t('stats.period'),
      icon: Calendar,
      color: 'lime' as const,
    },
  ];

  return (
    <ImmersivePage
      scene={<AlbumsScene highlightedAlbum={highlightedAlbum ?? undefined} />}
      gradient="magenta"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      {/* Hero Section */}
      <AlbumsHero
        albumsCount={albums.length}
        genresCount={genres.length - 1}
        collabCount={collabCount}
        period={period}
        locale={locale}
      />

      {/* Albums Grid Section */}
      <div id="albums-grid">
        <ImmersiveSection className="py-10 sm:py-20 lg:py-32">
          <div className="container-custom">
            {/* Section Title */}
            <ImmersiveTitle
              subtitle="COLLECTION"
              gradient="magenta"
              align="center"
              className="mb-6 sm:mb-12"
            >
              {t('pageTitle')}
            </ImmersiveTitle>

            {/* Filter Buttons */}
            <motion.div
              className="mb-6 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FilterButtonGroup>
                {genres.map((genre) => (
                  <FilterButton
                    key={genre}
                    active={activeFilter === genre}
                    count={getGenreCount(genre)}
                    onClick={() => setActiveFilter(genre)}
                  >
                    {genre === 'All' ? t('filterAll') : genre}
                  </FilterButton>
                ))}
              </FilterButtonGroup>
            </motion.div>

            {/* Albums Grid */}
            {transformedAlbums.length > 0 ? (
              <motion.div
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"
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
                {transformedAlbums.map((album, index) => (
                  <ImmersiveAlbumCard
                    key={album.id}
                    album={album}
                    index={index}
                    onHover={setHighlightedAlbum}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--glass-subtle)] mb-6">
                  <Disc className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">{t('noAlbums')}</p>
              </motion.div>
            )}
          </div>
        </ImmersiveSection>
      </div>

      {/* Stats Section */}
      <ImmersiveSection className="py-10 sm:py-20 lg:py-32">
        <div className="container-custom">
          <GlowingStats stats={stats} columns={4} />
        </div>
      </ImmersiveSection>

      {/* CTA Section */}
      <AlbumsCTA locale={locale} />
    </ImmersivePage>
  );
}
