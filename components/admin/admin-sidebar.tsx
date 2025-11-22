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
} from "lucide-react";

interface AdminSidebarProps {
  locale: string;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Image,
    label: "Albums",
    href: "/admin/albums",
  },
  {
    icon: Video,
    label: "Vidéos",
    href: "/admin/videos",
  },
  {
    icon: Briefcase,
    label: "Services",
    href: "/admin/services",
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/admin/settings",
  },
];

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <Link href={`/${locale}/admin`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">LG</span>
          </div>
          <span className="text-lg font-semibold">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <span>← Retour au site</span>
        </Link>
      </div>
    </div>
  );
}
