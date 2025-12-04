'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTranslations } from 'next-intl';

export default function SoundCloudPlayer() {
  const t = useTranslations('home.soundcloud');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="soundcloud" className="py-32">
      {/* Animated Section Title - Same pattern as other sections */}
      <motion.div
        ref={ref}
        className="mb-16 flex justify-between items-end border-b border-[var(--glass-border)] pb-4 relative"
      >
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: 100, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="text-4xl md:text-6xl font-bold tracking-tighter"
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
          />
        </div>
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground font-mono hidden md:block"
        >
          {t('subtitle')}
        </motion.span>
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-green via-neon-lime to-transparent"
          initial={{ width: 0 }}
          animate={isInView ? { width: '100%' } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
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
        <div className="px-4 py-2 text-xs text-muted-foreground text-center bg-glass-subtle">
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
