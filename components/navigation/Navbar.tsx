'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Lock, User, Disc, Film, Mail, Home, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useSession } from '@/lib/auth-client';

const navLinks = [
  { href: '/', key: 'home', icon: Home },
  { href: '/about', key: 'about', icon: User },
  { href: '/services', key: 'services', icon: Sparkles },
  { href: '/albums', key: 'albums', icon: Disc },
  { href: '/videos', key: 'videos', icon: Film },
  { href: '/contact', key: 'contact', icon: Mail },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isMobileMenuOpen ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-glass-strong backdrop-blur-xl border-b border-[var(--glass-border)] shadow-lg shadow-primary/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,255,0,0.2)]">
                <div className="w-full h-full bg-zinc-900 dark:bg-zinc-950 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">LG</span>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="text-xl font-black text-foreground transition-all duration-300 font-montserrat tracking-tight">
                  LOÏC<span className="text-primary dark:text-neon-lime">.GHANEM</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Music Composer</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium text-sm uppercase tracking-widest transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-primary dark:text-neon-lime'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t(link.key)}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-neon-lime shadow-[0_0_10px_var(--accent-glow)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}

              {/* Admin Section - Affichage conditionnel */}
              <div className="ml-2">
                {isPending ? (
                  // État de chargement
                  <div className="w-9 h-9 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : session?.user ? (
                  // Utilisateur connecté
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] flex items-center gap-2 hover:bg-[var(--glass-active)] hover:border-primary/50 transition-all duration-300 group"
                    title="Panel Admin"
                  >
                    <User className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground uppercase tracking-wider">
                      Admin
                    </span>
                  </Link>
                ) : (
                  // Utilisateur non connecté
                  <Link
                    href="/login"
                    className="w-9 h-9 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--glass-active)] hover:border-primary/50 transition-all duration-300 group"
                    title="Admin Login"
                  >
                    <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </Link>
                )}
              </div>

              {/* Theme Switcher */}
              <div className="ml-2">
                <ThemeSwitcher className="w-9 h-9 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] hover:bg-[var(--glass-active)] transition-all duration-300" />
              </div>

              {/* Language Toggle */}
              <div className="ml-2">
                <LanguageToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-[var(--glass-active)] transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground transition-colors duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-foreground transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Fullscreen Immersive */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] lg:hidden overflow-hidden"
          >
            {/* Animated Background - Solid opaque */}
            <div className="absolute inset-0 bg-[#0a0a0f]">
              {/* Gradient orbs */}
              <motion.div
                className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-neon-lime/10 blur-[100px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-neon-cyan/10 blur-[100px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                }}
              />
            </div>

            {/* Header with logo and close button */}
            <div className="absolute top-0 left-0 right-0 h-20 flex items-center justify-between px-4 z-10">
              {/* Logo */}
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px]">
                  <div className="w-full h-full bg-[#0a0a0f] rounded-lg flex items-center justify-center">
                    <span className="text-xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">LG</span>
                  </div>
                </div>
              </Link>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-neon-lime/50 transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white group-hover:text-neon-lime transition-colors" />
              </motion.button>
            </div>

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-6 pt-20 pb-8">
              {/* Navigation Links */}
              <nav className="space-y-1 flex-1 flex flex-col justify-center">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isLinkActive = isActive(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{
                        delay: index * 0.06,
                        type: "spring",
                        stiffness: 120,
                        damping: 20
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="group flex items-center gap-4 py-3 relative"
                      >
                        {/* Icon */}
                        <motion.div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isLinkActive
                              ? 'bg-neon-lime/20 border border-neon-lime/50 shadow-[0_0_20px_rgba(213,255,10,0.2)]'
                              : 'bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-neon-lime/30'
                          }`}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Icon className={`w-5 h-5 transition-colors duration-300 ${
                            isLinkActive ? 'text-neon-lime' : 'text-white/60 group-hover:text-neon-lime'
                          }`} />
                        </motion.div>

                        {/* Text */}
                        <span className={`text-2xl font-black uppercase tracking-wide transition-all duration-300 ${
                          isLinkActive
                            ? 'text-neon-lime'
                            : 'text-white/80 group-hover:text-white'
                        }`}>
                          {t(link.key)}
                        </span>

                        {/* Active indicator */}
                        {isLinkActive && (
                          <motion.div
                            layoutId="mobile-nav-indicator"
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-lime rounded-full shadow-[0_0_15px_rgba(213,255,10,0.6)]"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-6 border-t border-white/10"
              >
                {/* Row with Admin, Theme, Language */}
                <div className="flex items-center justify-between">
                  {/* Admin Link */}
                  {!isPending && (
                    <Link
                      href={session?.user ? "/admin" : "/login"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-neon-lime/10 hover:border-neon-lime/30 transition-all duration-300 group"
                    >
                      {session?.user ? (
                        <User className="w-4 h-4 text-white/60 group-hover:text-neon-lime transition-colors" />
                      ) : (
                        <Lock className="w-4 h-4 text-white/60 group-hover:text-neon-lime transition-colors" />
                      )}
                      <span className="text-xs font-medium text-white/80 group-hover:text-white uppercase tracking-wider">
                        {session?.user ? 'Admin' : 'Login'}
                      </span>
                    </Link>
                  )}

                  {/* Theme & Language */}
                  <div className="flex items-center gap-3">
                    <ThemeSwitcher className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-lime/30 transition-all" />
                    <LanguageToggle />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
