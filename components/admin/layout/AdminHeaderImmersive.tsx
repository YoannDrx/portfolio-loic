'use client';

import { useState, useCallback, useEffect } from 'react';
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
  Bell,
  ChevronRight,
  Home,
  Image,
  Video,
  Briefcase,
  FileText,
  LayoutDashboard,
  Mail,
  Check,
  CheckCheck,
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
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            {crumb.href && !isLast ? (
              <a
                href={crumb.href}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[var(--glass-hover)] transition-colors"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{crumb.label}</span>
              </a>
            ) : (
              <span className={cn(
                'flex items-center gap-1.5 px-2 py-1',
                isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
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
   NOTIFICATION BELL
   ============================================ */

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: { contentType?: string; contentId?: string };
  createdAt: string;
}

function NotificationBell({ locale }: { locale: string }) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/notifications?limit=10', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.items || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Erreur fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Marquer comme lu
  const markAsRead = async (ids: string[]) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erreur markAsRead:', error);
    }
  };

  // Marquer toutes comme lues
  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ markAllRead: true }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Erreur markAllAsRead:', error);
    }
  };

  // Naviguer vers le contenu
  const handleNotificationClick = (notif: Notification) => {
    if (!notif.read) {
      markAsRead([notif.id]);
    }
    if (notif.data?.contentType && notif.data?.contentId) {
      router.push(`/${locale}/admin/${notif.data.contentType}s/${notif.data.contentId}`);
    }
  };

  // Format date relative
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Icône selon le type
  const getIcon = (type: string, contentType?: string) => {
    if (type === 'contact_message') return Mail;
    if (contentType === 'album') return Image;
    if (contentType === 'video') return Video;
    if (contentType === 'service') return Briefcase;
    return Bell;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="relative p-2.5 rounded-xl hover:bg-[var(--glass-hover)] transition-colors text-muted-foreground hover:text-foreground group"
          variants={adminNotificationBell}
          initial="rest"
          animate={isAnimating ? 'ring' : 'rest'}
          onHoverStart={() => setIsAnimating(true)}
          onAnimationComplete={() => setIsAnimating(false)}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="h-5 w-5 group-hover:text-[var(--admin-neon-cyan)] transition-colors" />
          {unreadCount > 0 && (
            <motion.span
              className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[var(--admin-neon-magenta)] text-white rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{
                boxShadow: '0 0 10px var(--admin-neon-magenta)',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-[var(--admin-surface-solid)] backdrop-blur-xl border-[var(--glass-border)] text-foreground p-0"
        sideOffset={8}
      >
        <motion.div
          variants={adminHeaderDropdown}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
            <span className="text-sm font-bold">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-[var(--admin-neon-cyan)] hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Tout marquer lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const Icon = getIcon(notif.type, notif.data?.contentType);
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-[var(--glass-border-subtle)] last:border-b-0',
                      notif.read
                        ? 'hover:bg-[var(--glass-hover)]'
                        : 'bg-[var(--admin-neon-cyan)]/5 hover:bg-[var(--admin-neon-cyan)]/10'
                    )}
                  >
                    <div
                      className={cn(
                        'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
                        notif.type === 'contact_message'
                          ? 'bg-[var(--admin-neon-magenta)]/20'
                          : 'bg-[var(--admin-neon-cyan)]/20'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          notif.type === 'contact_message'
                            ? 'text-[var(--admin-neon-magenta)]'
                            : 'text-[var(--admin-neon-cyan)]'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDate(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--admin-neon-cyan)]" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
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
          className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl hover:bg-[var(--glass-hover)] transition-all group border border-transparent hover:border-[var(--glass-border)]"
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
            <span className="text-sm font-bold text-foreground group-hover:text-[var(--admin-neon-cyan)] transition-colors">
              {user.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {user.role || 'Super Admin'}
            </span>
          </div>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-[var(--admin-surface-solid)] backdrop-blur-xl border-[var(--glass-border)] text-foreground p-2"
        sideOffset={8}
      >
        <motion.div
          variants={adminHeaderDropdown}
          initial="hidden"
          animate="visible"
        >
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground px-2">
            Mon compte
          </DropdownMenuLabel>

          <div className="px-2 py-3 flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[var(--admin-neon-purple)] to-[var(--admin-neon-cyan)] flex items-center justify-center text-white font-bold">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name || 'Administrator'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-[var(--glass-border)] my-2" />

          <DropdownMenuItem
            onClick={() => router.push(`/${locale}/admin/settings`)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-[var(--glass-hover)] focus:text-foreground transition-colors"
          >
            <User className="h-4 w-4 text-[var(--admin-neon-cyan)]" />
            <span>Mon Profil</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/${locale}/admin/settings`)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer focus:bg-[var(--glass-hover)] focus:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4 text-[var(--admin-neon-purple)]" />
            <span>Paramètres</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[var(--glass-border)] my-2" />

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

export function AdminHeaderImmersive({ user, locale }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  }, [router, locale]);

  return (
    <motion.header
      className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--glass-border)] px-6 bg-glass-strong backdrop-blur-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Left Section - Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <AnimatedBreadcrumbs locale={locale} />
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        {/* Quick action: Back to site */}
        <motion.a
          href={`/${locale}`}
          className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-[var(--glass-hover)] transition-colors"
          whileHover={{ x: -2 }}
        >
          <Home className="h-4 w-4" />
          <span className="text-xs font-medium">Site</span>
        </motion.a>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-[var(--glass-border)] mx-2" />

        {/* Notifications */}
        <NotificationBell locale={locale} />

        {/* User Menu */}
        <UserMenu user={user} locale={locale} onSignOut={handleSignOut} />
      </div>
    </motion.header>
  );
}

export default AdminHeaderImmersive;
