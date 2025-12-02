'use client';

import { useState } from 'react';
import { signOut } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Menu,
  Bell,
} from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const getPageTitle = () => {
    if (pathname.includes('/albums')) return 'Albums Management';
    if (pathname.includes('/videos')) return 'Videos Management';
    if (pathname.includes('/services')) return 'Services Management';
    if (pathname.includes('/settings')) return 'System Settings';
    return 'Dashboard Overview';
  };

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
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--glass-border)] bg-obsidian/80 backdrop-blur-xl px-6 transition-all duration-300">
      {/* Left Section */}
      <div className="flex items-center gap-6 flex-1">
        {/* Mobile Menu Trigger */}
        <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-[var(--glass-active)]">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-white font-montserrat tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
            Admin Control Center
          </p>
        </div>

        {/* Search */}
        <div className="hidden xl:flex flex-1 max-w-md ml-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-neon-cyan transition-colors" />
            <Input
              type="search"
              placeholder="Search database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white placeholder-gray-600 focus:border-neon-cyan/50 focus:ring-neon-cyan/20 rounded-lg transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--glass-subtle)] transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-neon-magenta rounded-full shadow-[0_0_10px_#ff006e]" />
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-lg hover:bg-[var(--glass-subtle)] transition-all group border border-transparent hover:border-[var(--glass-border)]">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {getUserInitials()}
              </div>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                  {user.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  {user.role || 'Super Admin'}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-obsidian/95 backdrop-blur-xl border-[var(--glass-border)] text-white">
            <DropdownMenuLabel className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[var(--glass-active)]" />
            
            <div className="px-2 py-3 flex items-center gap-3">
               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold">
                  {getUserInitials()}
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.name || 'Administrator'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
               </div>
            </div>

            <DropdownMenuSeparator className="bg-[var(--glass-active)]" />

            <DropdownMenuItem className="focus:bg-[var(--glass-active)] focus:text-white cursor-pointer">
              <User className="mr-2 h-4 w-4 text-neon-cyan" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/${locale}/admin/settings`)} className="focus:bg-[var(--glass-active)] focus:text-white cursor-pointer">
              <Settings className="mr-2 h-4 w-4 text-neon-purple" />
              <span>Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-[var(--glass-active)]" />
            
            <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
