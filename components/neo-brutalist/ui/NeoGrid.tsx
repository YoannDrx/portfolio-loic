"use client";

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type NeoGridCols = 1 | 2 | 3 | 4 | 5 | 6;
type NeoGridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface NeoGridProps {
  children: ReactNode;
  cols?: NeoGridCols;
  colsMd?: NeoGridCols;
  colsLg?: NeoGridCols;
  gap?: NeoGridGap;
  asymmetric?: boolean;
  className?: string;
}

const gapStyles: Record<NeoGridGap, string> = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const colsStyles: Record<NeoGridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const colsMdStyles: Record<NeoGridCols, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

const colsLgStyles: Record<NeoGridCols, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export const NeoGrid = ({
  children,
  cols = 1,
  colsMd,
  colsLg,
  gap = 'md',
  asymmetric = false,
  className,
}: NeoGridProps) => {
  return (
    <div
      className={cn(
        'grid',
        colsStyles[cols],
        colsMd && colsMdStyles[colsMd],
        colsLg && colsLgStyles[colsLg],
        gapStyles[gap],
        asymmetric && '[&>*:nth-child(odd)]:row-span-1 [&>*:nth-child(3n)]:col-span-2 [&>*:nth-child(3n)]:lg:col-span-1',
        className
      )}
    >
      {children}
    </div>
  );
};

export default NeoGrid;
