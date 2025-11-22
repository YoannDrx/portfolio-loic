'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import AlbumCard from '@/components/albums/AlbumCard';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { FilterButton, FilterButtonGroup } from '@/components/ui/FilterButton';

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

  // Albums are already sorted by sortedDate DESC from the query
  const sortedAlbums = filteredAlbums;

  // Transform album data to match the expected format
  const transformedAlbums = sortedAlbums.map((album) => ({
    id: album.id,
    title: album.title,
    img: album.img,
    poster: album.poster,
    date: album.date,
    sortedDate: album.sortedDate,
    style: album.style,
    listenLink: album.listenLink,
    collabName: album.collabName || undefined,
    collabLink: album.collabLink || undefined,
    descriptions: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
  }));

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
        {transformedAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {transformedAlbums.map((album, index) => (
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
                {albums.length}
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
