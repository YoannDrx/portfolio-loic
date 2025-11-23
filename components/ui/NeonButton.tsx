'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  color?: 'lime' | 'cyan' | 'magenta' | 'purple';
}

export function NeonButton({
  children,
  className,
  variant = 'primary',
  color = 'lime',
  ...props
}: NeonButtonProps) {
  const colors = {
    lime: {
      bg: 'bg-neon-lime',
      text: 'text-obsidian',
      border: 'border-neon-lime',
      glow: 'shadow-[0_0_20px_-5px_rgba(204,255,0,0.5)] hover:shadow-[0_0_30px_0px_rgba(204,255,0,0.7)]',
      text_outline: 'text-neon-lime',
    },
    cyan: {
      bg: 'bg-neon-cyan',
      text: 'text-obsidian',
      border: 'border-neon-cyan',
      glow: 'shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_0px_rgba(0,240,255,0.7)]',
      text_outline: 'text-neon-cyan',
    },
    magenta: {
      bg: 'bg-neon-magenta',
      text: 'text-white',
      border: 'border-neon-magenta',
      glow: 'shadow-[0_0_20px_-5px_rgba(255,0,110,0.5)] hover:shadow-[0_0_30px_0px_rgba(255,0,110,0.7)]',
      text_outline: 'text-neon-magenta',
    },
    purple: {
      bg: 'bg-neon-purple',
      text: 'text-white',
      border: 'border-neon-purple',
      glow: 'shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_0px_rgba(139,92,246,0.7)]',
      text_outline: 'text-neon-purple',
    },
  };

  const styles = colors[color];

  if (variant === 'outline') {
    return (
      <motion.button
        className={cn(
          'relative px-8 py-3 font-montserrat font-bold tracking-wider uppercase rounded border-2 bg-transparent transition-all duration-300',
          styles.border,
          styles.text_outline,
          styles.glow,
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      className={cn(
        'relative px-8 py-3 font-montserrat font-bold tracking-wider uppercase rounded border-none transition-all duration-300',
        styles.bg,
        styles.text,
        styles.glow,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}