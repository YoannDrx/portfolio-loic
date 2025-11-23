'use client';

import React from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'neon' | 'subtle';
  neonColor?: 'lime' | 'cyan' | 'magenta' | 'purple' | 'blue';
}

export function GlassCard({
  children,
  className,
  hover = false,
  variant = 'default',
  neonColor = 'cyan', // Default neon color
  ...props
}: GlassCardProps) {
  
  const variants = {
    default: 'bg-obsidian-100/30 backdrop-blur-xl border border-white/5',
    neon: 'bg-obsidian/60 backdrop-blur-xl border border-white/10',
    subtle: 'bg-white/5 backdrop-blur-lg border border-white/5',
  };

  const borderColors = {
    lime: 'group-hover:border-neon-lime/50',
    cyan: 'group-hover:border-neon-cyan/50',
    magenta: 'group-hover:border-neon-magenta/50',
    purple: 'group-hover:border-neon-purple/50',
    blue: 'group-hover:border-neon-blue/50',
  };

  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl shadow-xl transition-all duration-500',
        variants[variant],
        hover && 'hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-1',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {/* Gradient Border Effect on Hover */}
      {hover && (
        <div
          className={cn(
            'absolute inset-0 rounded-2xl border border-transparent transition-colors duration-500 pointer-events-none',
            borderColors[neonColor] || borderColors.cyan
          )}
        />
      )}
      
      {/* Inner Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardContent({ children, className, ...props }: GlassCardContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}
