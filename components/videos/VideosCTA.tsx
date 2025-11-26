'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Clapperboard, Film } from 'lucide-react';
import MagneticButton from '@/components/immersive/MagneticButton';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

interface VideosCTAProps {
  locale: string;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function VideosCTA({ locale }: VideosCTAProps) {
  const t = useTranslations('videos');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-20 lg:py-32">
      <div className="container-custom">
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Animated border glow - cyan to purple theme */}
          <motion.div
            className="absolute -inset-1 rounded-3xl opacity-50"
            style={{
              background:
                'linear-gradient(90deg, #00F0FF, #8B5CF6, #FF006E, #00F0FF)',
              backgroundSize: '300% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Inner card */}
          <div
            className={cn(
              'relative rounded-3xl overflow-hidden',
              'bg-obsidian-950/90 backdrop-blur-xl',
              'border border-white/10'
            )}
          >
            {/* Background effects */}
            <div className="absolute inset-0">
              {/* Gradient mesh - cinema themed */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'radial-gradient(ellipse at 20% 50%, rgba(0, 240, 255, 0.2), transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.2), transparent 50%)',
                }}
              />

              {/* Animated film icons */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    rotate: [0, 15, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut',
                  }}
                >
                  <Film className="w-4 h-4 text-neon-cyan/40" />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              {/* Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 mb-8"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 240, 255, 0.2)',
                    '0 0 40px rgba(0, 240, 255, 0.4)',
                    '0 0 20px rgba(0, 240, 255, 0.2)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Clapperboard className="w-8 h-8 text-neon-cyan" />
              </motion.div>

              {/* Title */}
              <motion.h2
                className={cn(
                  'text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6',
                  'bg-gradient-to-r from-white via-neon-cyan to-white bg-clip-text text-transparent'
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t('videosCta.title')}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('videosCta.description')}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <MagneticButton
                  href={`/${locale}/contact`}
                  color="cyan"
                  variant="solid"
                  size="xl"
                  glow
                  rightIcon={Clapperboard}
                >
                  {t('videosCta.button')}
                </MagneticButton>
              </motion.div>

              {/* Decorative orbits */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Orbit 1 */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-[400px] h-[400px] border border-white/5 rounded-full"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-neon-cyan -translate-x-1/2 -translate-y-1/2" />
                </motion.div>

                {/* Orbit 2 */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-[550px] h-[550px] border border-white/5 rounded-full"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 w-3 h-3 rounded-full bg-neon-purple -translate-x-1/2 -translate-y-1/2" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
