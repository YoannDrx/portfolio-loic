'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Command,
  Search,
  ClipboardList,
} from 'lucide-react';
import {
  adminSidebarItem,
  staggerContainer,
  staggerItem,
} from '@/lib/animations';

/* ============================================
   TYPES
   ============================================ */

interface AdminSidebarProps {
  locale: string;
  onOpenCommandPalette?: () => void;
}

interface MenuItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  color: string;
  glowColor: string;
  badge?: number;
}

/* ============================================
   MENU CONFIGURATION
   ============================================ */

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/admin',
    color: 'text-[var(--admin-neon-cyan)]',
    glowColor: 'var(--admin-glow-cyan-md)',
  },
  {
    icon: Image,
    label: 'Albums',
    href: '/admin/albums',
    color: 'text-[var(--admin-neon-lime)]',
    glowColor: 'var(--admin-glow-lime-md)',
  },
  {
    icon: Video,
    label: 'Vidéos',
    href: '/admin/videos',
    color: 'text-[var(--admin-neon-magenta)]',
    glowColor: 'var(--admin-glow-magenta-md)',
  },
  {
    icon: Briefcase,
    label: 'Services',
    href: '/admin/services',
    color: 'text-[var(--admin-neon-purple)]',
    glowColor: 'var(--admin-glow-purple-md)',
  },
  {
    icon: FileText,
    label: 'CV / Resume',
    href: '/admin/cv',
    color: 'text-[var(--admin-neon-orange)]',
    glowColor: '0 0 20px rgba(255, 107, 53, 0.5)',
  },
  {
    icon: ClipboardList,
    label: 'Journal',
    href: '/admin/logs',
    color: 'text-[var(--admin-neon-cyan)]',
    glowColor: 'var(--admin-glow-cyan-md)',
  },
  {
    icon: Settings,
    label: 'Paramètres',
    href: '/admin/settings',
    color: 'text-muted-foreground',
    glowColor: '0 0 20px rgba(255, 255, 255, 0.2)',
  },
];

/* ============================================
   ANIMATED COUNTER
   ============================================ */

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

/* ============================================
   SIDEBAR MENU ITEM
   ============================================ */

interface SidebarMenuItemProps {
  item: MenuItem;
  isActive: boolean;
  locale: string;
  index: number;
  onClick?: () => void;
}

function SidebarMenuItem({ item, isActive, locale, index, onClick }: SidebarMenuItemProps) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={staggerItem}
      custom={index}
    >
      <Link
        href={`/${locale}${item.href}`}
        onClick={onClick}
        className="block"
      >
        <motion.div
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
            isActive
              ? 'text-foreground bg-[var(--glass-active)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-[var(--glass-subtle)]'
          )}
          variants={adminSidebarItem}
          initial="rest"
          whileHover="hover"
          animate={isActive ? 'active' : 'rest'}
          style={{
            boxShadow: isActive ? item.glowColor : 'none',
          }}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              style={{
                background: `linear-gradient(180deg, ${item.color.includes('cyan') ? 'var(--admin-neon-cyan)' : item.color.includes('lime') ? 'var(--admin-neon-lime)' : item.color.includes('magenta') ? 'var(--admin-neon-magenta)' : item.color.includes('purple') ? 'var(--admin-neon-purple)' : item.color.includes('orange') ? 'var(--admin-neon-orange)' : '#fff'} 0%, transparent 100%)`,
              }}
              layoutId="activeIndicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          {/* Icon */}
          <motion.div
            className={cn(
              'relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300',
              isActive ? 'bg-[var(--glass-active)]' : 'bg-transparent group-hover:bg-[var(--glass-subtle)]'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon
              className={cn(
                'h-5 w-5 transition-all duration-300',
                isActive ? item.color : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
          </motion.div>

          {/* Label */}
          <span className="font-semibold tracking-wide flex-1">{item.label}</span>

          {/* Badge */}
          {item.badge && (
            <motion.span
              className={cn(
                'px-2 py-0.5 text-xs font-bold rounded-full',
                isActive ? 'bg-[var(--glass-active)] text-foreground' : 'bg-[var(--glass-active)] text-muted-foreground'
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {item.badge}
            </motion.span>
          )}

          {/* Hover chevron */}
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -5, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${item.color.includes('cyan') ? 'rgba(0, 240, 255, 0.1)' : item.color.includes('lime') ? 'rgba(213, 255, 10, 0.1)' : item.color.includes('magenta') ? 'rgba(255, 0, 110, 0.1)' : item.color.includes('purple') ? 'rgba(161, 0, 242, 0.1)' : 'rgba(255, 255, 255, 0.05)'} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* ============================================
   QUICK STATS CARD (Real Data)
   ============================================ */

interface StatsData {
  totalContent: number;
  totalPublished: number;
  publishRate: number;
}

function QuickStatsCard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/stats', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalContent: data.totalContent ?? 0,
            totalPublished: data.totalPublished ?? 0,
            publishRate: data.publishRate ?? 0,
          });
        } else {
          console.error('Stats API error:', res.status);
          setError(true);
        }
      } catch (err) {
        console.error('Erreur fetch stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="relative overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl p-4"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-xl opacity-50">
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(161, 0, 242, 0.1) 50%, rgba(213, 255, 10, 0.1) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-4 w-4 text-[var(--admin-neon-lime)]" />
          </motion.div>
          <span className="text-xs font-bold text-[var(--admin-neon-lime)] uppercase tracking-widest">
            Contenus
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-24 bg-[var(--glass-active)] rounded animate-pulse" />
            <div className="h-1 w-full bg-[var(--glass-active)] rounded" />
            <div className="h-4 w-20 bg-[var(--glass-active)] rounded animate-pulse" />
            <div className="h-1 w-full bg-[var(--glass-active)] rounded" />
          </div>
        ) : error ? (
          <div className="text-center py-2">
            <span className="text-xs text-muted-foreground">Impossible de charger</span>
          </div>
        ) : stats ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="font-mono font-bold text-foreground text-sm">
                <AnimatedCounter value={stats.totalContent} />
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[var(--glass-active)] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--admin-neon-cyan)] to-[var(--admin-neon-lime)]"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Publiés</span>
              <span className="font-mono font-bold text-[var(--admin-neon-cyan)] text-sm">
                <AnimatedCounter value={stats.totalPublished} duration={1000} />
              </span>
            </div>
            <div className="w-full h-1 rounded-full bg-[var(--glass-active)] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--admin-neon-magenta)] to-[var(--admin-neon-purple)]"
                initial={{ width: 0 }}
                animate={{ width: `${stats.publishRate}%` }}
                transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="text-center pt-2">
              <span className="text-[10px] text-muted-foreground">
                {stats.publishRate}% publiés
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ============================================
   MOBILE SIDEBAR
   ============================================ */

function MobileSidebar({
  locale,
  isOpen,
  onClose,
}: {
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 bottom-0 w-72 bg-[var(--admin-bg)] border-r border-[var(--glass-border)] z-50 lg:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--glass-active)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex h-20 items-center px-6 border-b border-[var(--glass-border)]">
                <Link href={`/${locale}/admin`} onClick={onClose} className="flex items-center gap-3 group">
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform">
                    <div className="w-full h-full bg-[var(--admin-bg)] rounded-lg flex items-center justify-center">
                      <span className="text-xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">
                        LG
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-foreground tracking-tight">Loïc Ghanem</span>
                    <span className="text-xs text-neon-lime uppercase tracking-widest">Admin Panel</span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {menuItems.map((item, index) => {
                    const isActive =
                      pathname === `/${locale}${item.href}` ||
                      (item.href !== '/admin' && pathname.startsWith(`/${locale}${item.href}`));

                    return (
                      <SidebarMenuItem
                        key={item.href}
                        item={item}
                        isActive={isActive}
                        locale={locale}
                        index={index}
                        onClick={onClose}
                      />
                    );
                  })}
                </motion.div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-[var(--glass-border)]">
                <Link
                  href={`/${locale}`}
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--glass-subtle)] transition-colors"
                >
                  <Home className="h-5 w-5" />
                  <span>Retour au site</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   MAIN SIDEBAR COMPONENT
   ============================================ */

export function AdminSidebarImmersive({ locale, onOpenCommandPalette }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-[var(--glass-active)] backdrop-blur-xl border border-[var(--glass-border)] text-foreground lg:hidden admin-hover-glow-cyan"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sidebar */}
      <MobileSidebar
        locale={locale}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Desktop sidebar */}
      <motion.div
        className="hidden w-72 flex-col border-r border-[var(--glass-border)] lg:flex z-20"
        style={{
          background: 'var(--gradient-admin-sidebar)',
          backdropFilter: 'blur(24px)',
        }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo Section */}
        <div className="flex h-20 items-center px-6 border-b border-[var(--glass-border)]">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 group">
            <motion.div
              className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform"
              whileHover={{ rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <div className="w-full h-full bg-[var(--admin-bg)] rounded-lg flex items-center justify-center">
                <span className="text-xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">
                  LG
                </span>
              </div>
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  boxShadow: '0 0 30px rgba(213, 255, 10, 0.5)',
                }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground tracking-tight font-montserrat">
                Loïc Ghanem
              </span>
              <span className="text-xs text-neon-lime uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Command Palette Button */}
        <div className="px-4 py-3 border-b border-[var(--glass-border)]">
          <motion.button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] text-muted-foreground hover:text-foreground hover:border-[var(--glass-border-strong)] hover:bg-[var(--glass-subtle)] transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="h-4 w-4 text-muted-foreground group-hover:text-[var(--admin-neon-cyan)] transition-colors" />
            <span className="flex-1 text-left text-sm">Rechercher...</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--glass-active)] text-xs font-mono text-muted-foreground">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="px-3 mb-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            Menu Principal
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            {menuItems.map((item, index) => {
              const isActive =
                pathname === `/${locale}${item.href}` ||
                (item.href !== '/admin' && pathname.startsWith(`/${locale}${item.href}`));

              return (
                <SidebarMenuItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  locale={locale}
                  index={index}
                />
              );
            })}
          </motion.div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <QuickStatsCard />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-[var(--glass-subtle)] transition-all group"
            >
              <Home className="h-5 w-5 group-hover:text-[var(--admin-neon-cyan)] transition-colors" />
              <span>Retour au site</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default AdminSidebarImmersive;
