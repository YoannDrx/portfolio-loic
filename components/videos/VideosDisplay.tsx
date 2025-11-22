'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import VideoCard from '@/components/videos/VideoCard';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';
import { Play } from 'lucide-react';
import type { Video } from '@/types';

interface VideosDisplayProps {
  videos: Video[];
}

const VIDEO_TYPE_FILTERS = [
  { value: 'All', labelKey: 'filterAll' },
  { value: 'OriginalMusic', labelKey: 'filterOriginalMusic' },
  { value: 'Sync', labelKey: 'filterSync' },
  { value: 'MusicToPicture', labelKey: 'filterMusicToPicture' },
];

export function VideosDisplay({ videos }: VideosDisplayProps) {
  const t = useTranslations('videos');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Get count for each type
  const getTypeCount = (type: string) => {
    if (type === 'All') return videos.length;
    return videos.filter((video) => video.type === type).length;
  };

  // Filter videos based on selected type
  const filteredVideos = useMemo(() => {
    if (activeFilter === 'All') return videos;
    return videos.filter((video) => video.type === activeFilter);
  }, [activeFilter, videos]);

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
            {VIDEO_TYPE_FILTERS.map((filter) => (
              <FilterButton
                key={filter.value}
                active={activeFilter === filter.value}
                count={getTypeCount(filter.value)}
                onClick={() => setActiveFilter(filter.value)}
              >
                {t(filter.labelKey)}
              </FilterButton>
            ))}
          </FilterButtonGroup>
        </AnimatedSection>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <AnimatedSection
                key={video.id}
                variant="slideUp"
                delay={0.1 * (index % 6)}
              >
                <VideoCard video={video} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20">
            <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              Aucune vidéo trouvée pour ce type.
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4} className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {videos.length}
              </div>
              <div className="text-gray-400">{t('filterAll')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {VIDEO_TYPE_FILTERS.length - 1}
              </div>
              <div className="text-gray-400">Types de Projets</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                100%
              </div>
              <div className="text-gray-400">Musique Originale</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
