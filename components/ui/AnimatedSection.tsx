'use client';

import type { ReactNode } from 'react';
import React from 'react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'blur';
  once?: boolean;
  triggerOnLoad?: boolean;
}

/**
 * AnimatedSection - Wrapper component for scroll-based animations
 *
 * Variants:
 * - fadeIn: Simple fade in effect
 * - slideUp: Slide up from bottom with fade
 * - slideLeft: Slide from right to left with fade
 * - slideRight: Slide from left to right with fade
 * - scale: Scale up from 0.95 to 1 with fade
 * - blur: Blur to clear with fade
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  duration = 0.6,
  variant = 'fadeIn',
  once = true,
  triggerOnLoad = false,
}: AnimatedSectionProps) {
  const variants: Record<string, Variants> = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      {...(triggerOnLoad ? { animate: 'visible' } : { whileInView: 'visible' })}
      viewport={{ once, margin: '0px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedGrid - Animated grid container with staggered children
 */
export function AnimatedGrid({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px' }}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

/**
 * AnimatedGridItem - Individual grid item with animation
 */
export function AnimatedGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div className={cn(className)} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * AnimatedText - Animated text with letter-by-letter or word-by-word reveal
 */
export function AnimatedText({
  text,
  className,
  type = 'word',
  delay = 0,
}: {
  text: string;
  className?: string;
  type?: 'letter' | 'word';
  delay?: number;
}) {
  const items = type === 'word' ? text.split(' ') : text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: type === 'word' ? 0.1 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={container}
    >
      {items.map((char, index) => (
        <motion.span
          key={index}
          className={type === 'word' ? 'mr-[0.25em]' : ''}
          variants={item}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
