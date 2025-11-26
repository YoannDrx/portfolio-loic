'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type MotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';
import { fadeIn, fadeInUp, transitions, viewportOnce } from '@/lib/animations';

const sectionVariants = cva('relative w-full', {
  variants: {
    spacing: {
      none: 'py-0',
      sm: 'py-12 lg:py-16',
      md: 'py-16 lg:py-24',
      lg: 'py-20 lg:py-32',
      xl: 'py-24 lg:py-40',
    },
    background: {
      transparent: 'bg-transparent',
      dark: 'bg-neutral-950',
      darker: 'bg-neutral-900',
      gradient: 'bg-gradient-to-b from-neutral-950 to-neutral-900',
      'gradient-radial':
        'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950',
      'glow-top': 'bg-gradient-glow-primary',
      'glow-center': 'bg-gradient-glow-center',
    },
  },
  defaultVariants: {
    spacing: 'lg',
    background: 'transparent',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  /** Enable entrance animation */
  animated?: boolean;
  /** Animation variant to use */
  animationVariant?: 'fadeIn' | 'fadeInUp';
  /** ID for anchor links */
  id?: string;
}

export function Section({
  className,
  spacing,
  background,
  animated = false,
  animationVariant = 'fadeIn',
  children,
  id,
  ...props
}: SectionProps) {
  const variants = animationVariant === 'fadeInUp' ? fadeInUp : fadeIn;

  if (animated) {
    return (
      <motion.section
        id={id}
        className={cn(sectionVariants({ spacing, background }), className)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={variants}
        transition={transitions.smooth}
        {...(props as MotionProps)}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <section
      id={id}
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    >
      {children}
    </section>
  );
}
