"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Calendar, Disc, Users, ArrowLeft, ExternalLink, Eye } from 'lucide-react';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';
import { BrutalistButton } from '../ui/BrutalistButton';
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

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

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-32 pb-24">
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

          {/* Main Content Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
          >
            {/* Left Column - Album Cover */}
            <motion.div variants={fadeInUp}>
              <NeoCard hover="lift" padding="sm" className="bg-neo-surface">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={album.img}
                    alt={album.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </NeoCard>
            </motion.div>

            {/* Right Column - Album Info */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Genre Tag */}
              <NeoTag variant="accent" size="lg">
                <Disc className="w-4 h-4 mr-2 inline" />
                {album.style}
              </NeoTag>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-neo-text">
                {album.title}
              </h1>

              {/* Metadata */}
              <div className="space-y-4 py-6 border-y-2 border-neo-border">
                <div className="flex items-center gap-3 font-mono">
                  <Calendar className="w-5 h-5 text-neo-accent" />
                  <span className="opacity-60">{tCommon('releaseDate')}:</span>
                  <span className="font-bold">{album.date}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <Users className="w-5 h-5 text-neo-accent" />
                  <span className="opacity-60">{tCommon('artist')}:</span>
                  <span className="font-bold">{album.poster}</span>
                </div>

                {album.collabName && (
                  <div className="flex items-center gap-3 font-mono">
                    <Users className="w-5 h-5 text-neo-accent" />
                    <span className="opacity-60">{tCommon('collaborators')}:</span>
                    <span className="font-bold">{album.collabName}</span>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                {album.listenLink && (
                  <a href={album.listenLink} target="_blank" rel="noopener noreferrer">
                    <BrutalistButton variant="primary" size="lg" icon={<ExternalLink size={18} />}>
                      Écouter
                    </BrutalistButton>
                  </a>
                )}
                <Link href="/contact">
                  <BrutalistButton variant="secondary" size="lg">
                    {tCommon('contact')}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Description Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <NeoCard padding="lg" className="max-w-4xl">
              <h2 className="text-2xl font-black uppercase mb-6 pb-4 border-b-2 border-neo-border text-neo-text">
                {t('about')}
              </h2>
              <div
                className="prose prose-lg max-w-none text-neo-text font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: locale === 'fr' ? album.descriptionsFr : album.descriptionsEn,
                }}
              />
            </NeoCard>
          </motion.section>

          {/* Embed Player */}
          {(album.spotifyEmbed || album.youtubeEmbed) && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                  02
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight text-neo-text">
                  {t('listenNow')}
                </h2>
              </div>
              <div className="max-w-3xl">
                <NeoAlbumPlayer
                  spotifyEmbed={album.spotifyEmbed}
                  youtubeEmbed={album.youtubeEmbed}
                  title={album.title}
                />
              </div>
            </motion.section>
          )}

          {/* Related Albums */}
          {relatedAlbums.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                  RELATED
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tight text-neo-text">
                  Albums similaires
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedAlbums.map((relatedAlbum) => (
                  <Link key={relatedAlbum.id} href={{ pathname: '/albums/[id]', params: { id: relatedAlbum.id } }}>
                    <NeoCard hover="lift" padding="sm" className="group">
                      <div className="aspect-square relative overflow-hidden mb-4">
                        <Image
                          src={relatedAlbum.img}
                          alt={relatedAlbum.title}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <NeoTag variant="default" size="sm" className="mb-2">
                        {relatedAlbum.style}
                      </NeoTag>
                      <h3 className="text-xl font-black uppercase truncate text-neo-text">
                        {relatedAlbum.title}
                      </h3>
                    </NeoCard>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <NeoCard variant="inverted" padding="lg" className="text-center">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                Travaillons ensemble
              </h2>
              <p className="font-mono text-lg opacity-60 max-w-2xl mx-auto mb-8">
                Vous avez un projet musical ? Discutons de vos besoins.
              </p>
              <Link href="/contact">
                <BrutalistButton variant="dark" size="lg">
                  {tCommon('contact')}
                </BrutalistButton>
              </Link>
            </NeoCard>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
