'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImmersiveAlbumCard from './ImmersiveAlbumCard';
import { ImmersiveTitle } from '@/components/immersive/ImmersivePage';
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
}

interface RelatedAlbumsProps {
  albums: Album[];
  currentAlbumId: string;
  currentAlbumStyle: string;
}

/* ============================================
   CAROUSEL NAVIGATION BUTTON
   ============================================ */

interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

function NavButton({ direction, onClick, disabled }: NavButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-20',
        'w-12 h-12 rounded-full',
        'bg-glass-strong backdrop-blur-md',
        'border border-neon-magenta/30',
        'flex items-center justify-center',
        'text-foreground hover:text-neon-magenta',
        'transition-all duration-300',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        direction === 'prev' ? 'left-0 lg:-left-6' : 'right-0 lg:-right-6'
      )}
      whileHover={!disabled ? { scale: 1.1, borderColor: 'rgba(255, 0, 110, 0.6)' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={!disabled ? {
        boxShadow: [
          '0 0 0 rgba(255, 0, 110, 0)',
          '0 0 20px rgba(255, 0, 110, 0.3)',
          '0 0 0 rgba(255, 0, 110, 0)',
        ],
      } : {}}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function RelatedAlbums({
  albums,
  currentAlbumId,
  currentAlbumStyle,
}: RelatedAlbumsProps) {
  const t = useTranslations('albums.detail');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Filter related albums (same genre first, then others, exclude current)
  const sameStyleAlbums = albums.filter(
    (album) => album.id !== currentAlbumId && album.style === currentAlbumStyle
  );
  const otherAlbums = albums.filter(
    (album) => album.id !== currentAlbumId && album.style !== currentAlbumStyle
  );

  // Combine: same style first, then others
  const relatedAlbums = [...sameStyleAlbums, ...otherAlbums];

  // Constants
  const GAP = 32; // gap-8 = 2rem = 32px

  // Calculate dimensions
  const cardWidth = containerWidth > 0
    ? (containerWidth - GAP * (itemsPerView - 1)) / itemsPerView
    : 300;
  const slideWidth = cardWidth + GAP;
  const maxIndex = Math.max(0, relatedAlbums.length - itemsPerView);

  // Responsive items per view and container width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      // Responsive items per view
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animate to current index
  useEffect(() => {
    if (containerWidth > 0) {
      controls.start({
        x: -currentIndex * slideWidth,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    }
  }, [currentIndex, slideWidth, controls, containerWidth]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  // Handle drag end with snap
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;
      const threshold = 50; // px minimum pour changer de slide

      let direction = 0;
      if (Math.abs(velocity) > 500) {
        // Fast swipe - use velocity direction
        direction = velocity > 0 ? -1 : 1;
      } else if (Math.abs(offset) > threshold) {
        // Slow drag - use offset direction
        direction = offset > 0 ? -1 : 1;
      }

      const newIndex = Math.max(0, Math.min(maxIndex, currentIndex + direction));
      setCurrentIndex(newIndex);

      // Delay disabling isDragging to prevent accidental clicks
      setTimeout(() => setIsDragging(false), 100);
    },
    [currentIndex, maxIndex]
  );

  if (relatedAlbums.length === 0) {
    return null;
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const showNavigation = relatedAlbums.length > itemsPerView;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-custom">
        {/* Section Title */}
        <ImmersiveTitle
          subtitle={currentAlbumStyle.toUpperCase()}
          gradient="magenta"
          align="center"
          className="mb-12"
        >
          {t('relatedAlbums')}
        </ImmersiveTitle>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              <NavButton direction="prev" onClick={goToPrev} disabled={!canGoPrev} />
              <NavButton direction="next" onClick={goToNext} disabled={!canGoNext} />
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={containerRef}
            className="overflow-hidden px-1 py-2"
          >
            <motion.div
              className={cn(
                'flex',
                showNavigation && 'cursor-grab active:cursor-grabbing'
              )}
              style={{
                gap: GAP,
                x,
              }}
              drag={showNavigation ? 'x' : false}
              dragConstraints={{
                left: -maxIndex * slideWidth,
                right: 0,
              }}
              dragElastic={0.1}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              animate={controls}
            >
              {relatedAlbums.map((album, index) => (
                <motion.div
                  key={album.id}
                  className="flex-shrink-0"
                  style={{ width: cardWidth > 0 ? cardWidth : 'auto' }}
                >
                  <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                    <ImmersiveAlbumCard album={album} index={index} compact />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          {showNavigation && maxIndex > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'bg-neon-magenta w-6'
                      : 'bg-foreground/30 hover:bg-foreground/50 w-2'
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
