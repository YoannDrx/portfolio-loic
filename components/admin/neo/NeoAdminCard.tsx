"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* ============================================
   TYPES
   ============================================ */

type NeoAdminCardVariant = 'default' | 'accent' | 'inverted' | 'ghost';
type NeoAdminCardSize = 'sm' | 'md' | 'lg';

interface NeoAdminCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: NeoAdminCardVariant;
  size?: NeoAdminCardSize;
  hover?: 'lift' | 'glow' | 'none';
  onClick?: () => void;
}

interface NeoAdminKPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  href?: string;
  accentColor?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  badge?: string;
}

/* ============================================
   STYLES
   ============================================ */

const variantStyles: Record<NeoAdminCardVariant, string> = {
  default: 'bg-neo-bg text-neo-text border-neo-border',
  accent: 'bg-neo-accent text-neo-text-inverse border-neo-border',
  inverted: 'bg-neo-text text-neo-bg border-neo-border',
  ghost: 'bg-transparent text-neo-text border-neo-border',
};

const sizeStyles: Record<NeoAdminCardSize, string> = {
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
};

const hoverStyles = {
  lift: 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--neo-shadow)]',
  glow: 'hover:shadow-[0_0_20px_rgba(var(--neo-accent-rgb),0.3)]',
  none: '',
};

const accentColorStyles = {
  cyan: {
    bg: 'bg-[#00F0FF]/10',
    text: 'text-[#00F0FF]',
    border: 'border-[#00F0FF]/30',
    shadow: '0 0 20px rgba(0, 240, 255, 0.2)',
  },
  magenta: {
    bg: 'bg-[#FF006E]/10',
    text: 'text-[#FF006E]',
    border: 'border-[#FF006E]/30',
    shadow: '0 0 20px rgba(255, 0, 110, 0.2)',
  },
  lime: {
    bg: 'bg-[#D5FF0A]/10',
    text: 'text-[#D5FF0A]',
    border: 'border-[#D5FF0A]/30',
    shadow: '0 0 20px rgba(213, 255, 10, 0.2)',
  },
  purple: {
    bg: 'bg-[#8B5CF6]/10',
    text: 'text-[#8B5CF6]',
    border: 'border-[#8B5CF6]/30',
    shadow: '0 0 20px rgba(139, 92, 246, 0.2)',
  },
  orange: {
    bg: 'bg-[#FF3300]/10',
    text: 'text-[#FF3300]',
    border: 'border-[#FF3300]/30',
    shadow: '0 0 20px rgba(255, 51, 0, 0.2)',
  },
};

/* ============================================
   MAIN CARD COMPONENT
   ============================================ */

export function NeoAdminCard({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = 'lift',
  onClick,
}: NeoAdminCardProps) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={cn(
        // Base styles
        'relative border-2 transition-all duration-200',
        // Neo-brutalist shadow
        'shadow-[4px_4px_0px_0px_var(--neo-shadow)]',
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Hover effects
        hoverStyles[hover],
        // Button reset if clickable
        onClick && 'text-left w-full cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}

/* ============================================
   KPI CARD COMPONENT
   ============================================ */

export function NeoAdminKPICard({
  title,
  value,
  icon: Icon,
  description,
  href,
  accentColor = 'cyan',
  trend,
  badge,
}: NeoAdminKPICardProps) {
  const colorStyle = accentColorStyles[accentColor];

  const cardContent = (
    <NeoAdminCard
      hover="lift"
      className={cn(
        'group relative overflow-hidden',
        href && 'cursor-pointer'
      )}
    >
      {/* Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110',
            colorStyle.bg,
            colorStyle.border
          )}
        >
          <Icon className={cn('h-6 w-6', colorStyle.text)} />
        </div>
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-neo-text/60">
            {title}
          </p>
          {badge && (
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-neo-accent text-neo-text-inverse">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-black text-neo-text tracking-tight">
            {value}
          </span>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-mono font-bold',
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {description && (
          <p className="font-mono text-sm text-neo-text/50">{description}</p>
        )}
      </div>

      {/* Bottom border accent on hover */}
      {href && (
        <div
          className={cn(
            'absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full',
            colorStyle.bg.replace('/10', '')
          )}
          style={{ backgroundColor: colorStyle.text.replace('text-[', '').replace(']', '') }}
        />
      )}
    </NeoAdminCard>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

/* ============================================
   STAT CARD COMPONENT (simpler version)
   ============================================ */

interface NeoAdminStatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accentColor?: 'cyan' | 'magenta' | 'lime' | 'purple' | 'orange';
}

export function NeoAdminStatCard({
  label,
  value,
  icon: Icon,
  accentColor = 'cyan',
}: NeoAdminStatCardProps) {
  const colorStyle = accentColorStyles[accentColor];

  return (
    <div className="flex items-center gap-4 p-4 border-2 border-neo-border bg-neo-bg">
      {Icon && (
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center border-2',
            colorStyle.bg,
            colorStyle.border
          )}
        >
          <Icon className={cn('h-5 w-5', colorStyle.text)} />
        </div>
      )}
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-neo-text/60">
          {label}
        </p>
        <p className="text-2xl font-black text-neo-text">{value}</p>
      </div>
    </div>
  );
}

export default NeoAdminCard;
