'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

interface Service {
  id: string;
  no: string;
  title: string;
  text: string;
  largeImg: string;
  largeTitle: string;
  poster: string;
  date: string;
  author: string;
  fullDescription: string;
  descriptionsFr: string;
  descriptionsEn: string;
}

interface CosmicServiceCardProps {
  service: Service;
  locale: string;
  index: number;
  onHover?: (index: number | null) => void;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function CosmicServiceCard({
  service,
  locale,
  index,
  onHover,
}: CosmicServiceCardProps) {
  const t = useTranslations('services');
  const [isHovered, setIsHovered] = useState(false);

  // Alternate glow colors based on index
  const glowColors = ['cyan', 'purple', 'lime', 'magenta'] as const;
  const glowColor = glowColors[index % glowColors.length];

  const glowConfig = {
    cyan: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(0,240,255,0.25)]',
      border: 'hover:border-neon-cyan/50',
      badge: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30',
      accent: 'text-neon-cyan',
      gradient: 'from-neon-cyan/20 to-transparent',
    },
    purple: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(139,92,246,0.25)]',
      border: 'hover:border-neon-purple/50',
      badge: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
      accent: 'text-neon-purple',
      gradient: 'from-neon-purple/20 to-transparent',
    },
    lime: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(213,255,10,0.25)]',
      border: 'hover:border-neon-lime/50',
      badge: 'bg-neon-lime/20 text-neon-lime border-neon-lime/30',
      accent: 'text-neon-lime',
      gradient: 'from-neon-lime/20 to-transparent',
    },
    magenta: {
      shadow: 'hover:shadow-[0_10px_40px_rgba(255,0,110,0.25)]',
      border: 'hover:border-neon-magenta/50',
      badge: 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/30',
      accent: 'text-neon-magenta',
      gradient: 'from-neon-magenta/20 to-transparent',
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
      <Link href={`/${locale}/services/${service.id}`} className="block h-full">
        <motion.div
          className={cn(
            'relative h-full overflow-hidden rounded-2xl',
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
        >
          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            {/* Image */}
            <Image
              src={service.largeImg || service.poster || '/img/service-placeholder.jpg'}
              alt={service.title}
              fill
              className={cn(
                'object-cover transition-all duration-700',
                'group-hover:scale-110 group-hover:blur-[2px]'
              )}
            />

            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                config.gradient
              )}
            />

            {/* Number Badge */}
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
              NO.{service.no}
            </motion.div>

            {/* Floating accent line */}
            <motion.div
              className={cn('absolute bottom-0 left-0 h-1 rounded-full', config.accent.replace('text-', 'bg-'))}
              initial={{ width: 0 }}
              animate={isHovered ? { width: '100%' } : { width: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Title */}
            <h3
              className={cn(
                'text-xl font-bold mb-3 tracking-tight',
                'transition-colors duration-300',
                `group-hover:${config.accent.replace('text-', 'text-')}`
              )}
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
                {service.title}
              </span>
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
              {service.text}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border-subtle)]">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Layers className="w-4 h-4" />
                <span className="uppercase tracking-wider">Service</span>
              </div>

              {/* CTA */}
              <motion.div
                className={cn(
                  'flex items-center gap-2 text-sm font-medium',
                  config.accent
                )}
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span>{t('seeMore')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Cosmic glow effect on hover */}
          <motion.div
            className={cn(
              'absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100',
              'bg-gradient-to-r',
              `from-transparent ${config.gradient.replace('to-transparent', 'via-current')} to-transparent`,
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
