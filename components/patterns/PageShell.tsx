'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ============================================
   PAGE SHELL VARIANTS
   ============================================ */

const pageShellVariants = cva('relative min-h-screen', {
  variants: {
    background: {
      default: 'bg-background',
      surface: 'bg-surface',
      gradient: 'bg-gradient-surface',
      transparent: '',
    },
    padding: {
      none: '',
      default: 'pt-16 pb-20',
      header: 'pt-20',
      full: 'py-20',
    },
  },
  defaultVariants: {
    background: 'default',
    padding: 'default',
  },
});

/* ============================================
   PAGE TRANSITION VARIANTS
   ============================================ */

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/* ============================================
   TYPES
   ============================================ */

interface PageShellProps extends VariantProps<typeof pageShellVariants> {
  children: React.ReactNode;
  className?: string;
  animated?: boolean;
}

/* ============================================
   PAGE SHELL COMPONENT
   ============================================ */

export function PageShell({
  children,
  className,
  background,
  padding,
  animated = true,
}: PageShellProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!animated || shouldReduceMotion) {
    return (
      <main className={cn(pageShellVariants({ background, padding }), className)}>
        {children}
      </main>
    );
  }

  return (
    <motion.main
      className={cn(pageShellVariants({ background, padding }), className)}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.main>
  );
}

/* ============================================
   PAGE HEADER
   ============================================ */

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function PageHeader({ children, className, centered = false }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'relative mb-12 md:mb-16',
        centered && 'text-center',
        className
      )}
    >
      {children}
    </header>
  );
}

/* ============================================
   PAGE TITLE
   ============================================ */

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
  gradient?: boolean;
}

export function PageTitle({
  children,
  className,
  as: Component = 'h1',
  gradient = false,
}: PageTitleProps) {
  return (
    <Component
      className={cn(
        'text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight',
        gradient
          ? 'bg-gradient-brand bg-clip-text text-transparent'
          : 'text-foreground',
        className
      )}
    >
      {children}
    </Component>
  );
}

/* ============================================
   PAGE SUBTITLE
   ============================================ */

interface PageSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageSubtitle({ children, className }: PageSubtitleProps) {
  return (
    <p
      className={cn(
        'mt-4 text-lg md:text-xl text-neutral-400 max-w-3xl',
        className
      )}
    >
      {children}
    </p>
  );
}

/* ============================================
   PAGE CONTENT
   ============================================ */

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  container?: 'none' | 'narrow' | 'default' | 'wide' | 'full';
}

export function PageContent({
  children,
  className,
  container = 'default',
}: PageContentProps) {
  const containerClasses = {
    none: '',
    narrow: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
    default: 'container mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  };

  return (
    <div className={cn(containerClasses[container], className)}>{children}</div>
  );
}

/* ============================================
   PAGE SECTION
   ============================================ */

interface PageSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'default' | 'lg';
}

export function PageSection({
  children,
  className,
  spacing = 'default',
}: PageSectionProps) {
  const spacingClasses = {
    sm: 'py-8 md:py-12',
    default: 'py-12 md:py-20',
    lg: 'py-16 md:py-28',
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */

interface HeroSectionProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  centered?: boolean;
  overlay?: boolean;
  backgroundImage?: string;
}

export function HeroSection({
  children,
  className,
  fullHeight = false,
  centered = true,
  overlay = false,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative',
        fullHeight ? 'min-h-screen' : 'min-h-[60vh]',
        centered && 'flex items-center justify-center',
        className
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {overlay && (
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" />
      )}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

/* ============================================
   BACK BUTTON
   ============================================ */

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = 'Retour', className }: BackButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        'inline-flex items-center gap-2',
        'text-sm text-neutral-400 hover:text-foreground',
        'transition-colors duration-fast',
        className
      )}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </a>
  );
}

/* ============================================
   BREADCRUMB
   ============================================ */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-neutral-600">/</span>}
          {item.href ? (
            <a
              href={item.href}
              className="text-neutral-400 hover:text-foreground transition-colors duration-fast"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
