"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LogOut,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  Sun,
  Moon,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
  locale: string;
}

export function AdminHeader({ user, locale }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsCount] = useState(3);

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  // Get current page title from pathname
  const getPageTitle = () => {
    if (pathname.includes("/albums")) return "Albums";
    if (pathname.includes("/videos")) return "Vidéos";
    if (pathname.includes("/services")) return "Services";
    if (pathname.includes("/settings")) return "Paramètres";
    return "Dashboard";
  };

  // Get user initials
  const getUserInitials = () => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-admin-border bg-white px-6 shadow-sm">
      {/* Left Section - Page Title & Search */}
      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-admin-text-primary">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-admin-text-tertiary mt-0.5">
            Gérez votre contenu facilement
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-tertiary" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-admin-bg-secondary border-admin-border-light focus:border-admin-primary-300 focus:ring-2 focus:ring-admin-primary-100 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Actions & User Menu */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-lg hover:bg-admin-bg-secondary"
          >
            <HelpCircle className="h-5 w-5 text-admin-text-secondary" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-lg hover:bg-admin-bg-secondary"
          >
            <Bell className="h-5 w-5 text-admin-text-secondary" />
            {notificationsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-admin-danger-500"
              >
                {notificationsCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-8 w-px bg-admin-border" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 h-12 pl-2 pr-4 rounded-xl hover:bg-admin-bg-secondary transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow duration-200">
                {getUserInitials()}
              </div>
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-admin-text-primary leading-tight">
                  {user.name || "Admin"}
                </span>
                <span className="text-xs text-admin-text-tertiary leading-tight">
                  {user.role || "Administrateur"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-white border border-admin-border shadow-lg"
          >
            <DropdownMenuLabel className="text-admin-text-primary">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-admin-border" />

            {/* User Info */}
            <div className="px-2 py-3 space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-admin-text-primary truncate">
                    {user.name || "Administrateur"}
                  </p>
                  <p className="text-xs text-admin-text-tertiary truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-admin-border" />

            {/* Menu Items */}
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/admin/settings`)}
              className="cursor-pointer text-admin-text-primary hover:bg-admin-bg-secondary focus:bg-admin-bg-secondary"
            >
              <User className="mr-2 h-4 w-4 text-admin-text-secondary" />
              <span>Mon profil</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/admin/settings`)}
              className="cursor-pointer text-admin-text-primary hover:bg-admin-bg-secondary focus:bg-admin-bg-secondary"
            >
              <Settings className="mr-2 h-4 w-4 text-admin-text-secondary" />
              <span>Paramètres</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-admin-border" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-admin-danger-600 hover:bg-admin-danger-50 focus:bg-admin-danger-50 font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
