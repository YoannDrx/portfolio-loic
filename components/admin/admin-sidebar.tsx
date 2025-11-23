"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Image,
  Video,
  Briefcase,
  Settings,
  TrendingUp,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface AdminSidebarProps {
  locale: string;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    color: "text-admin-primary-500",
    bgHover: "hover:bg-admin-primary-50 dark:hover:bg-admin-primary-900/20",
    badge: null,
  },
  {
    icon: Image,
    label: "Albums",
    href: "/admin/albums",
    color: "text-admin-accent-500",
    bgHover: "hover:bg-admin-accent-50 dark:hover:bg-admin-accent-900/20",
    badge: null,
  },
  {
    icon: Video,
    label: "Vidéos",
    href: "/admin/videos",
    color: "text-neon-magenta",
    bgHover: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    badge: null,
  },
  {
    icon: Briefcase,
    label: "Services",
    href: "/admin/services",
    color: "text-neon-cyan",
    bgHover: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20",
    badge: null,
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/admin/settings",
    color: "text-admin-text-secondary dark:text-dark-admin-text-secondary",
    bgHover: "hover:bg-gray-50 dark:hover:bg-dark-admin-bg-tertiary",
    badge: null,
  },
];

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden w-72 flex-col bg-white dark:bg-dark-admin-bg-secondary border-r border-admin-border dark:border-dark-admin-border shadow-sm transition-colors duration-300 lg:flex">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-admin-border dark:border-dark-admin-border">
        <Link href={`/${locale}/admin`} className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
            <span className="text-lg font-bold text-white relative z-10">LG</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-admin-text-primary dark:text-dark-admin-text-primary tracking-tight transition-colors duration-300">
              Admin Panel
            </span>
            <span className="text-xs text-admin-text-tertiary dark:text-dark-admin-text-tertiary transition-colors duration-300">
              Loïc Ghanem
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3 text-xs font-semibold text-admin-text-tertiary dark:text-dark-admin-text-tertiary uppercase tracking-wider transition-colors duration-300">
          Menu Principal
        </div>
        {menuItems.map((item) => {
          const isActive =
            pathname === `/${locale}${item.href}` ||
            (item.href !== "/admin" &&
              pathname.startsWith(`/${locale}${item.href}`));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-admin-primary-500 to-admin-accent-500 text-white shadow-md shadow-admin-primary-200 dark:shadow-admin-primary-900/50"
                  : `text-admin-text-secondary dark:text-dark-admin-text-secondary ${item.bgHover}`
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : item.color
                  )}
                />
                <span className={cn(
                  "font-semibold transition-colors duration-300",
                  isActive ? "text-white" : "text-admin-text-primary dark:text-dark-admin-text-primary"
                )}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <Badge
                  variant={isActive ? "secondary" : "default"}
                  className="h-5 px-2 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="border-t border-admin-border dark:border-dark-admin-border bg-admin-bg-secondary dark:bg-dark-admin-bg p-4 transition-colors duration-300">
        <div className="rounded-lg bg-white dark:bg-dark-admin-bg-tertiary border border-admin-border-light dark:border-dark-admin-border-light p-3 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-admin-success-500" />
            <span className="text-xs font-semibold text-admin-text-secondary dark:text-dark-admin-text-secondary uppercase tracking-wide transition-colors duration-300">
              Activité récente
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">Vues aujourd'hui</span>
              <span className="font-bold text-admin-primary-600 dark:text-admin-primary-400 transition-colors duration-300">1,234</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-admin-text-secondary dark:text-dark-admin-text-secondary transition-colors duration-300">Contenus publiés</span>
              <span className="font-bold text-admin-accent-600 dark:text-admin-accent-400 transition-colors duration-300">42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-admin-border dark:border-dark-admin-border p-4 transition-colors duration-300">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-admin-text-secondary dark:text-dark-admin-text-secondary hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary hover:text-admin-primary-600 dark:hover:text-admin-primary-400 transition-all duration-200 group flex-1"
          >
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span>Retour au site</span>
          </Link>
          <ThemeSwitcher className="h-10 w-10 rounded-lg hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary" />
        </div>
      </div>
    </div>
  );
}
