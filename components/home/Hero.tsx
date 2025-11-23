'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import AudioVisualizationScene from '../three/AudioVisualizationScene';
import ThreeLoader from '../ui/ThreeLoader';

export default function Hero() {
  const t = useTranslations('home');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simulate loading time for Three.js scene
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-100 via-white to-gray-50 dark:from-obsidian dark:via-obsidian-50 dark:to-obsidian transition-colors duration-300">
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-40 transition-opacity duration-300">
        {loading && <ThreeLoader />}
        {mounted && <AudioVisualizationScene />}
      </div>

      {/* Gradient Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white dark:via-obsidian/20 dark:to-obsidian z-10 pointer-events-none transition-colors duration-300" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-white dark:to-obsidian z-10 pointer-events-none transition-colors duration-300" />

      {/* Content */}
      <div className="container-custom relative z-20 py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="mb-6">
              <span className="block text-7xl md:text-8xl lg:text-9xl font-black text-gradient-neon mb-4">
                {t('title')}
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl font-light text-neon-cyan">
                {t('subtitle')}
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300"
          >
            {t('description')}{' '}
            <span className="whitespace-nowrap">{t('yearsExperience', { years: 15 })}</span>.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-5xl font-black text-gradient-neon mb-2">16</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">{t('stats.albums')}</div>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent" />
            <div className="text-center">
              <div className="text-5xl font-black text-gradient-neon mb-2">34</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {t('stats.audiovisualProjects')}
              </div>
            </div>
            <div className="w-px bg-gradient-to-b from-transparent via-neon-cyan/30 to-transparent" />
            <div className="text-center">
              <div className="text-5xl font-black text-gradient-neon mb-2">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">
                {t('stats.collaborations')}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/albums"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_40px_rgba(0,240,255,0.8)] transition-all duration-300"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t('cta.listenAlbums')}</span>
            </Link>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-neon-cyan rounded-lg font-semibold text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300"
            >
              <Music className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{t('cta.workTogether')}</span>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-xs uppercase tracking-wider">{t('scroll')}</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
