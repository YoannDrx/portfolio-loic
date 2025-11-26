'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FileText, Music, Headphones, Sliders, Rocket, Sparkles, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

interface ProcessStep {
  key: string;
  icon: LucideIcon;
  borderColor: string;
  textColor: string;
  bgColor: string;
  glowColor: string;
}

/* ============================================
   PROCESS STEP COMPONENT
   ============================================ */

interface StepCardProps {
  step: ProcessStep;
  index: number;
  totalSteps: number;
  t: ReturnType<typeof useTranslations>;
}

function StepCard({ step, index, totalSteps, t }: StepCardProps) {
  const Icon = step.icon;
  const isLast = index === totalSteps - 1;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      {/* Icon Circle */}
      <motion.div
        className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-obsidian-900/80 backdrop-blur-sm border-2 transition-all duration-500 ${step.borderColor}`}
        whileHover={{
          scale: 1.1,
          boxShadow: step.glowColor,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Icon className={`w-7 h-7 md:w-8 md:h-8 ${step.textColor}`} />

        {/* Pulsing glow */}
        <motion.div
          className={`absolute inset-0 rounded-full opacity-30 ${step.bgColor}`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        />
      </motion.div>

      {/* Step Number */}
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-lime text-obsidian-950 flex items-center justify-center text-xs font-bold"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 500 }}
      >
        {index + 1}
      </motion.div>

      {/* Content */}
      <div className="mt-6 text-center max-w-[140px]">
        <h4 className="text-white font-semibold text-sm md:text-base mb-1">
          {t(`process.${step.key}.title`)}
        </h4>
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
          {t(`process.${step.key}.description`)}
        </p>
      </div>

      {/* Connector Line (horizontal on desktop, hidden on mobile) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-8 md:top-10 left-[calc(50%+40px)] md:left-[calc(50%+50px)] w-[calc(100%-20px)]">
          <motion.div
            className="h-0.5 bg-gradient-to-r from-white/20 via-neon-cyan/30 to-white/20"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.4 }}
          />
          {/* Star connector */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.6, type: 'spring', stiffness: 400 }}
          >
            <Sparkles className="w-4 h-4 text-neon-lime" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ServiceProcess() {
  const t = useTranslations('services');
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  const steps: ProcessStep[] = [
    {
      key: 'brief',
      icon: FileText,
      borderColor: 'border-neon-cyan',
      textColor: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan',
      glowColor: '0 0 30px rgba(0, 240, 255, 0.5)',
    },
    {
      key: 'composition',
      icon: Music,
      borderColor: 'border-neon-lime',
      textColor: 'text-neon-lime',
      bgColor: 'bg-neon-lime',
      glowColor: '0 0 30px rgba(213, 255, 10, 0.5)',
    },
    {
      key: 'production',
      icon: Headphones,
      borderColor: 'border-neon-purple',
      textColor: 'text-neon-purple',
      bgColor: 'bg-neon-purple',
      glowColor: '0 0 30px rgba(139, 92, 246, 0.5)',
    },
    {
      key: 'mixing',
      icon: Sliders,
      borderColor: 'border-neon-magenta',
      textColor: 'text-neon-magenta',
      bgColor: 'bg-neon-magenta',
      glowColor: '0 0 30px rgba(255, 0, 110, 0.5)',
    },
    {
      key: 'delivery',
      icon: Rocket,
      borderColor: 'border-neon-lime',
      textColor: 'text-neon-lime',
      bgColor: 'bg-neon-lime',
      glowColor: '0 0 30px rgba(213, 255, 10, 0.5)',
    },
  ];

  return (
    <section ref={containerRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.span
            className="inline-block text-neon-cyan text-sm uppercase tracking-[0.3em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            {t('process.subtitle')}
          </motion.span>

          <motion.h2
            className={cn(
              'text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter',
              'bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent'
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('process.title')}
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            className="h-1 w-32 mx-auto mt-6 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-lime"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>

        {/* Process Timeline - Desktop */}
        <div className="hidden lg:block relative">
          {/* Background line */}
          <div className="absolute top-10 left-0 right-0 h-0.5 bg-white/10" />

          {/* Animated progress line */}
          <motion.div
            className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-lime"
            style={{ width: lineWidth }}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <StepCard
                key={step.key}
                step={step}
                index={index}
                totalSteps={steps.length}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Process Timeline - Mobile (vertical) */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  className="relative flex items-start gap-6 pl-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-obsidian-900/80 backdrop-blur-sm border-2 ${step.borderColor}`}
                  >
                    <Icon className={`w-5 h-5 ${step.textColor}`} />
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      Étape {index + 1}
                    </span>
                    <h4 className="text-white font-semibold text-lg mt-1">
                      {t(`process.${step.key}.title`)}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      {t(`process.${step.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
