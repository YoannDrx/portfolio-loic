'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoAdminSidebar, NeoAdminHeader } from '@/components/admin/neo';
import {
  AdminCommandPalette,
  useCommandPalette,
  ToastContainer,
  useToast,
  setGlobalToastHandler,
} from '@/components/admin/layout';
import { useAdminShortcuts } from '@/hooks/useAdminShortcuts';
import { cn } from '@/lib/utils';
import { X, Menu } from 'lucide-react';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  locale: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}

export default function AdminLayoutClient({
  children,
  locale,
  user,
}: AdminLayoutClientProps) {
  const commandPalette = useCommandPalette();
  const toastSystem = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize admin shortcuts
  useAdminShortcuts({
    locale,
    onOpenCommandPalette: commandPalette.open,
  });

  // Set global toast handler for use outside React components
  useEffect(() => {
    setGlobalToastHandler(toastSystem);
  }, [toastSystem]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-hidden">
      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden relative">
        {/* Desktop Sidebar */}
        <NeoAdminSidebar locale={locale} onOpenCommandPalette={commandPalette.open} />

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-neo-text/50 lg:hidden"
              />

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
              >
                <div className="h-full bg-neo-bg border-r-4 border-neo-border flex flex-col">
                  {/* Close button */}
                  <div className="flex justify-end p-4 border-b-4 border-neo-border">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center',
                        'border-2 border-neo-border bg-neo-surface',
                        'text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse',
                        'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
                        'transition-all duration-200'
                      )}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mobile Navigation (simplified) */}
                  <nav className="flex-1 p-4 space-y-2">
                    <MobileNavLink href={`/${locale}/admin`} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href={`/${locale}/admin/albums`} label="Albums" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href={`/${locale}/admin/videos`} label="Vidéos" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href={`/${locale}/admin/services`} label="Services" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href={`/${locale}/admin/cv`} label="CV / Resume" onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavLink href={`/${locale}/admin/settings`} label="Paramètres" onClick={() => setIsMobileMenuOpen(false)} />
                  </nav>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <NeoAdminHeader
            user={user}
            locale={locale}
            onMenuToggle={() => setIsMobileMenuOpen(true)}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-neo-bg-alt/30">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette */}
      <AdminCommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        locale={locale}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toastSystem.toasts}
        onDismiss={toastSystem.dismissToast}
        position="bottom-right"
      />
    </div>
  );
}

/* Mobile Nav Link Component */
function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'block px-4 py-3',
        'font-mono text-sm font-bold uppercase tracking-wide',
        'border-2 border-neo-border bg-neo-surface',
        'text-neo-text hover:bg-neo-accent hover:text-neo-text-inverse',
        'shadow-[2px_2px_0px_0px_var(--neo-shadow)]',
        'transition-all duration-200'
      )}
    >
      {label}
    </a>
  );
}
