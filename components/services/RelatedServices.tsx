'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        'bg-obsidian-800/80 backdrop-blur-md',
        'border border-neon-cyan/30',
        'flex items-center justify-center',
        'text-white hover:text-neon-cyan',
        'transition-all duration-300',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        direction === 'prev' ? '-left-4 lg:-left-6' : '-right-4 lg:-right-6'
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

  // Filter related services (exclude current)
  const relatedServices = services.filter((service) => service.id !== currentServiceId);

  // Calculate items per view based on screen size (handled via CSS)
  const itemsPerView = 3; // We show 1 on mobile, 2 on tablet, 3 on desktop via CSS

  const maxIndex = Math.max(0, relatedServices.length - 1);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  if (relatedServices.length === 0) {
    return null;
  }

  // Get visible services (3 at a time, sliding window)
  const getVisibleServices = () => {
    const startIndex = currentIndex;
    return relatedServices.slice(startIndex, startIndex + itemsPerView);
  };

  const visibleServices = getVisibleServices();
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < relatedServices.length - itemsPerView;

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
        <div className="relative px-8 lg:px-12">
          {/* Navigation Buttons */}
          {relatedServices.length > itemsPerView && (
            <>
              <NavButton direction="prev" onClick={goToPrev} disabled={!canGoPrev} />
              <NavButton direction="next" onClick={goToNext} disabled={!canGoNext} />
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {visibleServices.map((service, index) => (
                  <CosmicServiceCard
                    key={service.id}
                    service={service}
                    locale={locale}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {relatedServices.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: relatedServices.length - itemsPerView + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'bg-neon-cyan w-6'
                      : 'bg-white/30 hover:bg-white/50'
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
