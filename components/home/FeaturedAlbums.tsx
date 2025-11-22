import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import AlbumCard from '@/components/albums/AlbumCard';
import { prisma } from '@/lib/prisma';

export default async function FeaturedAlbums() {
  const t = await getTranslations('home.featuredAlbums');
  const locale = await getLocale();

  // Get the 4 most recent published albums
  const albums = await prisma.album.findMany({
    where: { published: true },
    orderBy: { sortedDate: 'desc' },
    take: 4,
  });

  const totalCount = await prisma.album.count({
    where: { published: true },
  });

  // Transform data to match Album type
  const featuredAlbums = albums.map(album => ({
    ...album,
    collabName: album.collabName ?? undefined,
    collabLink: album.collabLink ?? undefined,
    descriptions: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
  }));

  return (
    <section className="py-24 bg-gradient-to-b from-obsidian to-obsidian-50">
      <div className="container-custom">
        {/* Section Header */}
        <AnimatedSection variant="fadeIn" className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gradient-neon mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </AnimatedSection>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredAlbums.map((album, index) => (
            <AnimatedSection
              key={album.id}
              variant="slideUp"
              delay={index * 0.1}
            >
              <AlbumCard album={album} />
            </AnimatedSection>
          ))}
        </div>

        {/* View All Link */}
        <AnimatedSection variant="fadeIn" delay={0.5} className="text-center">
          <Link
            href="/albums"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-neon-magenta rounded-lg font-semibold text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-all duration-300"
          >
            <span>{t('viewAll', { count: totalCount })}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
