"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Calendar, Disc, Users, ArrowLeft, Eye, Headphones } from 'lucide-react';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';
import { BrutalistButton } from '../ui/BrutalistButton';
import { StreamingPlatformsButton } from '../ui/StreamingPlatformsButton';
import { NeoAlbumPlayer } from './NeoAlbumPlayer';

interface Album {
  id: string;
  title: string;
  img: string;
  poster: string;
  date: string;
  sortedDate: string;
  style: string;
  listenLink: string;
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  collabName: string | null;
  collabLink: string | null;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface NeoAlbumDetailProps {
  album: Album;
  allAlbums: Album[];
  locale: string;
  isPreview?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// Audio wave animation component
const AudioWaveAnimation = () => (
  <div className="flex items-end gap-[2px] h-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-[3px] bg-neo-accent rounded-full"
        animate={{
          height: ['4px', '16px', '8px', '12px', '4px'],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

export default function NeoAlbumDetail({
  album,
  allAlbums,
  locale,
  isPreview = false,
}: NeoAlbumDetailProps) {
  const t = useTranslations('albums.detail');
  const tCommon = useTranslations('common');

  // Filter related albums (same style, excluding current)
  const relatedAlbums = allAlbums
    .filter(a => a.id !== album.id && a.style === album.style)
    .slice(0, 3);

  const hasPlayer = album.spotifyEmbed || album.youtubeEmbed;

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-24 pb-24">
        {/* Preview Banner */}
        {isPreview && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase">
                Prévisualisation - {album.published ? 'Publié' : 'Brouillon'}
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('backToAlbums')}
            </Link>
          </motion.div>

          {/* ==================== HERO SECTION ==================== */}
          <section className="min-h-[60vh] lg:min-h-[70vh] flex items-center mb-16 lg:mb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full"
            >
              {/* Left Column - Album Cover */}
              <motion.div variants={fadeInLeft} className="relative">
                {/* Decorative background element */}
                <div className="absolute -inset-4 bg-neo-accent/10 rotate-2 -z-10 hidden lg:block" />
                <div className="absolute -inset-2 bg-neo-text/5 -rotate-1 -z-10 hidden lg:block" />

                <NeoCard
                  hover="lift"
                  padding="none"
                  className="overflow-hidden shadow-[12px_12px_0px_0px_var(--neo-shadow)] border-4"
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={album.img}
                      alt={album.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Overlay with play indication */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neo-text/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </NeoCard>

                {/* Album number badge */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-6 lg:-right-6 bg-neo-text text-neo-accent w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center border-4 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)]">
                  <Disc className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              </motion.div>

              {/* Right Column - Album Info */}
              <motion.div variants={fadeInRight} className="space-y-6 lg:space-y-8">
                {/* Genre Tag */}
                <NeoTag variant="accent" size="lg" className="inline-flex">
                  <Disc className="w-4 h-4 mr-2" />
                  {album.style}
                </NeoTag>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-neo-text">
                  {album.title}
                </h1>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y-4 border-neo-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neo-text flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-neo-accent" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase text-neo-text/60 block">
                        {tCommon('releaseDate')}
                      </span>
                      <span className="font-bold text-lg">{album.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-neo-text flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-neo-accent" />
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase text-neo-text/60 block">
                        {tCommon('artist')}
                      </span>
                      <span className="font-bold text-lg">{album.poster}</span>
                    </div>
                  </div>

                  {album.collabName && (
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="w-12 h-12 bg-neo-accent flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-neo-text-inverse" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tCommon('collaborators')}
                        </span>
                        <span className="font-bold">{album.collabName}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Streaming Platforms Button */}
                {album.listenLink && (
                  <StreamingPlatformsButton
                    fanlinkUrl={album.listenLink}
                    className="mt-6"
                  />
                )}
              </motion.div>
            </motion.div>
          </section>

          {/* ==================== PLAYER SECTION ==================== */}
          {hasPlayer && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 lg:mb-24"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                  01
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                  {t('player')}
                </h2>
                <div className="flex-1 h-1 bg-neo-border" />
              </div>

              {/* Player Container */}
              <NeoCard
                variant="default"
                padding="lg"
                className="max-w-4xl border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
              >
                <NeoAlbumPlayer
                  spotifyEmbed={album.spotifyEmbed}
                  youtubeEmbed={album.youtubeEmbed}
                  title={album.title}
                />

                {/* Now Playing Indicator */}
                <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t-2 border-neo-border">
                  <AudioWaveAnimation />
                  <span className="font-mono text-xs font-bold uppercase text-neo-text/60">
                    {t('nowPlaying')}
                  </span>
                  <AudioWaveAnimation />
                </div>
              </NeoCard>
            </motion.section>
          )}

          {/* ==================== DESCRIPTION SECTION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-24"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                {hasPlayer ? '02' : '01'}
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                {t('about')}
              </h2>
              <div className="flex-1 h-1 bg-neo-border" />
            </div>

            <NeoCard padding="lg" className="max-w-4xl border-4">
              <div
                className="prose prose-lg max-w-none text-neo-text
                  prose-headings:font-black prose-headings:uppercase prose-headings:text-neo-text
                  prose-p:font-mono prose-p:leading-relaxed
                  prose-strong:text-neo-accent prose-strong:font-bold
                  prose-a:text-neo-accent prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{
                  __html: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
                }}
              />
            </NeoCard>
          </motion.section>

          {/* ==================== RELATED ALBUMS ==================== */}
          {relatedAlbums.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 lg:mb-24"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                  {hasPlayer ? '03' : '02'}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                  {t('relatedAlbums')}
                </h2>
                <div className="flex-1 h-1 bg-neo-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {relatedAlbums.map((relatedAlbum, index) => (
                  <motion.div
                    key={relatedAlbum.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={{ pathname: '/albums/[id]', params: { id: relatedAlbum.id } }}>
                      <NeoCard hover="lift" padding="sm" className="group h-full">
                        <div className="aspect-square relative overflow-hidden mb-4">
                          <Image
                            src={relatedAlbum.img}
                            alt={relatedAlbum.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <NeoTag variant="default" size="sm" className="mb-2">
                          {relatedAlbum.style}
                        </NeoTag>
                        <h3 className="text-xl font-black uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {relatedAlbum.title}
                        </h3>
                        <p className="font-mono text-sm text-neo-text/60 mt-1">
                          {relatedAlbum.date}
                        </p>
                      </NeoCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ==================== CTA SECTION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <NeoCard variant="inverted" padding="lg" className="text-center border-4">
              <Headphones className="w-12 h-12 mx-auto mb-4 text-neo-accent" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                {t('ctaTitle')}
              </h2>
              <p className="font-mono text-lg opacity-60 max-w-2xl mx-auto mb-8">
                {t('ctaText', { title: album.title })}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <BrutalistButton variant="dark" size="lg">
                    {tCommon('contact')}
                  </BrutalistButton>
                </Link>
                <Link href="/albums">
                  <BrutalistButton variant="dark" size="lg">
                    {t('backToAlbums')}
                  </BrutalistButton>
                </Link>
              </div>
            </NeoCard>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
