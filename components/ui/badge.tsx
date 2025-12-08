import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
  {
    variants: {
      variant: {
        /* ===== NEON VARIANTS ===== */
        // Primary neon
        neon: 'bg-primary/15 text-primary border border-primary/30 shadow-glow-primary-sm',
        // Green
        'neon-green':
          'bg-green/15 text-green border border-green/30 shadow-glow-green-sm',
        // Emerald
        'neon-emerald':
          'bg-emerald/15 text-emerald border border-emerald/30 shadow-glow-emerald-sm',
        // Teal
        'neon-teal':
          'bg-teal/15 text-teal border border-teal/30 shadow-glow-teal-sm',
        // Ocean
        'neon-ocean':
          'bg-ocean/15 text-ocean border border-ocean/30 shadow-glow-ocean-sm',
        // Slate
        'neon-slate': 'bg-slate/30 text-foreground/85 border border-slate/50',

        /* ===== SOLID VARIANTS ===== */
        // Default - primary solid
        default: 'bg-primary text-foreground border-transparent',
        // Secondary - muted
        secondary: 'bg-surface text-foreground border border-border',
        // Success
        success: 'bg-success/15 text-success border border-success/30',
        // Warning
        warning: 'bg-warning/15 text-warning border border-warning/30',
        // Error / Destructive
        destructive: 'bg-error/15 text-error border border-error/30',
        // Outline
        outline: 'bg-transparent text-foreground border border-border',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded',
        md: 'px-2.5 py-1 text-xs rounded-md',
        lg: 'px-3 py-1.5 text-sm rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
