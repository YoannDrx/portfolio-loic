"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Settings, LogOut, User } from "lucide-react";
import { LanguageSwitcher } from "./ui/LanguageSwitcher";
import { PaletteSelector } from "./ui/PaletteSelector";
import { NeoLogo } from "./NeoLogo";
import { NeoLoginModal } from "./auth/NeoLoginModal";
import { useSession, signOut } from "@/lib/auth-client";

interface NavItem {
  key: string;
  path: "/" | "/about" | "/services" | "/albums" | "/videos" | "/contact";
}

const navItems: NavItem[] = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "albums", path: "/albums" },
  { key: "videos", path: "/videos" },
  { key: "contact", path: "/contact" },
];

export const NeoNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed w-full z-40 bg-neo-bg border-b-2 border-neo-border">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group flex-shrink-0">
          <NeoLogo className="w-9 h-9 lg:w-10 lg:h-10" />
          <div className="hidden lg:flex flex-col leading-none ml-2 text-neo-text">
            <span className="font-black tracking-tighter text-lg">LOÏC.GHANEM</span>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              {t("subtitle")}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-0 border-2 border-neo-border bg-neo-surface">
          {navItems.map((item, i, arr) => (
            <Link
              key={item.key}
              href={item.path}
              className={cn(
                "px-4 xl:px-6 py-2 font-mono text-xs font-bold uppercase transition-colors duration-150",
                i !== arr.length - 1 && "border-r-2 border-neo-border",
                isActive(item.path)
                  ? "bg-neo-accent text-neo-text-inverse"
                  : "text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 lg:gap-3 text-neo-text flex-shrink-0">
          {/* Admin Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2",
                  "font-mono text-xs font-bold uppercase",
                  "bg-neo-accent text-neo-text-inverse border-2 border-neo-border",
                  "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                  "hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                  "transition-all duration-150"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("admin")}</span>
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 min-w-[180px] bg-neo-bg border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 font-mono text-xs font-bold uppercase text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse transition-colors border-b-2 border-neo-border"
                    >
                      <Settings className="w-4 h-4" />
                      {t("dashboard")}
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 font-mono text-xs font-bold uppercase text-neo-text hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("logout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-2",
                "font-mono text-xs font-bold uppercase",
                "bg-neo-surface text-neo-text border-2 border-neo-border",
                "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                "hover:bg-neo-accent hover:text-neo-text-inverse",
                "hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                "transition-all duration-150"
              )}
            >
              <User className="w-4 h-4" />
              <span>{t("admin")}</span>
            </button>
          )}

          <PaletteSelector />
          <LanguageSwitcher />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 bg-neo-text hover:bg-neo-accent transition-colors duration-150"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <div
                className={cn(
                  "w-6 h-0.5 bg-neo-text-inverse transition-transform duration-150",
                  isMenuOpen && "rotate-45 translate-y-2"
                )}
              />
              <div
                className={cn(
                  "w-6 h-0.5 bg-neo-text-inverse transition-opacity duration-150",
                  isMenuOpen && "opacity-0"
                )}
              />
              <div
                className={cn(
                  "w-6 h-0.5 bg-neo-text-inverse transition-transform duration-150",
                  isMenuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute top-full left-0 w-full bg-neo-bg border-b-2 border-neo-border p-6 flex flex-col gap-4 lg:hidden z-50 transition-all duration-300",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            onClick={() => setIsMenuOpen(false)}
            className={cn(
              "text-2xl font-black uppercase transition-colors duration-150",
              isActive(item.path) ? "text-neo-accent" : "text-neo-text hover:text-neo-accent"
            )}
          >
            {t(item.key)}
          </Link>
        ))}

        {/* Mobile language switcher */}
        <div className="pt-4 border-t-2 border-neo-border">
          <LanguageSwitcher />
        </div>

        {/* Mobile Admin Button */}
        <div className="pt-4 border-t-2 border-neo-border">
          {isLoggedIn ? (
            <div className="space-y-3">
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-black uppercase text-neo-accent"
              >
                <Settings className="w-5 h-5" />
                {t("dashboard")}
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-2 text-xl font-black uppercase text-neo-text hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                {t("logout")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="flex items-center gap-2 text-xl font-black uppercase text-neo-text hover:text-neo-accent transition-colors"
            >
              <User className="w-5 h-5" />
              {t("admin")}
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <NeoLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default NeoNavbar;
