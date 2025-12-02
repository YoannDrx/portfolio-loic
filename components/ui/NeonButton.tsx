'use client';

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ============================================
   NEON BUTTON VARIANTS
   ============================================ */

const neonButtonVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'font-display font-bold tracking-wider uppercase',
    'rounded-lg border-2',
    'transition-all duration-fast',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: 'border-transparent',
        outline: 'bg-transparent',
        ghost: 'border-transparent bg-transparent',
      },
      color: {
        primary: '',
        lime: '', // Alias for primary
        green: '',
        emerald: '',
        teal: '',
        cyan: '',
        ocean: '',
        magenta: '',
        purple: '',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        default: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
        xl: 'px-10 py-4 text-lg',
      },
      glow: {
        none: '',
        subtle: '',
        intense: '',
      },
    },
    compoundVariants: [
      // Solid Primary
      {
        variant: 'solid',
        color: 'primary',
        className: 'bg-primary text-foreground hover:bg-primary-300 focus-visible:ring-primary/50',
      },
      {
        variant: 'solid',
        color: 'primary',
        glow: 'subtle',
        className: 'shadow-glow-primary-sm hover:shadow-glow-primary',
      },
      {
        variant: 'solid',
        color: 'primary',
        glow: 'intense',
        className: 'shadow-glow-primary hover:shadow-glow-primary-intense',
      },

      // Solid Green
      {
        variant: 'solid',
        color: 'green',
        className: 'bg-accent-green text-foreground hover:bg-green-300 focus-visible:ring-green/50',
      },
      {
        variant: 'solid',
        color: 'green',
        glow: 'subtle',
        className: 'shadow-glow-green-sm hover:shadow-glow-green',
      },
      {
        variant: 'solid',
        color: 'green',
        glow: 'intense',
        className: 'shadow-glow-green hover:shadow-glow-green-lg',
      },

      // Solid Emerald
      {
        variant: 'solid',
        color: 'emerald',
        className: 'bg-accent-emerald text-white hover:bg-emerald-300 focus-visible:ring-emerald/50',
      },
      {
        variant: 'solid',
        color: 'emerald',
        glow: 'subtle',
        className: 'shadow-glow-emerald-sm hover:shadow-glow-emerald',
      },
      {
        variant: 'solid',
        color: 'emerald',
        glow: 'intense',
        className: 'shadow-glow-emerald hover:shadow-glow-emerald-lg',
      },

      // Solid Teal
      {
        variant: 'solid',
        color: 'teal',
        className: 'bg-accent-teal text-white hover:bg-teal-300 focus-visible:ring-teal/50',
      },
      {
        variant: 'solid',
        color: 'teal',
        glow: 'subtle',
        className: 'shadow-glow-teal-sm hover:shadow-glow-teal',
      },
      {
        variant: 'solid',
        color: 'teal',
        glow: 'intense',
        className: 'shadow-glow-teal hover:shadow-glow-teal-lg',
      },

      // Solid Ocean
      {
        variant: 'solid',
        color: 'ocean',
        className: 'bg-accent-ocean text-white hover:bg-ocean-300 focus-visible:ring-ocean/50',
      },
      {
        variant: 'solid',
        color: 'ocean',
        glow: 'subtle',
        className: 'shadow-glow-ocean-sm hover:shadow-glow-ocean',
      },
      {
        variant: 'solid',
        color: 'ocean',
        glow: 'intense',
        className: 'shadow-glow-ocean hover:shadow-glow-ocean-lg',
      },

      // Solid Lime (alias for primary)
      {
        variant: 'solid',
        color: 'lime',
        className: 'bg-primary text-foreground hover:bg-primary-300 focus-visible:ring-primary/50',
      },
      {
        variant: 'solid',
        color: 'lime',
        glow: 'subtle',
        className: 'shadow-glow-primary-sm hover:shadow-glow-primary',
      },
      {
        variant: 'solid',
        color: 'lime',
        glow: 'intense',
        className: 'shadow-glow-primary hover:shadow-glow-primary-intense',
      },

      // Solid Cyan
      {
        variant: 'solid',
        color: 'cyan',
        className: 'bg-cyan text-foreground hover:bg-cyan-300 focus-visible:ring-cyan/50',
      },
      {
        variant: 'solid',
        color: 'cyan',
        glow: 'subtle',
        className: 'shadow-glow-cyan-sm hover:shadow-glow-cyan',
      },
      {
        variant: 'solid',
        color: 'cyan',
        glow: 'intense',
        className: 'shadow-glow-cyan hover:shadow-glow-cyan-lg',
      },

      // Solid Magenta
      {
        variant: 'solid',
        color: 'magenta',
        className: 'bg-magenta text-white hover:bg-magenta-300 focus-visible:ring-magenta/50',
      },
      {
        variant: 'solid',
        color: 'magenta',
        glow: 'subtle',
        className: 'shadow-glow-magenta-sm hover:shadow-glow-magenta',
      },
      {
        variant: 'solid',
        color: 'magenta',
        glow: 'intense',
        className: 'shadow-glow-magenta hover:shadow-glow-magenta-lg',
      },

      // Solid Purple
      {
        variant: 'solid',
        color: 'purple',
        className: 'bg-purple text-white hover:bg-purple-300 focus-visible:ring-purple/50',
      },
      {
        variant: 'solid',
        color: 'purple',
        glow: 'subtle',
        className: 'shadow-glow-purple-sm hover:shadow-glow-purple',
      },
      {
        variant: 'solid',
        color: 'purple',
        glow: 'intense',
        className: 'shadow-glow-purple hover:shadow-glow-purple-lg',
      },

      // Outline variants
      {
        variant: 'outline',
        color: 'primary',
        className: 'border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
      },
      {
        variant: 'outline',
        color: 'primary',
        glow: 'subtle',
        className: 'shadow-glow-primary-sm hover:shadow-glow-primary',
      },
      {
        variant: 'outline',
        color: 'green',
        className: 'border-accent-green text-accent-green hover:bg-green/10 focus-visible:ring-green/50',
      },
      {
        variant: 'outline',
        color: 'emerald',
        className: 'border-accent-emerald text-accent-emerald hover:bg-emerald/10 focus-visible:ring-emerald/50',
      },
      {
        variant: 'outline',
        color: 'teal',
        className: 'border-accent-teal text-accent-teal hover:bg-teal/10 focus-visible:ring-teal/50',
      },
      {
        variant: 'outline',
        color: 'ocean',
        className: 'border-accent-ocean text-accent-ocean hover:bg-ocean/10 focus-visible:ring-ocean/50',
      },
      {
        variant: 'outline',
        color: 'lime',
        className: 'border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
      },
      {
        variant: 'outline',
        color: 'cyan',
        className: 'border-cyan text-cyan hover:bg-cyan/10 focus-visible:ring-cyan/50',
      },
      {
        variant: 'outline',
        color: 'magenta',
        className: 'border-magenta text-magenta hover:bg-magenta/10 focus-visible:ring-magenta/50',
      },
      {
        variant: 'outline',
        color: 'purple',
        className: 'border-purple text-purple hover:bg-purple/10 focus-visible:ring-purple/50',
      },

      // Ghost variants
      {
        variant: 'ghost',
        color: 'primary',
        className: 'text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
      },
      {
        variant: 'ghost',
        color: 'green',
        className: 'text-accent-green hover:bg-green/10 focus-visible:ring-green/50',
      },
      {
        variant: 'ghost',
        color: 'emerald',
        className: 'text-accent-emerald hover:bg-emerald/10 focus-visible:ring-emerald/50',
      },
      {
        variant: 'ghost',
        color: 'teal',
        className: 'text-accent-teal hover:bg-teal/10 focus-visible:ring-teal/50',
      },
      {
        variant: 'ghost',
        color: 'ocean',
        className: 'text-accent-ocean hover:bg-ocean/10 focus-visible:ring-ocean/50',
      },
      {
        variant: 'ghost',
        color: 'lime',
        className: 'text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
      },
      {
        variant: 'ghost',
        color: 'cyan',
        className: 'text-cyan hover:bg-cyan/10 focus-visible:ring-cyan/50',
      },
      {
        variant: 'ghost',
        color: 'magenta',
        className: 'text-magenta hover:bg-magenta/10 focus-visible:ring-magenta/50',
      },
      {
        variant: 'ghost',
        color: 'purple',
        className: 'text-purple hover:bg-purple/10 focus-visible:ring-purple/50',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'default',
      glow: 'subtle',
    },
  }
);

/* ============================================
   TYPES
   ============================================ */

interface NeonButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'color'>,
    VariantProps<typeof neonButtonVariants> {
  children: React.ReactNode;
  animated?: boolean;
}

/* ============================================
   NEON BUTTON COMPONENT
   ============================================ */

export function NeonButton({
  children,
  className,
  variant,
  color,
  size,
  glow,
  animated = true,
  ...props
}: NeonButtonProps) {
  const motionProps = animated
    ? {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <motion.button
      className={cn(neonButtonVariants({ variant, color, size, glow }), className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/* ============================================
   NEON LINK BUTTON
   ============================================ */

interface NeonLinkButtonProps
  extends Omit<HTMLMotionProps<'a'>, 'children' | 'color'>,
    VariantProps<typeof neonButtonVariants> {
  children: React.ReactNode;
  animated?: boolean;
}

export function NeonLinkButton({
  children,
  className,
  variant,
  color,
  size,
  glow,
  animated = true,
  ...props
}: NeonLinkButtonProps) {
  const motionProps = animated
    ? {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <motion.a
      className={cn(neonButtonVariants({ variant, color, size, glow }), className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.a>
  );
}

/* ============================================
   ICON BUTTON
   ============================================ */

interface NeonIconButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'color'>,
    Omit<VariantProps<typeof neonButtonVariants>, 'size'> {
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
  animated?: boolean;
}

const iconButtonSizes = {
  sm: 'h-8 w-8',
  default: 'h-10 w-10',
  lg: 'h-12 w-12',
};

export function NeonIconButton({
  children,
  className,
  variant,
  color,
  size = 'default',
  glow,
  animated = true,
  ...props
}: NeonIconButtonProps) {
  const motionProps = animated
    ? {
        whileHover: { scale: 1.1, rotate: 5 },
        whileTap: { scale: 0.9 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
      }
    : {};

  return (
    <motion.button
      className={cn(
        neonButtonVariants({ variant, color, glow }),
        iconButtonSizes[size],
        'p-0 rounded-full',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
