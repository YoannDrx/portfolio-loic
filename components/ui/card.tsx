import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';
import { fadeInUp, hoverScaleLift, tapScaleSmall, transitions, viewportOnce } from '@/lib/animations';

const cardVariants = cva('rounded-xl border transition-all', {
  variants: {
    variant: {
      /* ===== GLASS VARIANTS (site public) ===== */
      // Glass - blurred background
      glass:
        'bg-neutral-900/60 backdrop-blur-xl border-neutral-800/50',
      // Glass with neon border
      'glass-neon':
        'bg-neutral-900/60 backdrop-blur-xl border-primary/20 shadow-glow-primary-sm',
      // Glass with emerald border
      'glass-emerald':
        'bg-neutral-900/60 backdrop-blur-xl border-emerald/20 shadow-glow-emerald-sm',
      // Glass subtle
      'glass-subtle':
        'bg-neutral-900/40 backdrop-blur-lg border-neutral-800/30',

      /* ===== SOLID VARIANTS ===== */
      // Default - solid background
      default: 'bg-surface border-border',
      // Elevated - slightly raised
      elevated: 'bg-surface-elevated border-border shadow-lg',
      // Outline - transparent with border
      outline: 'bg-transparent border-border',
      // Ghost - minimal
      ghost: 'bg-surface/50 border-transparent',

      /* ===== GLOW VARIANTS ===== */
      // Glow primary
      'glow-primary':
        'bg-neutral-900 border-primary/20 shadow-glow-primary-sm hover:shadow-glow-primary',
      // Glow emerald
      'glow-emerald':
        'bg-neutral-900 border-emerald/20 shadow-glow-emerald-sm hover:shadow-glow-emerald',
      // Glow teal
      'glow-teal':
        'bg-neutral-900 border-teal/20 shadow-glow-teal-sm hover:shadow-glow-teal',
      // Gradient background
      gradient:
        'bg-gradient-to-b from-neutral-900 to-neutral-950 border-neutral-800',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    hover: {
      none: '',
      lift: 'hover:-translate-y-1 hover:shadow-xl',
      glow: 'hover:border-primary/30 hover:shadow-glow-primary-sm',
      'glow-emerald': 'hover:border-emerald/30 hover:shadow-glow-emerald-sm',
      border: 'hover:border-border-strong',
      scale: 'hover:scale-[1.02]',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    hover: 'none',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable entrance animation */
  animated?: boolean;
  /** Enable hover animation (Framer Motion) */
  animatedHover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hover,
      animated = false,
      animatedHover = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClassName = cn(
      cardVariants({ variant, padding, hover }),
      className
    );

    // Animated version with entrance animation
    if (animated || animatedHover) {
      return (
        <motion.div
          ref={ref}
          className={baseClassName}
          initial={animated ? 'hidden' : undefined}
          whileInView={animated ? 'visible' : undefined}
          viewport={animated ? viewportOnce : undefined}
          variants={animated ? fadeInUp : undefined}
          transition={animated ? transitions.smooth : undefined}
          whileHover={animatedHover ? hoverScaleLift : undefined}
          whileTap={animatedHover ? tapScaleSmall : undefined}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClassName} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'font-display font-semibold leading-none tracking-tight text-foreground',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-neutral-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
