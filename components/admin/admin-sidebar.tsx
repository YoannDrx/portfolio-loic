'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Image,
  Video,
  Briefcase,
  Settings,
  TrendingUp,
  Home,
  FileText,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface AdminSidebarProps {
  locale: string;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin',
    color: 'text-neon-cyan',
  },
  {
    icon: Image,
    label: 'Albums',
    href: '/admin/albums',
    color: 'text-neon-lime',
  },
  {
    icon: Video,
    label: 'Vidéos',
    href: '/admin/videos',
    color: 'text-neon-magenta',
  },
  {
    icon: Briefcase,
    label: 'Services',
    href: '/admin/services',
    color: 'text-neon-purple',
  },
  {
    icon: FileText,
    label: 'CV / Resume',
    href: '/admin/cv',
    color: 'text-orange-400',
  },
  {
    icon: Settings,
    label: 'Paramètres',
    href: '/admin/settings',
    color: 'text-muted-foreground',
  },
];

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden w-72 flex-col bg-glass-strong backdrop-blur-xl border-r border-[var(--glass-border)] lg:flex z-20">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-6 border-b border-[var(--glass-border)]">
        <Link href={`/${locale}/admin`} className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta group-hover:scale-110 transition-transform duration-300">
            <span className="text-lg font-black text-foreground">LG</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground tracking-tight font-montserrat">
              Admin Panel
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Loïc Ghanem
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const isActive =
            pathname === `/${locale}${item.href}` ||
            (item.href !== '/admin' &&
              pathname.startsWith(`/${locale}${item.href}`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 relative overflow-hidden',
                isActive
                  ? 'text-foreground bg-[var(--glass-hover)] border border-[var(--glass-border)] shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-[var(--glass-hover)]'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-cyan to-neon-magenta" />
              )}
              
              <div className="flex items-center gap-3 relative z-10">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors duration-300',
                    isActive ? item.color : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                <span className="font-semibold tracking-wide">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-[var(--glass-border)]">
        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-neon-lime" />
            <span className="text-xs font-bold text-neon-lime uppercase tracking-widest">
              Activity
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Views Today</span>
              <span className="font-mono font-bold text-foreground">1,234</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Published</span>
              <span className="font-mono font-bold text-neon-cyan">42</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--glass-border)] bg-glass-subtle">
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors group"
          >
            <Home className="h-4 w-4 group-hover:text-neon-cyan transition-colors" />
            <span>Back to Site</span>
          </Link>
          {/* ThemeSwitcher hidden/styled for admin consistency if needed */}
        </div>
      </div>
    </div>
  );
}
