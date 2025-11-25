'use client';

import React from 'react';
import { motion, type HTMLMotionProps, type Variants, useReducedMotion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ============================================
   ANIMATION VARIANTS
   ============================================ */

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInDownVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const slideUpVariants: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const animationVariantsMap = {
  fadeIn: fadeInVariants,
  fadeInUp: fadeInUpVariants,
  fadeInDown: fadeInDownVariants,
  fadeInLeft: fadeInLeftVariants,
  fadeInRight: fadeInRightVariants,
  scaleIn: scaleInVariants,
  slideUp: slideUpVariants,
};

/* ============================================
   SECTION VARIANTS
   ============================================ */

const sectionVariants = cva('relative', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-8 md:py-12',
      default: 'py-12 md:py-20',
      lg: 'py-16 md:py-28',
      xl: 'py-24 md:py-40',
    },
    container: {
      none: '',
      default: 'container mx-auto px-4 sm:px-6 lg:px-8',
      narrow: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
      wide: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
      full: 'w-full px-4 sm:px-6 lg:px-8',
    },
    background: {
      transparent: '',
      surface: 'bg-surface',
      elevated: 'bg-surface-elevated',
      gradient: 'bg-gradient-surface',
      glow: 'bg-gradient-glow-primary',
    },
  },
  defaultVariants: {
    spacing: 'default',
    container: 'default',
    background: 'transparent',
  },
});

/* ============================================
   TYPES
   ============================================ */

type AnimationType = keyof typeof animationVariantsMap;

interface AnimatedSectionProps
  extends Omit<HTMLMotionProps<'section'>, 'children'>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  once?: boolean;
  amount?: 'some' | 'all' | number;
  as?: 'section' | 'div' | 'article' | 'aside' | 'main';
}

/* ============================================
   ANIMATED SECTION COMPONENT
   ============================================ */

export function AnimatedSection({
  children,
  className,
  spacing,
  container,
  background,
  animation = 'fadeInUp',
  duration = 0.6,
  delay = 0,
  staggerChildren,
  once = true,
  amount = 0.2,
  as = 'section',
  ...props
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[as] as any;

  const variants = animationVariantsMap[animation];

  const containerVariants: Variants = staggerChildren
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }
    : variants;

  return (
    <Component
      className={cn(sectionVariants({ spacing, container, background }), className)}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ============================================
   ANIMATED ITEM - For stagger children
   ============================================ */

interface AnimatedItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  duration?: number;
  as?: 'div' | 'span' | 'li' | 'article';
}

export function AnimatedItem({
  children,
  className,
  animation = 'fadeInUp',
  duration = 0.5,
  as = 'div',
  ...props
}: AnimatedItemProps) {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[as] as any;
  const variants = animationVariantsMap[animation];

  return (
    <Component
      className={className}
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ============================================
   ANIMATED HEADING
   ============================================ */

interface AnimatedHeadingProps extends Omit<HTMLMotionProps<'h1'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  animation?: AnimationType;
  duration?: number;
  delay?: number;
}

export function AnimatedHeading({
  children,
  className,
  as = 'h2',
  animation = 'fadeInUp',
  duration = 0.6,
  delay = 0,
  ...props
}: AnimatedHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[as] as any;
  const variants = animationVariantsMap[animation];

  return (
    <Component
      className={className}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ============================================
   ANIMATED TEXT
   ============================================ */

interface AnimatedTextProps extends Omit<HTMLMotionProps<'p'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
}

export function AnimatedText({
  children,
  className,
  animation = 'fadeInUp',
  duration = 0.5,
  delay = 0.1,
  ...props
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = animationVariantsMap[animation];

  return (
    <motion.p
      className={className}
      initial={shouldReduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props}
    >
      {children}
    </motion.p>
  );
}

/* ============================================
   REVEAL ON SCROLL
   ============================================ */

interface RevealOnScrollProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
}

export function RevealOnScroll({
  children,
  className,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  delay = 0,
  once = true,
  ...props
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  const directionOffsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? {} : { opacity: 0, ...directionOffsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once }}
      transition={{
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
