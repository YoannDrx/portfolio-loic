import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-neutral-500',
      secondary: 'text-neutral-400',
      primary: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      // Gradient variants
      gradient: 'bg-gradient-brand bg-clip-text text-transparent',
      'gradient-primary': 'bg-gradient-primary bg-clip-text text-transparent',
      'gradient-teal': 'bg-gradient-teal bg-clip-text text-transparent',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    tracking: {
      tighter: 'tracking-tighter',
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
      widest: 'tracking-widest',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
    weight: 'normal',
    leading: 'normal',
    tracking: 'normal',
  },
});

type TextElement = 'p' | 'span' | 'div' | 'label';

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  /** HTML element to render */
  as?: TextElement;
  /** Balance text for better line breaks */
  balance?: boolean;
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Clamp text to specific number of lines */
  clamp?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      leading,
      tracking,
      as: Component = 'p',
      balance = false,
      truncate = false,
      clamp,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        className={cn(
          textVariants({ variant, size, weight, align, leading, tracking }),
          balance && 'text-balance',
          truncate && 'truncate',
          clamp === 1 && 'line-clamp-1',
          clamp === 2 && 'line-clamp-2',
          clamp === 3 && 'line-clamp-3',
          clamp === 4 && 'line-clamp-4',
          clamp === 5 && 'line-clamp-5',
          clamp === 6 && 'line-clamp-6',
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, textVariants };
