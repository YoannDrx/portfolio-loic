"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Image,
  Video,
  Briefcase,
  Settings,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Command,
  type LucideIcon,
} from 'lucide-react';

/* ============================================
   TYPES
   ============================================ */

interface NeoAdminSidebarProps {
  locale: string;
  onOpenCommandPalette?: () => void;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  accentColor: string;
  badge?: string;
}

/* ============================================
   MENU CONFIG
   ============================================ */

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin',
    accentColor: '#00F0FF',
  },
  {
    icon: Image,
    label: 'Albums',
    href: '/admin/albums',
    accentColor: '#D5FF0A',
  },
  {
    icon: Video,
    label: 'Vidéos',
    href: '/admin/videos',
    accentColor: '#FF006E',
  },
  {
    icon: Briefcase,
    label: 'Services',
    href: '/admin/services',
    accentColor: '#8B5CF6',
  },
  {
    icon: FileText,
    label: 'CV / Resume',
    href: '/admin/cv',
    accentColor: '#FF3300',
  },
  {
    icon: Settings,
    label: 'Paramètres',
    href: '/admin/settings',
    accentColor: '#64748B',
  },
];

/* ============================================
   MAIN COMPONENT
   ============================================ */

export function NeoAdminSidebar({ locale, onOpenCommandPalette }: NeoAdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'hidden lg:flex flex-col h-screen',
        'bg-neo-bg border-r-4 border-neo-border',
        'relative z-20'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-20 items-center px-4 border-b-4 border-neo-border">
        <Link href={`/${locale}/admin`} className="flex items-center gap-3 group">
          <div className="relative flex h-12 w-12 items-center justify-center bg-neo-accent border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)] group-hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)] transition-all">
            <span className="text-lg font-black text-neo-text-inverse">LG</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black text-neo-text uppercase tracking-tight">
                  Admin
                </span>
                <span className="text-xs font-mono text-neo-text/60 uppercase tracking-widest">
                  Loïc Ghanem
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Command Palette Trigger */}
      {onOpenCommandPalette && (
        <div className="px-3 py-4 border-b-2 border-neo-border/50">
          <button
            onClick={onOpenCommandPalette}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2',
              'bg-neo-surface border-2 border-neo-border',
              'text-neo-text/60 hover:text-neo-text hover:bg-neo-bg-alt',
              'font-mono text-xs uppercase tracking-wider',
              'transition-all duration-200',
              'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
              'hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div className="flex items-center gap-2">
              <Command className="h-4 w-4" />
              {!isCollapsed && <span>Rechercher...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="px-1.5 py-0.5 bg-neo-bg border border-neo-border text-[10px] font-bold">
                ⌘K
              </kbd>
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 mb-3 text-xs font-mono font-bold text-neo-text/40 uppercase tracking-widest"
            >
              Menu Principal
            </motion.div>
          )}
        </AnimatePresence>

        {menuItems.map((item) => {
          const isActive =
            pathname === `/${locale}${item.href}` ||
            (item.href !== '/admin' && pathname.startsWith(`/${locale}${item.href}`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'group flex items-center gap-3 px-3 py-3',
                'font-mono text-sm font-bold uppercase tracking-wide',
                'transition-all duration-200 relative',
                'border-2',
                isActive
                  ? 'bg-neo-text text-neo-bg border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]'
                  : 'bg-transparent text-neo-text/70 border-transparent hover:bg-neo-surface hover:border-neo-border hover:shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: item.accentColor }}
                />
              )}

              <Icon
                className={cn(
                  'h-5 w-5 transition-colors shrink-0',
                  isActive ? 'text-neo-accent' : ''
                )}
                style={isActive ? { color: item.accentColor } : {}}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Hover accent bar */}
              {!isActive && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 transition-all duration-200"
                  style={{ backgroundColor: item.accentColor }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t-4 border-neo-border bg-neo-surface">
        <div className={cn(
          'flex items-center',
          isCollapsed ? 'justify-center' : 'justify-between'
        )}>
          <Link
            href={`/${locale}`}
            className={cn(
              'flex items-center gap-2 px-3 py-2',
              'text-xs font-mono font-bold text-neo-text/60 uppercase tracking-widest',
              'hover:text-neo-accent transition-colors group',
              isCollapsed && 'px-2'
            )}
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span>Retour au site</span>}
          </Link>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 -right-4',
          'w-8 h-8 flex items-center justify-center',
          'bg-neo-bg border-2 border-neo-border',
          'text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse',
          'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
          'transition-all duration-200'
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </motion.aside>
  );
}

export default NeoAdminSidebar;
