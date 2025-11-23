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
  Search,
  Menu,
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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary shadow-sm transition-colors duration-300">
      {/* Left Section - Page Title & Search */}
      <div className="flex items-center gap-6 flex-1 px-6">
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
          <h1 className="text-2xl font-bold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">
            {getPageTitle()}
          </h1>
          <p className="text-sm text-admin-text-tertiary dark:text-dark-admin-text-tertiary mt-0.5 transition-colors duration-300">
            Gérez votre contenu facilement
          </p>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-tertiary dark:text-dark-admin-text-tertiary transition-colors duration-300" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-admin-bg-secondary dark:bg-dark-admin-bg-tertiary border-admin-border-light dark:border-dark-admin-border focus:border-admin-primary-300 dark:focus:border-admin-primary-600 focus:ring-2 focus:ring-admin-primary-100 dark:focus:ring-admin-primary-900/50 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Right Section - User Menu */}
      <div className="flex items-center gap-3 px-6">
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 h-12 pl-2 pr-4 rounded-xl hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 text-white font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow duration-200">
                {getUserInitials()}
              </div>
              {/* User Info */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-admin-text-primary dark:text-dark-admin-text-primary leading-tight transition-colors duration-300">
                  {user.name || "Admin"}
                </span>
                <span className="text-xs text-admin-text-tertiary dark:text-dark-admin-text-tertiary leading-tight transition-colors duration-300">
                  {user.role || "Administrateur"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-white dark:bg-dark-admin-bg-secondary border border-admin-border dark:border-dark-admin-border shadow-lg transition-colors duration-300"
          >
            <DropdownMenuLabel className="text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">
              Mon compte
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-admin-border dark:bg-dark-admin-border transition-colors duration-300" />

            {/* User Info */}
            <div className="px-2 py-3 space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-admin-primary-500 to-admin-accent-500 text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-admin-text-primary dark:text-dark-admin-text-primary truncate transition-colors duration-300">
                    {user.name || "Administrateur"}
                  </p>
                  <p className="text-xs text-admin-text-tertiary dark:text-dark-admin-text-tertiary truncate transition-colors duration-300">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-admin-border dark:bg-dark-admin-border transition-colors duration-300" />

            {/* Menu Items */}
            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/admin/settings`)}
              className="cursor-pointer text-admin-text-primary dark:text-dark-admin-text-primary hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary focus:bg-admin-bg-secondary dark:focus:bg-dark-admin-bg-tertiary transition-colors duration-200"
            >
              <User className="mr-2 h-4 w-4 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
              <span>Mon profil</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(`/${locale}/admin/settings`)}
              className="cursor-pointer text-admin-text-primary dark:text-dark-admin-text-primary hover:bg-admin-bg-secondary dark:hover:bg-dark-admin-bg-tertiary focus:bg-admin-bg-secondary dark:focus:bg-dark-admin-bg-tertiary transition-colors duration-200"
            >
              <Settings className="mr-2 h-4 w-4 text-admin-text-secondary dark:text-dark-admin-text-secondary" />
              <span>Paramètres</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-admin-border dark:bg-dark-admin-border transition-colors duration-300" />

            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-admin-danger-600 dark:text-admin-danger-400 hover:bg-admin-danger-50 dark:hover:bg-admin-danger-900/20 focus:bg-admin-danger-50 dark:focus:bg-admin-danger-900/20 font-medium transition-colors duration-200"
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
