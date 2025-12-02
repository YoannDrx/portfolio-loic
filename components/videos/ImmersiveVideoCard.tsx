'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Play, X, Calendar, Film } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

interface Video {
  id: string;
  img: string;
  type: string;
  videoId: string;
  title: string;
  date: string;
}

interface ImmersiveVideoCardProps {
  video: Video;
  index: number;
  onHover?: (index: number | null) => void;
}

/* ============================================
   TYPE CONFIGURATIONS
   ============================================ */

type VideoType = 'OriginalMusic' | 'Sync' | 'MusicToPicture';

const typeConfig: Record<
  VideoType,
  {
    translationKey: string;
    color: 'cyan' | 'magenta' | 'purple';
    shadow: string;
    border: string;
    badge: string;
    accent: string;
    gradient: string;
    bgGlow: string;
  }
> = {
  OriginalMusic: {
    translationKey: 'filterOriginalMusic',
    color: 'cyan',
    shadow: 'hover:shadow-[0_10px_40px_rgba(0,240,255,0.3)]',
    border: 'hover:border-neon-cyan/50',
    badge: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
    accent: 'text-neon-cyan',
    gradient: 'from-neon-cyan/20 to-transparent',
    bgGlow: 'bg-neon-cyan',
  },
  Sync: {
    translationKey: 'filterSync',
    color: 'magenta',
    shadow: 'hover:shadow-[0_10px_40px_rgba(255,0,110,0.3)]',
    border: 'hover:border-neon-magenta/50',
    badge: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
    accent: 'text-neon-magenta',
    gradient: 'from-neon-magenta/20 to-transparent',
    bgGlow: 'bg-neon-magenta',
  },
  MusicToPicture: {
    translationKey: 'filterMusicToPicture',
    color: 'purple',
    shadow: 'hover:shadow-[0_10px_40px_rgba(139,92,246,0.3)]',
    border: 'hover:border-neon-purple/50',
    badge: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
    accent: 'text-neon-purple',
    gradient: 'from-neon-purple/20 to-transparent',
    bgGlow: 'bg-neon-purple',
  },
};

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ImmersiveVideoCard({ video, index, onHover }: ImmersiveVideoCardProps) {
  const t = useTranslations('videos');
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoType = (video.type as VideoType) || 'OriginalMusic';
  const config = typeConfig[videoType] || typeConfig.OriginalMusic;

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  return (
    <>
      <motion.article
        className="group h-full"
        initial={{ opacity: 0, y: 60, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.33, 1, 0.68, 1],
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transformPerspective: 1000 }}
      >
        <motion.div
          className={cn(
            'relative h-full overflow-hidden rounded-2xl cursor-pointer',
            'bg-glass backdrop-blur-sm',
            'border border-[var(--glass-border)]',
            'transition-all duration-500',
            config.shadow,
            config.border
          )}
          whileHover={{
            y: -8,
            scale: 1.02,
            rotateY: index % 2 === 0 ? 2 : -2,
            rotateX: -2,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handlePlayClick}
        >
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden">
            {/* Thumbnail Image */}
            <Image
              src={video.img || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              fill
              className={cn(
                'object-cover transition-all duration-700',
                'group-hover:scale-110 group-hover:blur-[2px]'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                config.gradient
              )}
            />

            {/* Play Button - center */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.7 }}
              animate={isHovered ? { opacity: 1, scale: 1.1 } : { opacity: 0.7, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={cn(
                  'flex items-center justify-center w-16 h-16 rounded-full',
                  'backdrop-blur-md border',
                  config.badge
                )}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: isHovered
                    ? `0 0 30px ${config.color === 'cyan' ? 'rgba(0,240,255,0.5)' : config.color === 'magenta' ? 'rgba(255,0,110,0.5)' : 'rgba(139,92,246,0.5)'}`
                    : 'none',
                }}
              >
                <Play className="w-7 h-7 ml-1" fill="currentColor" />
              </motion.div>
            </motion.div>

            {/* Type Badge - top left */}
            <motion.div
              className={cn(
                'absolute top-4 left-4 px-3 py-1.5 rounded-lg',
                'text-xs font-bold uppercase tracking-wider',
                'border backdrop-blur-md',
                config.badge
              )}
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="flex items-center gap-1.5">
                <Film className="w-3 h-3" />
                {t(config.translationKey)}
              </span>
            </motion.div>

            {/* Floating accent line */}
            <motion.div
              className={cn('absolute bottom-0 left-0 h-1 rounded-full', config.bgGlow)}
              initial={{ width: 0 }}
              animate={isHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-bold text-lg mb-3 tracking-tight line-clamp-2">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-foreground group-hover:to-foreground transition-all duration-300">
                {video.title}
              </span>
            </h3>

            {/* Metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border-subtle)]">
              {/* Date */}
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3 h-3" style={{ color: config.color === 'cyan' ? '#00F0FF' : config.color === 'magenta' ? '#FF006E' : '#8B5CF6' }} />
                <span>{video.date}</span>
              </div>

              {/* Watch CTA */}
              <motion.div
                className={cn('flex items-center gap-2 text-sm font-medium', config.accent)}
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="text-xs">{t('card.watch')}</span>
                <Play className="w-3 h-3" fill="currentColor" />
              </motion.div>
            </div>
          </div>

          {/* Cosmic glow effect on hover */}
          <motion.div
            className={cn(
              'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100',
              `bg-gradient-to-r from-transparent via-${config.color === 'cyan' ? 'neon-cyan' : config.color === 'magenta' ? 'neon-magenta' : 'neon-purple'}/20 to-transparent`,
              'blur-xl -z-10 transition-opacity duration-500'
            )}
          />
        </motion.div>
      </motion.article>

      {/* Video Modal */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseVideo}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-6 right-6 p-3 rounded-full bg-[var(--glass-active)] hover:bg-[var(--glass-active)] transition-colors border border-[var(--glass-border-strong)]"
              onClick={handleCloseVideo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {/* Video Container */}
            <motion.div
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: `0 0 100px ${config.color === 'cyan' ? 'rgba(0,240,255,0.3)' : config.color === 'magenta' ? 'rgba(255,0,110,0.3)' : 'rgba(139,92,246,0.3)'}`,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>

            {/* Video Title */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-foreground mb-2">{video.title}</h3>
              <span className={cn('text-sm', config.accent)}>{t(config.translationKey)}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
