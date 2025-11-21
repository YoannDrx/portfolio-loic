'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { getAlbumsData } from '@/data/albumsData';
import AlbumCard from '@/components/albums/AlbumCard';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';

export default function AlbumsPage() {
  const t = useTranslations('albums');
  const locale = useLocale();
  const albumsData = getAlbumsData(locale);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Extract unique styles for filters
  const genres = useMemo(() => {
    const uniqueGenres = new Set(albumsData.map((album) => album.style));
    return ['All', ...Array.from(uniqueGenres).sort()];
  }, []);

  // Get count for each genre
  const getGenreCount = (genre: string) => {
    if (genre === 'All') return albumsData.length;
    return albumsData.filter((album) => album.style === genre).length;
  };

  // Filter albums based on selected genre
  const filteredAlbums = useMemo(() => {
    if (activeFilter === 'All') return albumsData;
    return albumsData.filter((album) => album.style === activeFilter);
  }, [activeFilter]);

  // Sort albums by date (most recent first)
  const sortedAlbums = useMemo(() => {
    return [...filteredAlbums].sort((a, b) => {
      const [monthA, yearA] = a.sortedDate.split('-');
      const [monthB, yearB] = b.sortedDate.split('-');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1);
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredAlbums]);

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
        {sortedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAlbums.map((album, index) => (
              <AnimatedSection
                key={album.id}
                variant="slideUp"
                delay={0.1 * (index % 8)}
              >
                <AlbumCard album={album} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20">
            <p className="text-xl text-gray-400">
              Aucun album trouvé pour ce genre.
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4} className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {albumsData.length}
              </div>
              <div className="text-gray-400">{t('filterAll')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {genres.length - 1}
              </div>
              <div className="text-gray-400">{t('genre')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                2019-2025
              </div>
              <div className="text-gray-400">{t('releaseDate')}</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
