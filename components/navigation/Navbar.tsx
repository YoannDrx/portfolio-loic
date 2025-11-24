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
    if (href === '/') return pathname === '/' || pathname === '/fr' || pathname === '/en';
    return pathname.includes(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-obsidian/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-neon-cyan/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-obsidian rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">LG</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-black text-white transition-all duration-300 font-montserrat tracking-tight">
                  LOÏC<span className="text-neon-lime">.GHANEM</span>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">Music Composer</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-medium text-sm uppercase tracking-widest transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-neon-lime'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t(link.key)}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-lime shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}

              {/* Admin Section - Affichage conditionnel */}
              <div className="ml-2">
                {isPending ? (
                  // État de chargement
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : session?.user ? (
                  // Utilisateur connecté
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 hover:border-neon-cyan/50 transition-all duration-300 group"
                    title="Panel Admin"
                  >
                    <User className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors duration-300" />
                    <span className="text-xs font-medium text-gray-400 group-hover:text-white uppercase tracking-wider">
                      Admin
                    </span>
                  </Link>
                ) : (
                  // Utilisateur non connecté
                  <Link
                    href="/login"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-neon-cyan/50 transition-all duration-300 group"
                    title="Admin Login"
                  >
                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors duration-300" />
                  </Link>
                )}
              </div>

              {/* Theme Switcher (Hidden/Modified for dark mode only preference but kept for admin compatibility if needed) */}
              {/* <div className="ml-2">
                <ThemeSwitcher className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10" />
              </div> */}

              {/* Language Toggle */}
              <div className="ml-2">
                <LanguageToggle />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white transition-colors duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-white transition-colors duration-300" />
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
              className="fixed inset-0 bg-obsidian/90 backdrop-blur-sm z-40 md:hidden transition-colors duration-300"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-20 right-0 bottom-0 w-[280px] bg-obsidian-50/95 backdrop-blur-xl border-l border-white/10 z-40 md:hidden overflow-y-auto transition-colors duration-300"
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
                          ? 'text-neon-lime pl-4 border-l-2 border-neon-lime'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-white/10 my-6" />

                {/* Admin Section - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                >
                  {isPending ? (
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium uppercase tracking-wider">Loading...</span>
                    </div>
                  ) : session?.user ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 text-gray-400 hover:text-neon-cyan transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Panel Admin</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-3 text-gray-400 hover:text-neon-cyan transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Admin Portal</span>
                    </Link>
                  )}
                </motion.div>

                {/* Language Toggle - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 2) * 0.1 }}
                  className="pt-4"
                >
                  <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Language</div>
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