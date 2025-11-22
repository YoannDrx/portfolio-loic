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
  Bell,
  Home,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AdminSidebarProps {
  locale: string;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
    color: "text-admin-primary-500",
    bgHover: "hover:bg-admin-primary-50",
    badge: null,
  },
  {
    icon: Image,
    label: "Albums",
    href: "/admin/albums",
    color: "text-admin-accent-500",
    bgHover: "hover:bg-admin-accent-50",
    badge: null,
  },
  {
    icon: Video,
    label: "Vidéos",
    href: "/admin/videos",
    color: "text-neon-magenta",
    bgHover: "hover:bg-pink-50",
    badge: null,
  },
  {
    icon: Briefcase,
    label: "Services",
    href: "/admin/services",
    color: "text-neon-cyan",
    bgHover: "hover:bg-cyan-50",
    badge: null,
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/admin/settings",
    color: "text-admin-text-secondary",
    bgHover: "hover:bg-gray-50",
    badge: null,
  },
];

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden w-72 flex-col bg-white border-r border-admin-border shadow-sm lg:flex">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-admin-border">
        <Link href={`/${locale}/admin`} className="flex items-center gap-3 group">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 shadow-md group-hover:shadow-lg transition-shadow duration-200">
            <span className="text-lg font-bold text-white">LG</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-admin-primary-400 to-admin-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-admin-text-primary tracking-tight">
              Admin Panel
            </span>
            <span className="text-xs text-admin-text-tertiary">
              Loïc Ghanem
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3 text-xs font-semibold text-admin-text-tertiary uppercase tracking-wider">
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
                  ? "bg-gradient-to-r from-admin-primary-500 to-admin-accent-500 text-white shadow-md shadow-admin-primary-200"
                  : `text-admin-text-secondary ${item.bgHover}`
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
                  "font-semibold",
                  isActive ? "text-white" : "text-admin-text-primary"
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
      <div className="border-t border-admin-border bg-admin-bg-secondary p-4">
        <div className="rounded-lg bg-white border border-admin-border-light p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-admin-success-500" />
            <span className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wide">
              Activité récente
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-admin-text-secondary">Vues aujourd'hui</span>
              <span className="font-bold text-admin-primary-600">1,234</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-admin-text-secondary">Contenus publiés</span>
              <span className="font-bold text-admin-accent-600">42</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-admin-border p-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-admin-text-secondary hover:bg-admin-bg-secondary hover:text-admin-primary-600 transition-all duration-200 group"
        >
          <Home className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span>Retour au site</span>
        </Link>
      </div>
    </div>
  );
}
