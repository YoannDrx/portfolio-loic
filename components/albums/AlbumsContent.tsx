'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AlbumCard from '@/components/albums/AlbumCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';
import { Disc, Calendar, Layers } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import AlbumsScene from '@/components/three/scenes/AlbumsScene';
import PageShell from '@/components/ui/PageShell';

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

export default function AlbumsContent({ albums, locale }: AlbumsContentProps) {
  const t = useTranslations('albums');
  const [activeFilter, setActiveFilter] = useState<string>('All');

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

  return (
    <PageShell
      title={t('pageTitle')}
      subtitle="Discography"
      scene={<AlbumsScene />}
      gradient="cyan"
    >
        {/* Filter Buttons */}
        <AnimatedSection variant="slideUp" delay={0.2} className="mb-12" triggerOnLoad>
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
        </AnimatedSection>

        {/* Albums Grid */}
        {transformedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
            {transformedAlbums.map((album, index) => (
              <AnimatedSection
                key={album.id}
                variant="slideUp"
                delay={0.1 * (index % 8)}
                triggerOnLoad
              >
                <AlbumCard album={album} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20 mb-20" triggerOnLoad>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
               <Disc className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-xl text-gray-400">
              No albums found for this genre.
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4} triggerOnLoad>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" className="text-center h-full" triggerOnLoad>
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-cyan/10 text-neon-cyan mb-6">
                  <Layers className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {albums.length}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-sm">{t('filterAll')}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" className="text-center h-full" triggerOnLoad>
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-magenta/10 text-neon-magenta mb-6">
                  <Disc className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {genres.length - 1}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-sm">{t('genre')}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" className="text-center h-full" triggerOnLoad>
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-purple/10 text-neon-purple mb-6">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  2019-2025
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-sm">{t('releaseDate')}</div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </AnimatedSection>
    </PageShell>
  );
}
