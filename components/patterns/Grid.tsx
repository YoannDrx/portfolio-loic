'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';

const gridVariants = cva('grid', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    },
    gap: {
      none: 'gap-0',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-10',
    },
  },
  defaultVariants: {
    cols: 3,
    gap: 'lg',
  },
});

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  /** Enable stagger animation for children */
  animated?: boolean;
}

export function Grid({
  className,
  cols,
  gap,
  animated = false,
  children,
  ...props
}: GridProps) {
  if (animated) {
    return (
      <motion.div
        className={cn(gridVariants({ cols, gap }), className)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props}>
      {children}
    </div>
  );
}

// Grid Item for animated grids
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Span multiple columns */
  span?: 1 | 2 | 3 | 4;
}

export function GridItem({ className, span, children, ...props }: GridItemProps) {
  const spanClasses = {
    1: '',
    2: 'md:col-span-2',
    3: 'md:col-span-2 lg:col-span-3',
    4: 'md:col-span-2 lg:col-span-4',
  };

  return (
    <motion.div
      className={cn(span && spanClasses[span], className)}
      variants={staggerItem}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
