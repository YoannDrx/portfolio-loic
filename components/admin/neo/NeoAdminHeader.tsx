"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  User,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { PaletteSelector } from '@/components/neo-brutalist/ui/PaletteSelector';

/* ============================================
   TYPES
   ============================================ */

interface NeoAdminHeaderProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  locale: string;
  onMenuToggle?: () => void;
}

/* ============================================
   PAGE TITLES
   ============================================ */

const getPageTitle = (pathname: string): { title: string; subtitle: string } => {
  if (pathname.includes('/albums')) return { title: 'Albums', subtitle: 'Gestion des albums musicaux' };
  if (pathname.includes('/videos')) return { title: 'Vidéos', subtitle: 'Gestion des vidéos' };
  if (pathname.includes('/services')) return { title: 'Services', subtitle: 'Gestion des services' };
  if (pathname.includes('/settings')) return { title: 'Paramètres', subtitle: 'Configuration système' };
  if (pathname.includes('/cv')) return { title: 'CV / Resume', subtitle: 'Gestion du CV' };
  if (pathname.includes('/logs')) return { title: 'Logs', subtitle: 'Journal d\'activité' };
  return { title: 'Dashboard', subtitle: 'Vue d\'ensemble' };
};

/* ============================================
   MAIN COMPONENT
   ============================================ */

export function NeoAdminHeader({ user, locale, onMenuToggle }: NeoAdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { title, subtitle } = getPageTitle(pathname);

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b-4 border-neo-border bg-neo-bg px-4 sm:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className={cn(
            'lg:hidden flex items-center justify-center',
            'w-10 h-10 border-2 border-neo-border bg-neo-surface',
            'text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse',
            'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
            'transition-all duration-200'
          )}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-black text-neo-text uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-xs font-mono text-neo-text/60 uppercase tracking-wider">
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden xl:flex flex-1 max-w-md ml-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neo-text/40 group-focus-within:text-neo-accent transition-colors" />
            <input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 h-10',
                'bg-neo-surface border-2 border-neo-border',
                'text-neo-text placeholder-neo-text/40',
                'font-mono text-sm',
                'focus:outline-none focus:border-neo-accent',
                'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
                'transition-all duration-200'
              )}
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className={cn(
            'xl:hidden flex items-center justify-center',
            'w-10 h-10 border-2 border-neo-border bg-neo-surface',
            'text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse',
            'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
            'transition-all duration-200'
          )}
        >
          {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </button>

        {/* Palette Selector */}
        <PaletteSelector />


        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={cn(
              'flex items-center gap-3 px-3 py-2',
              'border-2 border-neo-border bg-neo-surface',
              'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
              'hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]',
              'transition-all duration-200'
            )}
          >
            <div className="h-8 w-8 flex items-center justify-center bg-neo-accent text-neo-text-inverse font-bold text-sm border-2 border-neo-border">
              {getUserInitials()}
            </div>
            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-sm font-bold text-neo-text uppercase">
                {user.name || 'Admin'}
              </span>
              <span className="text-[10px] font-mono text-neo-text/60 uppercase tracking-widest">
                {user.role || 'Super Admin'}
              </span>
            </div>
            <ChevronDown className={cn(
              'hidden sm:block h-4 w-4 text-neo-text/60 transition-transform duration-200',
              isProfileOpen && 'rotate-180'
            )} />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'absolute right-0 top-full mt-2 w-64 z-50',
                    'bg-neo-bg border-2 border-neo-border',
                    'shadow-[4px_4px_0px_0px_var(--neo-shadow)]'
                  )}
                >
                  {/* User Info */}
                  <div className="p-4 border-b-2 border-neo-border">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 flex items-center justify-center bg-neo-accent text-neo-text-inverse font-bold text-lg border-2 border-neo-border">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-neo-text uppercase truncate">
                          {user.name || 'Administrator'}
                        </p>
                        <p className="text-xs font-mono text-neo-text/60 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        router.push(`/${locale}/admin/settings?tab=profile`);
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2',
                        'text-neo-text hover:bg-neo-surface',
                        'font-mono text-sm uppercase tracking-wide',
                        'transition-colors duration-200'
                      )}
                    >
                      <User className="h-4 w-4 text-neo-accent" />
                      <span>Profil</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push(`/${locale}/admin/settings`);
                        setIsProfileOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2',
                        'text-neo-text hover:bg-neo-surface',
                        'font-mono text-sm uppercase tracking-wide',
                        'transition-colors duration-200'
                      )}
                    >
                      <Settings className="h-4 w-4 text-[#8B5CF6]" />
                      <span>Paramètres</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="border-t-2 border-neo-border py-2">
                    <button
                      onClick={handleSignOut}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2',
                        'text-red-500 hover:bg-red-500/10',
                        'font-mono text-sm uppercase tracking-wide',
                        'transition-colors duration-200'
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute left-0 right-0 top-full',
              'bg-neo-bg border-b-4 border-neo-border p-4',
              'xl:hidden'
            )}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neo-text/40" />
              <input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={cn(
                  'w-full pl-10 pr-4 h-12',
                  'bg-neo-surface border-2 border-neo-border',
                  'text-neo-text placeholder-neo-text/40',
                  'font-mono text-sm',
                  'focus:outline-none focus:border-neo-accent',
                  'shadow-[2px_2px_0px_0px_var(--neo-shadow)]'
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default NeoAdminHeader;
