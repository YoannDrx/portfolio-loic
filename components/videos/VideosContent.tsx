'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';
import VideoCard from '@/components/videos/VideoCard';
import { Film, Play, Video, Layers } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import VideosScene from '@/components/three/scenes/VideosScene';
import PageShell from '@/components/ui/PageShell';

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
}

export default function VideosContent({ videos }: VideosContentProps) {
  const t = useTranslations('videos');
  const [activeFilter, setActiveFilter] = useState<string>('All');

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

  const getCount = (type: string) => {
    if (type === 'All') return videos.length;
    return videos.filter((v) => v.type === type).length;
  };

  return (
    <PageShell
      title={t('pageTitle')}
      subtitle="Visuals"
      scene={<VideosScene />}
      gradient="magenta"
    >
        {/* Filters */}
        <AnimatedSection variant="slideUp" delay={0.2} className="mb-12">
          <FilterButtonGroup>
            {types.map((type) => (
              <FilterButton
                key={type}
                active={activeFilter === type}
                count={getCount(type)}
                onClick={() => setActiveFilter(type)}
              >
                {type === 'All' ? t('filterAll') : type}
              </FilterButton>
            ))}
          </FilterButtonGroup>
        </AnimatedSection>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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
          <AnimatedSection variant="fadeIn" className="text-center py-20 mb-20">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              {t('noVideos')}
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-cyan/10 text-neon-cyan mb-6">
                  <Video className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {videos.length}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('filterAll')}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-magenta/10 text-neon-magenta mb-6">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {types.length - 1}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('categories')}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-purple/10 text-neon-purple mb-6">
                   <Play className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  50+
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('placements')}</div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </AnimatedSection>
    </PageShell>
  );
}
