'use client';

import { useRef, Suspense } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

type GradientColor = 'lime' | 'cyan' | 'magenta' | 'purple' | 'emerald' | 'teal';

interface FloatingOrbProps {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay?: number;
}

interface ImmersivePageProps {
  children: ReactNode;
  /** 3D scene component to render in background */
  scene?: ReactNode;
  /** Primary gradient color for the page */
  gradient?: GradientColor;
  /** Show floating orbs in background */
  showOrbs?: boolean;
  /** Show scroll progress indicator */
  showScrollProgress?: boolean;
  /** Custom class for the content container */
  className?: string;
  /** Reduce overlay opacity to show more of the 3D scene */
  sceneVisibility?: 'low' | 'medium' | 'high';
  /** Enable parallax on hero section */
  parallaxHero?: boolean;
}

/* ============================================
   GRADIENT CONFIGURATIONS
   ============================================ */

const gradientConfigs: Record<GradientColor, {
  orbs: string[];
  text: string;
  accent: string;
  glow: string;
}> = {
  lime: {
    orbs: ['rgba(213, 255, 10, 0.15)', 'rgba(0, 240, 255, 0.1)', 'rgba(255, 0, 110, 0.08)'],
    text: 'from-neon-lime via-neon-cyan to-neon-lime',
    accent: 'text-neon-lime',
    glow: 'shadow-[0_0_60px_rgba(213,255,10,0.3)]',
  },
  cyan: {
    orbs: ['rgba(0, 240, 255, 0.15)', 'rgba(181, 0, 255, 0.1)', 'rgba(213, 255, 10, 0.08)'],
    text: 'from-neon-cyan via-neon-purple to-neon-cyan',
    accent: 'text-neon-cyan',
    glow: 'shadow-[0_0_60px_rgba(0,240,255,0.3)]',
  },
  magenta: {
    orbs: ['rgba(255, 0, 110, 0.15)', 'rgba(181, 0, 255, 0.12)', 'rgba(0, 240, 255, 0.08)'],
    text: 'from-neon-magenta via-neon-purple to-neon-magenta',
    accent: 'text-neon-magenta',
    glow: 'shadow-[0_0_60px_rgba(255,0,110,0.3)]',
  },
  purple: {
    orbs: ['rgba(181, 0, 255, 0.15)', 'rgba(255, 0, 110, 0.1)', 'rgba(0, 240, 255, 0.08)'],
    text: 'from-neon-purple via-neon-magenta to-neon-purple',
    accent: 'text-neon-purple',
    glow: 'shadow-[0_0_60px_rgba(181,0,255,0.3)]',
  },
  emerald: {
    orbs: ['rgba(0, 193, 139, 0.15)', 'rgba(0, 153, 152, 0.1)', 'rgba(213, 255, 10, 0.08)'],
    text: 'from-emerald-400 via-teal-400 to-emerald-400',
    accent: 'text-emerald-400',
    glow: 'shadow-[0_0_60px_rgba(0,193,139,0.3)]',
  },
  teal: {
    orbs: ['rgba(0, 153, 152, 0.15)', 'rgba(0, 193, 139, 0.1)', 'rgba(0, 240, 255, 0.08)'],
    text: 'from-teal-400 via-cyan-400 to-teal-400',
    accent: 'text-teal-400',
    glow: 'shadow-[0_0_60px_rgba(0,153,152,0.3)]',
  },
};

const sceneOverlayOpacity: Record<'low' | 'medium' | 'high', string> = {
  low: 'from-background/95 via-background/80 to-background/70',
  medium: 'from-background/90 via-background/60 to-background/50',
  high: 'from-background/80 via-background/40 to-background/30',
};

/* ============================================
   FLOATING ORB COMPONENT
   ============================================ */

function FloatingOrb({ color, size, initialX, initialY, duration, delay = 0 }: FloatingOrbProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      initial={{
        x: initialX,
        y: initialY,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        x: [initialX, initialX + 100, initialX - 50, initialX + 30, initialX],
        y: [initialY, initialY - 80, initialY + 60, initialY - 40, initialY],
        opacity: [0.3, 0.5, 0.4, 0.5, 0.3],
        scale: [1, 1.2, 0.9, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ============================================
   SCROLL PROGRESS COMPONENT
   ============================================ */

function ScrollProgressBar({ gradient }: { gradient: GradientColor }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const gradientClass = {
    lime: 'from-neon-lime via-neon-cyan to-neon-magenta',
    cyan: 'from-neon-cyan via-neon-magenta to-neon-purple',
    magenta: 'from-neon-magenta via-neon-purple to-neon-cyan',
    purple: 'from-neon-purple via-neon-magenta to-neon-cyan',
    emerald: 'from-emerald-400 via-teal-400 to-cyan-400',
    teal: 'from-teal-400 via-cyan-400 to-emerald-400',
  };

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 origin-left z-50',
        'bg-gradient-to-r',
        gradientClass[gradient]
      )}
      style={{ scaleX }}
    />
  );
}

/* ============================================
   PARALLAX WRAPPER
   ============================================ */

interface ParallaxWrapperProps {
  children: ReactNode;
  offset?: number;
}

function ParallaxWrapper({ children, offset = 50 }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ImmersivePage({
  children,
  scene,
  gradient = 'lime',
  showOrbs = true,
  showScrollProgress = true,
  className,
  sceneVisibility = 'medium',
  parallaxHero = true,
}: ImmersivePageProps) {
  const config = gradientConfigs[gradient];
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Scroll Progress */}
      {showScrollProgress && <ScrollProgressBar gradient={gradient} />}

      {/* 3D Scene Background */}
      {scene && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Suspense fallback={null}>{scene}</Suspense>
        </div>
      )}

      {/* Gradient Overlay - Less aggressive to show more 3D */}
      <div
        className={cn(
          'fixed inset-0 z-[1] pointer-events-none',
          'bg-gradient-to-b',
          sceneOverlayOpacity[sceneVisibility]
        )}
      />

      {/* Light Mode Softening Overlay - Subtle white veil for cinematic light mode */}
      <div
        className={cn(
          'fixed inset-0 z-[1] pointer-events-none transition-opacity duration-500',
          'bg-white/[0.15]',
          'dark:opacity-0'
        )}
      />

      {/* Floating Orbs */}
      {showOrbs && (
        <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
          <FloatingOrb
            color={config.orbs[0]}
            size={400}
            initialX={-100}
            initialY={200}
            duration={20}
          />
          <FloatingOrb
            color={config.orbs[1]}
            size={350}
            initialX={800}
            initialY={400}
            duration={25}
            delay={2}
          />
          <FloatingOrb
            color={config.orbs[2]}
            size={300}
            initialX={400}
            initialY={800}
            duration={22}
            delay={4}
          />
        </div>
      )}

      {/* Main Content */}
      <main className={cn('relative z-10 pt-24 pb-20', className)}>
        {parallaxHero ? (
          <ParallaxWrapper offset={30}>{children}</ParallaxWrapper>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

/* ============================================
   SUB-COMPONENTS
   ============================================ */

interface ImmersiveHeroProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

export function ImmersiveHero({ children, className, fullHeight = true }: ImmersiveHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative',
        fullHeight && 'min-h-[calc(100vh-6rem)]',
        'flex flex-col justify-center',
        className
      )}
      style={{ y, opacity, scale }}
    >
      {children}
    </motion.div>
  );
}

interface ImmersiveSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ImmersiveSection({ children, className, delay = 0 }: ImmersiveSectionProps) {
  return (
    <motion.section
      className={cn('relative py-20', className)}
      initial={{ opacity: 0, y: 100, rotateX: -5 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.33, 1, 0.68, 1],
      }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.section>
  );
}

interface ImmersiveTitleProps {
  children: ReactNode;
  subtitle?: string;
  gradient?: GradientColor;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function ImmersiveTitle({
  children,
  subtitle,
  gradient = 'lime',
  className,
  align = 'center',
}: ImmersiveTitleProps) {
  const config = gradientConfigs[gradient];

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-16', alignClass[align], className)}>
      {subtitle && (
        <motion.span
          className={cn('block text-sm uppercase tracking-[0.3em] mb-4', config.accent)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        className={cn(
          'text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter',
          'bg-gradient-to-r bg-clip-text text-transparent',
          config.text
        )}
        initial={{ opacity: 0, y: 50, skewY: 3 }}
        whileInView={{ opacity: 1, y: 0, skewY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.h2>
      <motion.div
        className={cn('h-1 mt-6 rounded-full bg-gradient-to-r', config.text)}
        initial={{ scaleX: 0, originX: align === 'right' ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
        style={{
          width: align === 'center' ? '200px' : '150px',
          marginLeft: align === 'center' ? 'auto' : align === 'right' ? 'auto' : 0,
          marginRight: align === 'center' ? 'auto' : align === 'left' ? 'auto' : 0,
        }}
      />
    </div>
  );
}

/* ============================================
   EXPORTS
   ============================================ */

export { ParallaxWrapper, FloatingOrb, ScrollProgressBar };
export type { ImmersivePageProps, GradientColor };
