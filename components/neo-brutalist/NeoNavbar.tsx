"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Settings, LogOut, User, Lock } from "lucide-react";
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

// Animation variants for fullscreen menu
const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const menuContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2 } },
};

export const NeoNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 50 && !isMenuOpen) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  const t = useTranslations("nav");
  const pathname = usePathname();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Block scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed w-full z-40 bg-neo-bg border-b-2 border-neo-border transition-transform duration-300",
        !isVisible && !isMenuOpen ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 py-3 lg:py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group flex-shrink-0">
          <NeoLogo className="w-9 h-9 lg:w-10 lg:h-10" />
          <div className="hidden lg:flex flex-col leading-none ml-2 text-neo-text">
            <span className="font-black tracking-tighter text-lg">LOÏC.GHANEM</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-neo-border">
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
        <div className="flex items-center gap-2 text-neo-text flex-shrink-0">
          {/* Admin Button */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-9 h-9 flex items-center justify-center bg-neo-accent text-neo-text-inverse border-2 border-neo-border hover:bg-neo-accent/80 transition-colors duration-150"
              >
                <User className="w-4 h-4" />
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
              className="hidden lg:flex w-9 h-9 items-center justify-center bg-neo-surface text-neo-text border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse transition-colors duration-150"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          <PaletteSelector />
          <LanguageSwitcher />

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center bg-neo-text border-2 border-neo-border hover:bg-neo-accent transition-colors duration-150 relative z-[60] overflow-visible"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col justify-center items-center gap-1">
              <div
                className={cn(
                  "w-5 h-0.5 bg-neo-text-inverse transition-all duration-150 origin-center",
                  isMenuOpen && "rotate-45 translate-y-[3px]"
                )}
              />
              <div
                className={cn(
                  "w-5 h-0.5 bg-neo-text-inverse transition-all duration-150",
                  isMenuOpen && "opacity-0 scale-0"
                )}
              />
              <div
                className={cn(
                  "w-5 h-0.5 bg-neo-text-inverse transition-all duration-150 origin-center",
                  isMenuOpen && "-rotate-45 -translate-y-[3px]"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Fullscreen Neo-Brutalist */}
      {isMenuOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              variants={menuOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-[60] lg:hidden bg-neo-bg overflow-y-auto"
            >
              {/* Header Mirror for accurate button positioning */}
              <div className="container mx-auto px-3 sm:px-4 py-3 lg:py-4 flex justify-end items-center pointer-events-none sticky top-0 z-[70]">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center bg-neo-text border-2 border-neo-border hover:bg-neo-accent transition-colors duration-150 pointer-events-auto"
                  aria-label={t("close")}
                >
                  <div className="relative w-5 h-5">
                    <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-neo-text-inverse -translate-x-1/2 -translate-y-1/2 rotate-45 origin-center" />
                    <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-neo-text-inverse -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-center" />
                  </div>
                </button>
              </div>

              {/* Grid pattern background */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--neo-border) 1px, transparent 1px), linear-gradient(90deg, var(--neo-border) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Geometric decorations */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-20 right-8 w-20 h-20 border-4 border-neo-accent opacity-20"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute bottom-32 left-8 w-16 h-16 bg-neo-accent opacity-10"
              />

              {/* Navigation content */}
              <div className="min-h-screen flex flex-col justify-center px-8 pt-20 pb-16">
                <motion.nav
                  variants={menuContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-2"
                >
                  {navItems.map((item, index) => (
                    <motion.div key={item.key} variants={menuItemVariants}>
                      <Link
                        href={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "block py-3 text-3xl sm:text-4xl font-black uppercase tracking-tight transition-all duration-200",
                          "border-b-2 border-neo-border/20 hover:border-neo-accent hover:pl-4",
                          isActive(item.path)
                            ? "text-neo-accent"
                            : "text-neo-text hover:text-neo-accent"
                        )}
                      >
                        <span className="font-mono text-sm text-neo-accent mr-4">0{index + 1}</span>
                        {t(item.key)}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Actions section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 pt-4 border-t-2 border-neo-border/30"
                >
                  {/* Icons row: Language, Palette, Admin */}
                  <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <PaletteSelector />
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="p-2 border-2 border-neo-border bg-neo-accent text-white hover:bg-neo-accent/80 transition-colors"
                          aria-label={t("dashboard")}
                        >
                          <Settings className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            signOut();
                          }}
                          className="p-2 border-2 border-neo-border bg-neo-surface text-neo-text hover:bg-red-500 hover:text-white transition-colors"
                          aria-label={t("logout")}
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLoginModalOpen(true);
                        }}
                        className="p-2 border-2 border-neo-border bg-neo-surface text-neo-text hover:bg-neo-accent hover:text-white transition-colors"
                        aria-label={t("admin")}
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {/* Login Modal */}
      <NeoLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default NeoNavbar;
