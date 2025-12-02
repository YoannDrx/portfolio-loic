'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useSession } from '@/lib/auth-client';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/services', key: 'services' },
  { href: '/albums', key: 'albums' },
  { href: '/videos', key: 'videos' },
  { href: '/contact', key: 'contact' },
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
        animate={{ y: 0 }}
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
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-background rounded-lg flex items-center justify-center transition-colors duration-300">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-overlay-strong backdrop-blur-sm z-40 lg:hidden transition-colors duration-300"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-20 right-0 bottom-0 w-[280px] bg-glass-strong backdrop-blur-xl border-l border-[var(--glass-border)] z-40 lg:hidden overflow-y-auto transition-colors duration-300"
            >
              <div className="p-6 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block text-lg font-montserrat font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive(link.href)
                          ? 'text-primary dark:text-neon-lime pl-4 border-l-2 border-primary dark:border-neon-lime'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-[var(--glass-border)] my-6" />

                {/* Admin Section - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  {isPending ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium uppercase tracking-wider">Loading...</span>
                    </div>
                  ) : session?.user ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Panel Admin</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Admin Portal</span>
                    </Link>
                  )}
                </motion.div>

                {/* Theme Switcher - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  className="pt-4"
                >
                  <div className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Thème</div>
                  <ThemeSwitcher className="w-9 h-9 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] hover:bg-[var(--glass-active)]" />
                </motion.div>

                {/* Language Toggle - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 2) * 0.1 }}
                  className="pt-4"
                >
                  <div className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Language</div>
                  <LanguageToggle />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
