'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTranslations } from 'next-intl';
import { Music2 } from 'lucide-react';

export default function SoundCloudPlayer() {
  const t = useTranslations('home.soundcloud');

  return (
    <section id="soundcloud" className="py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-between items-end mb-16 border-b border-white/10 pb-4"
      >
        <div>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-2"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
          <span className="text-gray-500 font-mono text-sm md:text-base">{t('subtitle')}</span>
        </div>
        <Music2 className="w-8 h-8 text-neon-green hidden md:block" />
      </motion.div>

      <GlassCard hover="glow" glowColor="cyan" className="p-0 overflow-hidden border-neon-green/50">
        <iframe
          width="100%"
          height="450"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1342377886%3Fsecret_token%3Ds-0WB6x1mRFeB&color=%2310b981&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
          className="w-full"
        />
        <div className="px-4 py-2 text-xs text-gray-500 text-center bg-obsidian/50">
          <a
            href="https://soundcloud.com/loic-ghanem"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neon-cyan transition-colors"
          >
            {t('follow')}
          </a>
        </div>
      </GlassCard>
    </section>
  );
}
