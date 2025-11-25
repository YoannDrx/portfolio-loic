'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ============================================
   GLASS BUTTON VARIANTS
   ============================================ */

const glassButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'font-display font-bold tracking-wider uppercase',
    'rounded-lg overflow-hidden',
    'transition-all duration-300 ease-out',
    'cursor-pointer',
  ],
  {
    variants: {
      color: {
        primary: '',
        lime: '',
        cyan: '',
        magenta: '',
        purple: '',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      color: 'primary',
      size: 'default',
    },
  }
);

/* ============================================
   COLOR CONFIG
   ============================================ */

const colorConfig = {
  primary: {
    border: 'border-primary',
    borderHover: 'group-hover:border-primary',
    text: 'text-primary',
    glowBorder: 'group-hover:shadow-[inset_0_0_0_2px_rgba(213,255,10,0.5)]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(213,255,10,0.3)]',
  },
  lime: {
    border: 'border-primary',
    borderHover: 'group-hover:border-primary',
    text: 'text-primary',
    glowBorder: 'group-hover:shadow-[inset_0_0_0_2px_rgba(213,255,10,0.5)]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(213,255,10,0.3)]',
  },
  cyan: {
    border: 'border-cyan',
    borderHover: 'group-hover:border-cyan',
    text: 'text-cyan',
    glowBorder: 'group-hover:shadow-[inset_0_0_0_2px_rgba(0,240,255,0.5)]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
  magenta: {
    border: 'border-magenta',
    borderHover: 'group-hover:border-magenta',
    text: 'text-magenta',
    glowBorder: 'group-hover:shadow-[inset_0_0_0_2px_rgba(255,0,110,0.5)]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(255,0,110,0.3)]',
  },
  purple: {
    border: 'border-purple',
    borderHover: 'group-hover:border-purple',
    text: 'text-purple',
    glowBorder: 'group-hover:shadow-[inset_0_0_0_2px_rgba(139,92,246,0.5)]',
    glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  },
};

/* ============================================
   TYPES
   ============================================ */

interface GlassButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof glassButtonVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'button' | 'a' | 'div';
  href?: string;
  target?: string;
  rel?: string;
  animated?: boolean;
}

/* ============================================
   GLASS BUTTON COMPONENT
   ============================================ */

export function GlassButton({
  children,
  className,
  color = 'primary',
  size,
  as = 'div',
  href,
  target,
  rel,
  animated = true,
  ...props
}: GlassButtonProps) {
  const colors = colorConfig[color || 'primary'];

  const content = (
    <div className={cn('group relative', glassButtonVariants({ color, size }), className)} {...props}>
      {/* Glass background - toujours visible, s'intensifie au hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg',
          'bg-white/5 group-hover:bg-obsidian/80',
          'backdrop-blur-md group-hover:backdrop-blur-xl',
          'transition-all duration-500 ease-out',
        )}
      />

      {/* Border layer - utilise box-shadow pour éviter les sursauts */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg',
          'border-2',
          colors.border,
          colors.glowBorder,
          'transition-all duration-500 ease-out',
        )}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 px-6 py-2.5',
          colors.text,
          'flex items-center justify-center gap-2',
        )}
      >
        {children}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        {as === 'a' && href ? (
          <a href={href} target={target} rel={rel} className="block">
            {content}
          </a>
        ) : (
          content
        )}
      </motion.div>
    );
  }

  if (as === 'a' && href) {
    return (
      <a href={href} target={target} rel={rel} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}

/* ============================================
   GLASS LINK BUTTON - Pour usage avec Next Link
   ============================================ */

interface GlassLinkButtonProps extends Omit<GlassButtonProps, 'as' | 'href'> {
  children: React.ReactNode;
}

export function GlassLinkButton({
  children,
  className,
  color = 'primary',
  size,
  animated = true,
  ...props
}: GlassLinkButtonProps) {
  const colors = colorConfig[color || 'primary'];

  const content = (
    <div className={cn('group relative', glassButtonVariants({ color, size }), className)} {...props}>
      {/* Glass background */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg',
          'bg-white/5 group-hover:bg-obsidian/80',
          'backdrop-blur-md group-hover:backdrop-blur-xl',
          'transition-all duration-500 ease-out',
        )}
      />

      {/* Border layer */}
      <div
        className={cn(
          'absolute inset-0 rounded-lg',
          'border-2',
          colors.border,
          colors.glowBorder,
          'transition-all duration-500 ease-out',
        )}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 px-6 py-2.5',
          colors.text,
          'flex items-center justify-center gap-2',
        )}
      >
        {children}
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
