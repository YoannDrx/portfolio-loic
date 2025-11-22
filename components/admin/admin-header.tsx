"use client";

import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

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

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">
          Panneau d&apos;administration
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user.name || user.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </div>
            <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-500">
              Rôle: {user.role}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
