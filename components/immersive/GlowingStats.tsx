'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useAnimations';

/* ============================================
   TYPES
   ============================================ */

type GlowColor = 'lime' | 'cyan' | 'magenta' | 'purple' | 'emerald' | 'teal';

interface StatItem {
  value: number | string;
  suffix?: string;
  prefix?: string;
  label: string;
  icon: LucideIcon;
  color?: GlowColor;
}

interface GlowingStatsProps {
  stats: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

/* ============================================
   COLOR CONFIGURATIONS
   ============================================ */

const colorConfig: Record<GlowColor, {
  icon: string;
  glow: string;
  gradient: string;
  border: string;
}> = {
  lime: {
    icon: 'text-neon-lime',
    glow: 'shadow-[0_0_30px_rgba(213,255,10,0.3)]',
    gradient: 'from-neon-lime to-neon-cyan',
    border: 'border-neon-lime/30',
  },
  cyan: {
    icon: 'text-neon-cyan',
    glow: 'shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    gradient: 'from-neon-cyan to-neon-purple',
    border: 'border-neon-cyan/30',
  },
  magenta: {
    icon: 'text-neon-magenta',
    glow: 'shadow-[0_0_30px_rgba(255,0,110,0.3)]',
    gradient: 'from-neon-magenta to-neon-purple',
    border: 'border-neon-magenta/30',
  },
  purple: {
    icon: 'text-neon-purple',
    glow: 'shadow-[0_0_30px_rgba(181,0,255,0.3)]',
    gradient: 'from-neon-purple to-neon-cyan',
    border: 'border-neon-purple/30',
  },
  emerald: {
    icon: 'text-emerald-400',
    glow: 'shadow-[0_0_30px_rgba(0,193,139,0.3)]',
    gradient: 'from-emerald-400 to-teal-400',
    border: 'border-emerald-400/30',
  },
  teal: {
    icon: 'text-teal-400',
    glow: 'shadow-[0_0_30px_rgba(0,153,152,0.3)]',
    gradient: 'from-teal-400 to-cyan-400',
    border: 'border-teal-400/30',
  },
};

/* ============================================
   SINGLE STAT CARD
   ============================================ */

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const color = stat.color || 'cyan';
  const config = colorConfig[color];
  const Icon = stat.icon;
  const isNumeric = typeof stat.value === 'number';

  const { ref, value } = useCountUp({
    end: isNumeric ? (stat.value as number) : 0,
    suffix: stat.suffix || '',
    prefix: stat.prefix || '',
    duration: 2,
    startOnView: true,
    easing: 'easeOut',
  });

  // Display value: use countUp for numbers, direct string for text
  const displayValue = isNumeric ? value : stat.value;

  return (
    <motion.div
      className={cn(
        'relative group',
        'bg-glass backdrop-blur-sm',
        'border rounded-2xl p-8',
        'transition-all duration-500',
        'hover:bg-glass-strong',
        config.border,
        `hover:${config.glow}`
      )}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Glow background on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-to-br',
          config.gradient,
          'blur-xl -z-10'
        )}
        style={{ transform: 'scale(0.8)' }}
      />

      {/* Icon */}
      <motion.div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
          'bg-gradient-to-br',
          config.gradient,
          'bg-opacity-10'
        )}
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Icon className={cn('w-7 h-7', config.icon)} />
      </motion.div>

      {/* Value with count-up animation */}
      <div className="mb-2">
        <span
          ref={ref}
          className={cn(
            'text-5xl font-black tracking-tighter',
            'bg-gradient-to-r bg-clip-text text-transparent',
            config.gradient
          )}
        >
          {displayValue}
        </span>
      </div>

      {/* Label */}
      <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">
        {stat.label}
      </p>

      {/* Decorative corner accent */}
      <div
        className={cn(
          'absolute top-0 right-0 w-20 h-20 opacity-10',
          'bg-gradient-to-bl',
          config.gradient,
          'rounded-tr-2xl rounded-bl-[100px]'
        )}
      />
    </motion.div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function GlowingStats({ stats, className, columns = 4 }: GlowingStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('grid gap-6', gridCols[columns], className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}

/* ============================================
   EXPORTS
   ============================================ */

export type { StatItem, GlowingStatsProps, GlowColor };
