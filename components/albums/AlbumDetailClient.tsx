'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Calendar, Disc, ExternalLink, Users, ArrowLeft, Headphones, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

// Immersive components
import ImmersivePage, { ImmersiveSection } from '@/components/immersive/ImmersivePage';
import MagneticButton from '@/components/immersive/MagneticButton';

// 3D Scene
import AlbumsScene from '@/components/three/scenes/AlbumsScene';

// Related albums
import RelatedAlbums from './RelatedAlbums';

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
  published: boolean;
}

interface AlbumDetailClientProps {
  album: Album;
  allAlbums: Album[];
  locale: string;
  isPreview?: boolean;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AlbumDetailClient({
  album,
  allAlbums,
  locale,
  isPreview = false,
}: AlbumDetailClientProps) {
  const t = useTranslations('albums.detail');
  const tCommon = useTranslations('common');
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true, margin: '-100px' });

  // Transform albums for RelatedAlbums component
  const transformedAlbums = allAlbums.map((a) => ({
    ...a,
    collabName: a.collabName || undefined,
    collabLink: a.collabLink || undefined,
  }));

  return (
    <ImmersivePage
      scene={<AlbumsScene />}
      gradient="magenta"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="medium"
      parallaxHero={false}
    >
      {/* Preview Banner */}
      {isPreview && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 backdrop-blur-md rounded-full border border-neon-cyan/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Eye className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">
              Mode Pr&eacute;visualisation - {album.published ? 'Publi&eacute;' : 'Non publi&eacute;'}
            </span>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <ImmersiveSection className="py-20 lg:py-32">
        <div ref={heroRef} className="container-custom">
          {/* Back Button */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-magenta transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>{t('backToAlbums')}</span>
            </Link>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Album Cover */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden sticky top-24">
                {/* Cover Image */}
                <Image
                  src={album.img}
                  alt={album.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />

                {/* Glow overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-neon-magenta/20 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-50"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,0,110,0.3), transparent, rgba(139,92,246,0.3))',
                  }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* Right Column - Album Info */}
            <div className="space-y-8">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1
                  className={cn(
                    'text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4',
                    'bg-gradient-to-r from-white via-neon-magenta to-neon-purple bg-clip-text text-transparent'
                  )}
                >
                  {album.title}
                </h1>

                {/* Genre Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-magenta/10 border border-neon-magenta/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <Disc className="w-4 h-4 text-neon-magenta" />
                  <span className="text-neon-magenta text-sm font-medium uppercase tracking-wider">
                    {album.style}
                  </span>
                </motion.div>
              </motion.div>

              {/* Metadata */}
              <motion.div
                className="space-y-4 py-6 border-y border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                  <span className="text-lg">
                    <span className="text-gray-400">{tCommon('releaseDate')}:</span>{' '}
                    <span className="text-white font-semibold">{album.date}</span>
                  </span>
                </div>

                {/* Artist */}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-neon-purple flex-shrink-0" />
                  <span className="text-lg">
                    <span className="text-gray-400">{tCommon('artist')}:</span>{' '}
                    <span className="text-white font-semibold">{album.poster}</span>
                  </span>
                </div>

                {/* Collaborators */}
                {album.collabName && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-neon-magenta flex-shrink-0 mt-1" />
                    <div>
                      <span className="text-gray-400">{tCommon('collaborators')}:</span>
                      <div className="text-white font-semibold">{album.collabName}</div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">{t('about')}</h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <div
                    className="text-gray-300 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{
                      __html: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
                    }}
                  />
                </div>
              </motion.div>

              {/* CTA Buttons */}
              {album.listenLink && (
                <motion.div
                  className="flex flex-wrap gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <MagneticButton
                    href={album.listenLink}
                    external
                    color="magenta"
                    variant="solid"
                    size="lg"
                    glow
                    leftIcon={Headphones}
                    rightIcon={ExternalLink}
                  >
                    {t('listen')}
                  </MagneticButton>

                  <MagneticButton
                    href={`/${locale}/contact`}
                    color="purple"
                    variant="outline"
                    size="lg"
                  >
                    {tCommon('contact')}
                  </MagneticButton>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </ImmersiveSection>

      {/* Related Albums Section */}
      <RelatedAlbums
        albums={transformedAlbums}
        currentAlbumId={album.id}
        currentAlbumStyle={album.style}
      />
    </ImmersivePage>
  );
}
