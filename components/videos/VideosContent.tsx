'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Film, Video, Tv, Clapperboard, Award } from 'lucide-react';

// Immersive components
import ImmersivePage, { ImmersiveSection, ImmersiveTitle } from '@/components/immersive/ImmersivePage';
import GlowingStats from '@/components/immersive/GlowingStats';

// 3D Scene
import CinemaScene from '@/components/three/scenes/CinemaScene';

// Videos components
import VideosHero from '@/components/videos/VideosHero';
import ImmersiveVideoCard from '@/components/videos/ImmersiveVideoCard';
import VideosCTA from '@/components/videos/VideosCTA';

// UI components
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';

/* ============================================
   TYPES
   ============================================ */

interface Video {
  id: string;
  img: string;
  type: string;
  videoId: string;
  title: string;
  date: string;
}

interface VideosContentProps {
  videos: Video[];
  locale: string;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function VideosContent({ videos, locale }: VideosContentProps) {
  const t = useTranslations('videos');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [highlightedVideo, setHighlightedVideo] = useState<number | null>(null);

  // Extract unique types for filters
  const types = useMemo(() => {
    const uniqueTypes = new Set(videos.map((video) => video.type));
    return ['All', ...Array.from(uniqueTypes).sort()];
  }, [videos]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    if (activeFilter === 'All') return videos;
    return videos.filter((video) => video.type === activeFilter);
  }, [activeFilter, videos]);

  // Get count for each type
  const getCount = (type: string) => {
    if (type === 'All') return videos.length;
    return videos.filter((v) => v.type === type).length;
  };

  // Get type translation key
  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      OriginalMusic: 'filterOriginalMusic',
      Sync: 'filterSync',
      MusicToPicture: 'filterMusicToPicture',
    };
    return type === 'All' ? t('filterAll') : t(typeMap[type] || type);
  };

  // Calculate stats
  const syncCount = useMemo(() => {
    return videos.filter((v) => v.type === 'Sync').length;
  }, [videos]);

  // Stats configuration for GlowingStats
  const stats = [
    {
      value: videos.length,
      label: t('stats.total'),
      icon: Video,
      color: 'cyan' as const,
    },
    {
      value: types.length - 1,
      label: t('stats.categories'),
      icon: Clapperboard,
      color: 'purple' as const,
    },
    {
      value: syncCount,
      label: t('stats.syncPlacements'),
      icon: Tv,
      color: 'magenta' as const,
    },
    {
      value: '50+',
      label: t('stats.brands'),
      icon: Award,
      color: 'lime' as const,
    },
  ];

  return (
    <ImmersivePage
      scene={<CinemaScene highlightedVideo={highlightedVideo ?? undefined} />}
      gradient="cyan"
      showOrbs={false}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      {/* Hero Section */}
      <VideosHero
        videosCount={videos.length}
        categoriesCount={types.length - 1}
        syncCount={syncCount}
        locale={locale}
      />

      {/* Videos Grid Section */}
      <div id="videos-grid">
        <ImmersiveSection className="py-20 lg:py-32">
          <div className="container-custom">
            {/* Section Title */}
            <ImmersiveTitle
              subtitle="PORTFOLIO"
              gradient="cyan"
              align="center"
              className="mb-12"
            >
              {t('pageTitle')}
            </ImmersiveTitle>

            {/* Filter Buttons */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FilterButtonGroup>
                {types.map((type) => (
                  <FilterButton
                    key={type}
                    active={activeFilter === type}
                    count={getCount(type)}
                    onClick={() => setActiveFilter(type)}
                  >
                    {getTypeLabel(type)}
                  </FilterButton>
                ))}
              </FilterButtonGroup>
            </motion.div>

            {/* Videos Grid */}
            {filteredVideos.length > 0 ? (
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
                {filteredVideos.map((video, index) => (
                  <ImmersiveVideoCard
                    key={video.id}
                    video={video}
                    index={index}
                    onHover={setHighlightedVideo}
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
                  <Film className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground">{t('noVideos')}</p>
              </motion.div>
            )}
          </div>
        </ImmersiveSection>
      </div>

      {/* Stats Section */}
      <ImmersiveSection className="py-20 lg:py-32">
        <div className="container-custom">
          <GlowingStats stats={stats} columns={4} />
        </div>
      </ImmersiveSection>

      {/* CTA Section */}
      <VideosCTA locale={locale} />
    </ImmersivePage>
  );
}
