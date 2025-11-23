'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ThemeSwitcher } from '@/components/theme-switcher';

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
            ? 'bg-white/90 dark:bg-obsidian/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-lg dark:shadow-neon-cyan/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta p-[2px] group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-white dark:bg-obsidian rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-xl font-black text-gradient-neon">LG</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-black text-gray-900 dark:text-white group-hover:text-gradient-neon transition-all duration-300">
                  Loïc Ghanem
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Music Composer</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    isActive(link.href)
                      ? 'text-neon-cyan dark:text-neon-cyan'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {t(link.key)}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}

              {/* Admin Login Button */}
              <Link
                href="/login"
                className="ml-2 w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 hover:border-neon-cyan/50 transition-all duration-300 group"
                title="Admin Login"
              >
                <Lock className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-neon-cyan transition-colors duration-300" />
              </Link>

              {/* Theme Switcher */}
              <div className="ml-2">
                <ThemeSwitcher className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10" />
              </div>

              {/* Language Toggle */}
              <div className="ml-2">
                <LanguageToggle />
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-300"
            >
              {t('contact')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900 dark:text-white transition-colors duration-300" />
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
              className="fixed inset-0 bg-gray-900/50 dark:bg-obsidian/90 backdrop-blur-sm z-40 md:hidden transition-colors duration-300"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-20 right-0 bottom-0 w-[280px] bg-white/95 dark:bg-obsidian-50/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 z-40 md:hidden overflow-y-auto transition-colors duration-300"
            >
              <div className="p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 text-neon-cyan border border-neon-cyan/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {t(link.key)}
                    </Link>
                  </motion.div>
                ))}

                {/* Admin Login - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="pt-2"
                >
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-neon-cyan transition-all duration-300"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                </motion.div>

                {/* Theme Switcher - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 1) * 0.1 }}
                  className="pt-2 flex justify-center"
                >
                  <ThemeSwitcher className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10" />
                </motion.div>

                {/* Language Toggle - Mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 2) * 0.1 }}
                  className="pt-2 flex justify-center"
                >
                  <LanguageToggle />
                </motion.div>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (navLinks.length + 2) * 0.1 }}
                  className="pt-4"
                >
                  <Link
                    href="/contact"
                    className="block text-center px-6 py-3 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] transition-all duration-300"
                  >
                    {t('contact')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
