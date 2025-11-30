'use client';

import { useState, useCallback } from 'react';
import { signOut } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  User,
  Settings,
  Search,
  Bell,
  Command,
  ChevronRight,
  Home,
  Image,
  Video,
  Briefcase,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import {
  adminHeaderDropdown,
  adminNotificationBell,
} from '@/lib/animations';

/* ============================================
   TYPES
   ============================================ */

interface AdminHeaderProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  locale: string;
  onOpenCommandPalette?: () => void;
}

/* ============================================
   BREADCRUMB CONFIG
   ============================================ */

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: typeof LayoutDashboard;
}

const getBreadcrumbs = (pathname: string, locale: string): BreadcrumbItem[] => {
  const parts = pathname.replace(`/${locale}/admin`, '').split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: `/${locale}/admin`, icon: LayoutDashboard },
  ];

  const routeConfig: Record<string, { label: string; icon: typeof LayoutDashboard }> = {
    albums: { label: 'Albums', icon: Image },
    videos: { label: 'Vidéos', icon: Video },
    services: { label: 'Services', icon: Briefcase },
    settings: { label: 'Paramètres', icon: Settings },
    cv: { label: 'CV / Resume', icon: FileText },
    new: { label: 'Nouveau', icon: undefined as unknown as typeof LayoutDashboard },
  };

  parts.forEach((part, index) => {
    const config = routeConfig[part];
    if (config) {
      breadcrumbs.push({
        label: config.label,
        href: `/${locale}/admin/${parts.slice(0, index + 1).join('/')}`,
        icon: config.icon,
      });
    } else if (part !== 'new' && part.length > 0) {
      // It's likely an ID, show as "Édition"
      breadcrumbs.push({ label: 'Édition' });
    }
  });

  return breadcrumbs;
};

/* ============================================
   ANIMATED BREADCRUMBS
   ============================================ */

function AnimatedBreadcrumbs({ locale }: { locale: string }) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname, locale);

  return (
    <nav className="hidden md:flex items-center gap-1 text-sm">
      {breadcrumbs.map((crumb, index) => {
        const Icon = crumb.icon;
        const isLast = index === breadcrumbs.length - 1;

        return (
          <motion.div
            key={index}
            className="flex items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            )}
            {crumb.href && !isLast ? (
              <a
                href={crumb.href}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{crumb.label}</span>
              </a>
            ) : (
              <span className={cn(
                'flex items-center gap-1.5 px-2 py-1',
                isLast ? 'text-white font-medium' : 'text-neutral-400'
              )}>
                {Icon && <Icon className="h-4 w-4" />}
                <span>{crumb.label}</span>
              </span>
            )}
          </motion.div>
        );
      })}
    </nav>
  );
}

/* ============================================
   SEARCH TRIGGER
   ============================================ */

interface SearchTriggerProps {
  onClick?: () => void;
}

function SearchTrigger({ onClick }: SearchTriggerProps) {
  return (
    <motion.button
      onClick={onClick}
      className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/[0.05] transition-all group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Search className="h-4 w-4 group-hover:text-[var(--admin-neon-cyan)] transition-colors" />
      <span className="text-sm">Rechercher...</span>
      <div className="flex items-center gap-1 ml-8 px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-neutral-500">
        <Command className="h-3 w-3" />
        <span>K</span>
      </div>
    </motion.button>
  );
}

/* ============================================
   NOTIFICATION BELL
   ============================================ */

interface NotificationBellProps {
  count?: number;
}

function NotificationBell({ count = 3 }: NotificationBellProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <motion.button
      className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors text-neutral-400 hover:text-white group"
      variants={adminNotificationBell}
      initial="rest"
      animate={isAnimating ? 'ring' : 'rest'}
      onHoverStart={() => setIsAnimating(true)}
      onAnimationComplete={() => setIsAnimating(false)}
      whileTap={{ scale: 0.95 }}
    >
      <Bell className="h-5 w-5 group-hover:text-[var(--admin-neon-cyan)] transition-colors" />
      {count > 0 && (
        <motion.span
          className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[var(--admin-neon-magenta)] text-white rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          style={{
            boxShadow: '0 0 10px var(--admin-neon-magenta)',
          }}
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </motion.button>
  );
}

/* ============================================
   USER MENU
   ============================================ */

interface UserMenuProps {
  user: AdminHeaderProps['user'];
  locale: string;
  onSignOut: () => void;
}

function UserMenu({ user, locale, onSignOut }: UserMenuProps) {
  const router = useRouter();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--admin-neon-purple)] to-[var(--admin-neon-cyan)] flex items-center justify-center text-white font-bold text-sm"
            whileHover={{
              boxShadow: '0 0 20px rgba(161, 0, 242, 0.5)',
            }}
          >
            {getUserInitials()}
          </motion.div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-bold text-white group-hover:text-[var(--admin-neon-cyan)] transition-colors">
              {user.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">
              {user.role || 'Super Admin'}
            </span>
          </div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-[var(--admin-surface-solid)] backdrop-blur-xl border-white/10 text-white p-2"
        sideOffset={8}
      >
        <motion.div
          variants={adminHeaderDropdown}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 px-2">
            Mon compte
          </DropdownMenuLabel>

          <div className="px-2 py-3 flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--admin-neon-purple)] to-[var(--admin-neon-cyan)] flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name || 'Administrator'}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-white/10 my-2" />

          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-white/10 focus:text-white transition-colors"
          >
            <User className="h-4 w-4 text-[var(--admin-neon-cyan)]" />
            <span>Profil</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${locale}/admin/settings`)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-white/10 focus:text-white transition-colors"
          >
            <Settings className="h-4 w-4 text-[var(--admin-neon-purple)]" />
            <span>Paramètres</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/10 my-2" />

          <DropdownMenuItem
            onClick={onSignOut}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ============================================
   MAIN HEADER COMPONENT
   ============================================ */

export function AdminHeaderImmersive({ user, locale, onOpenCommandPalette }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  }, [router, locale]);

  return (
    <motion.header
      className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 px-6"
      style={{
        background: 'linear-gradient(180deg, rgba(9, 9, 11, 0.95) 0%, rgba(9, 9, 11, 0.8) 100%)',
        backdropFilter: 'blur(24px)',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <AnimatedBreadcrumbs locale={locale} />
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 flex justify-center">
        <SearchTrigger onClick={onOpenCommandPalette} />
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Quick action: Back to site */}
        <motion.a
          href={`/${locale}`}
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          whileHover={{ x: -2 }}
        >
          <Home className="h-4 w-4" />
          <span className="text-xs font-medium">Site</span>
        </motion.a>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-white/10 mx-2" />

        {/* Notifications */}
        <NotificationBell count={3} />

        {/* User Menu */}
        <UserMenu user={user} locale={locale} onSignOut={handleSignOut} />
      </div>
    </motion.header>
  );
}

export default AdminHeaderImmersive;
