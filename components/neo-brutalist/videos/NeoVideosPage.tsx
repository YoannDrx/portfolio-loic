"use client";

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ArrowRight, Film } from 'lucide-react';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { BrutalistButton } from '../ui/BrutalistButton';
import { NeoTag } from '../ui/NeoTag';
import { NeoVideoCard } from './NeoVideoCard';
import { Link } from '@/i18n/routing';

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  type: string;
  date: string;
  img?: string | null;
}

interface NeoVideosPageProps {
  videos: VideoItem[];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
};

export const NeoVideosPage: React.FC<NeoVideosPageProps> = ({ videos }) => {
  const t = useTranslations('videos');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Extract unique types
  const types = useMemo(() => {
    const typeSet = new Set<string>();
    videos.forEach(video => {
      if (video.type) typeSet.add(video.type);
    });
    return Array.from(typeSet).sort();
  }, [videos]);

  // Filter videos by type
  const filteredVideos = useMemo(() => {
    if (!selectedType) return videos;
    return videos.filter(video => video.type === selectedType);
  }, [videos, selectedType]);

  // Stats
  const stats = useMemo(() => ({
    total: videos.length,
    categories: types.length,
    syncPlacements: videos.filter(v => v.type?.toLowerCase().includes('sync')).length,
  }), [videos, types]);

  const getTypeLabel = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('original')) return t('filterOriginalMusic');
    if (lowerType.includes('sync')) return t('filterSync');
    if (lowerType.includes('music to picture') || lowerType.includes('m2p')) return t('filterMusicToPicture');
    return type;
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-20">
        {/* Hero - Light variant */}
        <section className="min-h-[50vh] flex flex-col justify-center py-20 md:py-32 px-4 md:px-8 bg-neo-bg">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                05
              </span>
              <NeoTag variant="default">{t('hero.badge')}</NeoTag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[12vw] md:text-[8vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase text-neo-text"
            >
              {t('hero.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg max-w-2xl text-neo-text/60"
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <BrutalistButton
                variant="primary"
                size="lg"
                icon={<Video className="w-5 h-5" />}
                onClick={() => document.getElementById('videos-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.cta')}
              </BrutalistButton>
              <Link href="/contact">
                <BrutalistButton variant="secondary" size="lg">
                  {t('hero.ctaSecondary')}
                </BrutalistButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: stats.total.toString(), label: t('stats.total') },
                { val: stats.categories.toString(), label: t('stats.categories') },
                { val: stats.syncPlacements.toString(), label: t('stats.syncPlacements') },
                { val: '20+', label: t('stats.brands') },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-neo-accent tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest mt-2 opacity-60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b-2 border-neo-border sticky top-[72px] bg-neo-bg z-30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                  !selectedType
                    ? 'bg-neo-accent text-neo-text-inverse border-neo-accent'
                    : 'bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent'
                }`}
              >
                {t('filterAll')} ({videos.length})
              </button>
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                    selectedType === type
                      ? 'bg-neo-accent text-neo-text-inverse border-neo-accent'
                      : 'bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent'
                  }`}
                >
                  {getTypeLabel(type)} ({videos.filter(v => v.type === type).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section id="videos-grid" className="py-16 bg-neo-bg">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType || 'all'}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {filteredVideos.length > 0 ? (
                  filteredVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      variants={fadeInUp}
                      layout
                    >
                      <NeoVideoCard video={video} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    variants={fadeInUp}
                    className="col-span-full text-center py-16"
                  >
                    <Film className="w-16 h-16 mx-auto mb-4 text-neo-text/20" />
                    <p className="font-mono text-lg text-neo-text/60">{t('noVideos')}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-neo-bg border-t-[10px] border-neo-accent">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Video className="w-16 h-16 mx-auto mb-6 text-neo-accent" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neo-text mb-4">
                {t('videosCta.title')}
              </h2>
              <p className="font-mono text-lg text-neo-text/60 max-w-2xl mx-auto mb-8">
                {t('videosCta.description')}
              </p>
              <div className="flex justify-center">
                <Link href="/contact">
                  <BrutalistButton
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {t('videosCta.button')}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoVideosPage;
