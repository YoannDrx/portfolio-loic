'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, Disc, Headphones, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

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
  collabName?: string;
  collabLink?: string;
  descriptions?: string;
}

interface ImmersiveAlbumCardProps {
  album: Album;
  index: number;
  onHover?: (index: number | null) => void;
  /** Compact variant for related albums */
  compact?: boolean;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ImmersiveAlbumCard({
  album,
  index,
  onHover,
  compact = false,
}: ImmersiveAlbumCardProps) {
  const t = useTranslations('albums');
  const [isHovered, setIsHovered] = useState(false);

  // Alternate glow colors based on index - emphasis on magenta
  const glowColors = ['magenta', 'purple', 'cyan', 'magenta'] as const;
  const glowColor = glowColors[index % glowColors.length];

  const glowConfig = {
    cyan: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(0,240,255,0.25)]',
      border: 'hover:border-neon-cyan/50',
      badge: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      accent: 'text-neon-cyan',
      gradient: 'from-neon-cyan/20 to-transparent',
      bgGlow: 'bg-neon-cyan',
    },
    purple: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(139,92,246,0.25)]',
      border: 'hover:border-neon-purple/50',
      badge: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      accent: 'text-neon-purple',
      gradient: 'from-neon-purple/20 to-transparent',
      bgGlow: 'bg-neon-purple',
    },
    magenta: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(255,0,110,0.3)]',
      border: 'hover:border-neon-magenta/50',
      badge: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
      accent: 'text-neon-magenta',
      gradient: 'from-neon-magenta/20 to-transparent',
      bgGlow: 'bg-neon-magenta',
    },
  };

  const config = glowConfig[glowColor];

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover?.(null);
  };

  return (
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
      <Link href={{ pathname: '/albums/[id]', params: { id: album.id } }} className="block h-full">
        <motion.div
          className={cn(
            'relative h-full overflow-hidden rounded-2xl',
            'bg-obsidian-900/60 backdrop-blur-sm',
            'border border-white/10',
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
        >
          {/* Image Container */}
          <div className={cn('relative overflow-hidden', compact ? 'aspect-square' : 'aspect-square')}>
            {/* Image */}
            <Image
              src={album.img || album.poster}
              alt={album.title}
              fill
              className={cn(
                'object-cover transition-all duration-700',
                'group-hover:scale-110 group-hover:blur-[2px]'
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                config.gradient
              )}
            />

            {/* Listen Badge - appears on hover */}
            <motion.div
              className={cn(
                'absolute top-4 right-4 px-3 py-1.5 rounded-lg',
                'text-xs font-bold uppercase tracking-wider',
                'border backdrop-blur-md',
                'opacity-0 group-hover:opacity-100 transition-all duration-500',
                'translate-y-2 group-hover:translate-y-0',
                config.badge
              )}
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="flex items-center gap-1.5">
                <Headphones className="w-3 h-3" />
                {t('card.listen')}
              </span>
            </motion.div>

            {/* Genre Badge - bottom left */}
            <motion.div
              className={cn(
                'absolute bottom-4 left-4 px-3 py-1.5 rounded-lg',
                'text-xs font-bold uppercase tracking-wider',
                'border backdrop-blur-md',
                config.badge
              )}
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="flex items-center gap-1.5">
                <Disc className="w-3 h-3" />
                {album.style}
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
          <div className={cn('p-5', compact && 'p-4')}>
            {/* Title */}
            <h3
              className={cn(
                'font-bold mb-3 tracking-tight uppercase',
                'transition-colors duration-300 line-clamp-2',
                compact ? 'text-base' : 'text-lg'
              )}
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
                {album.title}
              </span>
            </h3>

            {/* Metadata */}
            <div className="flex flex-col gap-2 mb-4">
              {/* Date */}
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-neon-magenta" />
                <span>{album.date}</span>
              </div>

              {/* Collaborators */}
              {album.collabName && !compact && (
                <div className="flex items-start gap-2 text-xs font-medium text-gray-400">
                  <Users className="w-3 h-3 flex-shrink-0 mt-0.5 text-neon-purple" />
                  <span className="line-clamp-1">{album.collabName}</span>
                </div>
              )}
            </div>

            {/* Footer with CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Disc className="w-3 h-3" />
                <span className="uppercase tracking-wider">Album</span>
              </div>

              {/* CTA Arrow */}
              <motion.div
                className={cn('flex items-center gap-2 text-sm font-medium', config.accent)}
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="text-xs">{t('card.viewMore')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Cosmic glow effect on hover */}
          <motion.div
            className={cn(
              'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100',
              'bg-gradient-to-r from-transparent via-neon-magenta/20 to-transparent',
              'blur-xl -z-10 transition-opacity duration-500'
            )}
            animate={
              isHovered
                ? {
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }
                : {}
            }
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
      </Link>
    </motion.article>
  );
}
