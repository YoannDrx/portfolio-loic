'use client';

import { useState, useEffect } from 'react';
import {
  AdminBackgroundEffects,
  AdminSidebarImmersive,
  AdminHeaderImmersive,
  AdminCommandPalette,
  useCommandPalette,
  ToastContainer,
  useToast,
  setGlobalToastHandler,
  AnimatedPageWrapper,
} from '@/components/admin/layout';
import { useAdminShortcuts } from '@/hooks/useAdminShortcuts';

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

  // Initialize admin shortcuts
  useAdminShortcuts({
    locale,
    onOpenCommandPalette: commandPalette.open,
  });

  // Set global toast handler for use outside React components
  useEffect(() => {
    setGlobalToastHandler(toastSystem);
  }, [toastSystem]);

  return (
    <div className="min-h-screen text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Immersive Background */}
      <AdminBackgroundEffects
        showThreeJS={true}
        showOrbs={true}
        showGrid={true}
        showGradients={true}
      />

      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden relative z-10">
        {/* Sidebar */}
        <AdminSidebarImmersive locale={locale} onOpenCommandPalette={commandPalette.open} />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AdminHeaderImmersive
            user={user}
            locale={locale}
          />

          {/* Page content with animations */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 transition-colors duration-300">
            <div className="mx-auto max-w-7xl">
              <AnimatedPageWrapper>
                {children}
              </AnimatedPageWrapper>
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
