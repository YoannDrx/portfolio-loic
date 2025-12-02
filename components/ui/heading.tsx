import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { fadeInUp, transitions } from '@/lib/animations';

const headingVariants = cva('font-display font-bold tracking-tight', {
  variants: {
    variant: {
      default: 'text-foreground',
      primary: 'text-primary',
      muted: 'text-muted-foreground',
      // Gradient variants
      gradient: 'bg-gradient-brand bg-clip-text text-transparent',
      'gradient-primary': 'bg-gradient-primary bg-clip-text text-transparent',
      'gradient-teal': 'bg-gradient-teal bg-clip-text text-transparent',
      'gradient-ocean': 'bg-gradient-ocean bg-clip-text text-transparent',
    },
    size: {
      h1: 'text-5xl md:text-6xl lg:text-7xl',
      h2: 'text-4xl md:text-5xl',
      h3: 'text-3xl md:text-4xl',
      h4: 'text-2xl md:text-3xl',
      h5: 'text-xl md:text-2xl',
      h6: 'text-lg md:text-xl',
      // Display sizes for hero sections
      display: 'text-6xl md:text-7xl lg:text-8xl',
      'display-sm': 'text-5xl md:text-6xl lg:text-7xl',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    leading: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'h2',
    leading: 'tight',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  /** HTML heading level to render */
  as?: HeadingLevel;
  /** Enable entrance animation */
  animated?: boolean;
  /** Balance text for better line breaks */
  balance?: boolean;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      variant,
      size,
      align,
      leading,
      as,
      animated = false,
      balance = false,
      children,
      ...props
    },
    ref
  ) => {
    // Determine the HTML element based on size if 'as' is not provided
    const getElementFromSize = (): HeadingLevel => {
      if (size?.startsWith('h')) {
        return size as HeadingLevel;
      }
      if (size?.startsWith('display')) {
        return 'h1';
      }
      return 'h2';
    };

    const Component = as || getElementFromSize();

    const baseClassName = cn(
      headingVariants({ variant, size, align, leading }),
      balance && 'text-balance',
      className
    );

    // Animated version
    if (animated) {
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          transition={transitions.smooth}
        >
          <Component ref={ref} className={baseClassName} {...props}>
            {children}
          </Component>
        </motion.div>
      );
    }

    return (
      <Component ref={ref} className={baseClassName} {...props}>
        {children}
      </Component>
    );
  }
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
