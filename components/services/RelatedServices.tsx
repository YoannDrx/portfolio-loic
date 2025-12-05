'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { PanInfo } from 'framer-motion';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CosmicServiceCard from './CosmicServiceCard';
import { ImmersiveTitle } from '@/components/immersive/ImmersivePage';
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

interface RelatedServicesProps {
  services: Service[];
  currentServiceId: string;
  locale: string;
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
        'border border-neon-cyan/30',
        'flex items-center justify-center',
        'text-foreground hover:text-neon-cyan',
        'transition-all duration-300',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        direction === 'prev' ? 'left-0 lg:-left-6' : 'right-0 lg:-right-6'
      )}
      whileHover={!disabled ? { scale: 1.1, borderColor: 'rgba(0, 240, 255, 0.6)' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={!disabled ? {
        boxShadow: [
          '0 0 0 rgba(0, 240, 255, 0)',
          '0 0 20px rgba(0, 240, 255, 0.3)',
          '0 0 0 rgba(0, 240, 255, 0)',
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

export default function RelatedServices({
  services,
  currentServiceId,
  locale,
}: RelatedServicesProps) {
  const t = useTranslations('services.detail');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  // Filter related services (exclude current)
  const relatedServices = services.filter((service) => service.id !== currentServiceId);

  // Constants
  const GAP = 32; // gap-8 = 2rem = 32px

  // Calculate dimensions
  const cardWidth = containerWidth > 0
    ? (containerWidth - GAP * (itemsPerView - 1)) / itemsPerView
    : 300;
  const slideWidth = cardWidth + GAP;
  const maxIndex = Math.max(0, relatedServices.length - itemsPerView);

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

  if (relatedServices.length === 0) {
    return null;
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;
  const showNavigation = relatedServices.length > itemsPerView;

  return (
    <section className="py-16 lg:py-24">
      <div className="container-custom">
        {/* Section Title */}
        <ImmersiveTitle
          subtitle="DÉCOUVRIR"
          gradient="cyan"
          align="center"
          className="mb-12"
        >
          {t('relatedServices')}
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
              {relatedServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="flex-shrink-0"
                  style={{ width: cardWidth > 0 ? cardWidth : 'auto' }}
                >
                  <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                    <CosmicServiceCard
                      service={service}
                      locale={locale}
                      index={index}
                    />
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
                      ? 'bg-neon-cyan w-6'
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
