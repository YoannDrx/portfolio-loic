'use client';

import React from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ============================================
   GLASS CARD VARIANTS
   ============================================ */

const glassCardVariants = cva(
  [
    'group relative rounded-2xl shadow-xl',
    'transition-all duration-normal',
  ],
  {
    variants: {
      variant: {
        default: 'bg-neutral-900/30 backdrop-blur-xl border border-border-subtle',
        neon: 'bg-neutral-950/60 backdrop-blur-xl border border-border',
        subtle: 'bg-neutral-800/20 backdrop-blur-lg border border-border-subtle',
        solid: 'bg-surface border border-border',
        elevated: 'bg-surface-elevated border border-border shadow-lg',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-lg hover:-translate-y-1',
        glow: '',
        scale: 'hover:scale-[1.02]',
      },
      glowColor: {
        none: '',
        primary: 'hover:shadow-glow-primary',
        lime: 'hover:shadow-glow-primary', // Alias for primary (legacy)
        green: 'hover:shadow-glow-green',
        emerald: 'hover:shadow-glow-emerald',
        teal: 'hover:shadow-glow-teal',
        cyan: 'hover:shadow-glow-cyan',
        ocean: 'hover:shadow-glow-ocean',
        magenta: 'hover:shadow-glow-magenta',
        purple: 'hover:shadow-glow-purple',
      },
    },
    compoundVariants: [
      {
        hover: 'glow',
        glowColor: 'primary',
        className: 'hover:border-primary/30 hover:shadow-glow-primary',
      },
      {
        hover: 'glow',
        glowColor: 'lime',
        className: 'hover:border-primary/30 hover:shadow-glow-primary',
      },
      {
        hover: 'glow',
        glowColor: 'green',
        className: 'hover:border-accent-green/30 hover:shadow-glow-green',
      },
      {
        hover: 'glow',
        glowColor: 'emerald',
        className: 'hover:border-accent-emerald/30 hover:shadow-glow-emerald',
      },
      {
        hover: 'glow',
        glowColor: 'teal',
        className: 'hover:border-accent-teal/30 hover:shadow-glow-teal',
      },
      {
        hover: 'glow',
        glowColor: 'cyan',
        className: 'hover:border-cyan/30 hover:shadow-glow-cyan',
      },
      {
        hover: 'glow',
        glowColor: 'ocean',
        className: 'hover:border-accent-ocean/30 hover:shadow-glow-ocean',
      },
      {
        hover: 'glow',
        glowColor: 'magenta',
        className: 'hover:border-magenta/30 hover:shadow-glow-magenta',
      },
      {
        hover: 'glow',
        glowColor: 'purple',
        className: 'hover:border-purple/30 hover:shadow-glow-purple',
      },
    ],
    defaultVariants: {
      variant: 'default',
      hover: 'none',
      glowColor: 'none',
    },
  }
);

/* ============================================
   TYPES
   ============================================ */

interface GlassCardProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
    VariantProps<typeof glassCardVariants> {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
  triggerOnLoad?: boolean;
}

/* ============================================
   GLASS CARD COMPONENT
   ============================================ */

export function GlassCard({
  children,
  className,
  variant,
  hover,
  glowColor,
  animated = true,
  triggerOnLoad = false,
  ...props
}: GlassCardProps) {
  const motionProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        ...(triggerOnLoad
          ? { animate: { opacity: 1, y: 0 } }
          : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px' } }),
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      }
    : {};

  return (
    <motion.div
      className={cn(glassCardVariants({ variant, hover, glowColor }), className)}
      {...motionProps}
      {...props}
    >
      {/* Inner Glow Effect */}
      {(hover === 'glow' || hover === 'lift') && (
        <div
          className={cn(
            'absolute -inset-1 rounded-2xl blur-xl',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-slow',
            'pointer-events-none',
            'bg-gradient-to-r from-transparent via-primary/5 to-transparent'
          )}
        />
      )}

      {/* Content Wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/* ============================================
   GLASS CARD CONTENT
   ============================================ */

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'default' | 'lg';
}

export function GlassCardContent({
  children,
  className,
  padding = 'default',
  ...props
}: GlassCardContentProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={cn(paddingClasses[padding], className)} {...props}>
      {children}
    </div>
  );
}

/* ============================================
   GLASS CARD HEADER
   ============================================ */

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardHeader({ children, className, ...props }: GlassCardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ============================================
   GLASS CARD TITLE
   ============================================ */

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function GlassCardTitle({
  children,
  className,
  as: Component = 'h3',
  ...props
}: GlassCardTitleProps) {
  return (
    <Component
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ============================================
   GLASS CARD DESCRIPTION
   ============================================ */

interface GlassCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardDescription({
  children,
  className,
  ...props
}: GlassCardDescriptionProps) {
  return (
    <p className={cn('text-sm text-neutral-400', className)} {...props}>
      {children}
    </p>
  );
}

/* ============================================
   GLASS CARD FOOTER
   ============================================ */

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCardFooter({ children, className, ...props }: GlassCardFooterProps) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}
