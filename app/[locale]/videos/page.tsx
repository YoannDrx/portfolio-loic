'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { videoData } from '@/data/videoData';
import VideoCard from '@/components/videos/VideoCard';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';

export default function VideosPage() {
  const t = useTranslations('videos');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const typeLabels: Record<string, string> = {
    All: t('filterAll'),
    OriginalMusic: t('filterOriginalMusic'),
    Sync: t('filterSync'),
    MusicToPicture: t('filterMusicToPicture'),
  };

  // Extract unique types for filters
  const videoTypes = useMemo(() => {
    const uniqueTypes = new Set(videoData.map((video) => video.type));
    return ['All', ...Array.from(uniqueTypes).sort()];
  }, []);

  // Get count for each type
  const getTypeCount = (type: string) => {
    if (type === 'All') return videoData.length;
    return videoData.filter((video) => video.type === type).length;
  };

  // Filter videos based on selected type
  const filteredVideos = useMemo(() => {
    if (activeFilter === 'All') return videoData;
    return videoData.filter((video) => video.type === activeFilter);
  }, [activeFilter]);

  // Sort videos by date (most recent first)
  const sortedVideos = useMemo(() => {
    return [...filteredVideos].sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredVideos]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian via-obsidian-50 to-obsidian py-20">
      <div className="container-custom">
        {/* Hero Section */}
        <AnimatedSection variant="fadeIn" className="text-center mb-16">
          <AnimatedText
            text={t('pageTitle')}
            className="mb-6 text-6xl md:text-7xl font-black text-gradient-neon"
            type="word"
          />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('pageDescription')}
          </p>
        </AnimatedSection>

        {/* Filter Buttons */}
        <AnimatedSection variant="slideUp" delay={0.2} className="mb-12">
          <FilterButtonGroup>
            {videoTypes.map((type) => (
              <FilterButton
                key={type}
                active={activeFilter === type}
                count={getTypeCount(type)}
                onClick={() => setActiveFilter(type)}
              >
                {typeLabels[type] || type}
              </FilterButton>
            ))}
          </FilterButtonGroup>
        </AnimatedSection>

        {/* Videos Grid */}
        {sortedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video, index) => (
              <AnimatedSection
                key={video.id}
                variant="slideUp"
                delay={0.1 * (index % 9)}
              >
                <VideoCard video={video} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20">
            <p className="text-xl text-gray-400">
              Aucune vidéo trouvée pour cette catégorie.
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4} className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {videoData.length}
              </div>
              <div className="text-gray-400">Vidéos totales</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {getTypeCount('Sync')}
              </div>
              <div className="text-gray-400">Sync Placements</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {getTypeCount('OriginalMusic')}
              </div>
              <div className="text-gray-400">Original Music</div>
            </div>
          </div>
        </AnimatedSection>

        {/* Notable Placements Section */}
        <AnimatedSection variant="fadeIn" delay={0.6} className="mt-16">
          <div className="glass-card-neon p-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Placements Notables
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto">
              Mes compositions ont été diffusées sur des plateformes prestigieuses incluant{' '}
              <span className="text-neon-cyan font-semibold">BBC</span>,{' '}
              <span className="text-neon-magenta font-semibold">ESPN</span>,{' '}
              <span className="text-neon-purple font-semibold">WWE</span>,{' '}
              <span className="text-neon-cyan font-semibold">NBA</span>,{' '}
              <span className="text-neon-magenta font-semibold">NHL</span>,{' '}
              et de nombreuses autres productions internationales.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
