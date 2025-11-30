'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/* ============================================
   TYPES
   ============================================ */

interface ShortcutAction {
  key: string;
  meta?: boolean;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  enabled?: boolean;
}

interface UseAdminShortcutsOptions {
  locale: string;
  onOpenCommandPalette?: () => void;
  onSave?: () => void;
  onTogglePublish?: () => void;
  onDelete?: () => void;
  onNew?: () => void;
  enabled?: boolean;
}

/* ============================================
   HOOK
   ============================================ */

export function useAdminShortcuts({
  locale,
  onOpenCommandPalette,
  onSave,
  onTogglePublish,
  onDelete,
  onNew,
  enabled = true,
}: UseAdminShortcutsOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const savedCallbacksRef = useRef({
    onOpenCommandPalette,
    onSave,
    onTogglePublish,
    onDelete,
    onNew,
  });

  // Update ref when callbacks change
  useEffect(() => {
    savedCallbacksRef.current = {
      onOpenCommandPalette,
      onSave,
      onTogglePublish,
      onDelete,
      onNew,
    };
  }, [onOpenCommandPalette, onSave, onTogglePublish, onDelete, onNew]);

  // Get current section from pathname
  const getCurrentSection = useCallback(() => {
    if (pathname.includes('/albums')) return 'albums';
    if (pathname.includes('/videos')) return 'videos';
    if (pathname.includes('/services')) return 'services';
    if (pathname.includes('/settings')) return 'settings';
    if (pathname.includes('/cv')) return 'cv';
    return 'dashboard';
  }, [pathname]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow command palette shortcut even in inputs
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        savedCallbacksRef.current.onOpenCommandPalette?.();
        return;
      }

      // Don't process other shortcuts if in input
      if (isInput) return;

      const section = getCurrentSection();

      // Global shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          // Save (Cmd+S)
          case 's':
            e.preventDefault();
            savedCallbacksRef.current.onSave?.();
            break;

          // Toggle Publish (Cmd+Shift+P)
          case 'p':
            if (e.shiftKey) {
              e.preventDefault();
              savedCallbacksRef.current.onTogglePublish?.();
            }
            break;

          // New content (Cmd+N)
          case 'n':
            e.preventDefault();
            if (savedCallbacksRef.current.onNew) {
              savedCallbacksRef.current.onNew();
            } else {
              // Default: navigate to new page based on section
              if (['albums', 'videos', 'services'].includes(section)) {
                router.push(`/${locale}/admin/${section}/new`);
              }
            }
            break;

          // Delete (Cmd+Backspace)
          case 'Backspace':
            e.preventDefault();
            savedCallbacksRef.current.onDelete?.();
            break;

          // New Album (Cmd+Shift+A)
          case 'a':
            if (e.shiftKey) {
              e.preventDefault();
              router.push(`/${locale}/admin/albums/new`);
            }
            break;

          // New Video (Cmd+Shift+V)
          case 'v':
            if (e.shiftKey) {
              e.preventDefault();
              router.push(`/${locale}/admin/videos/new`);
            }
            break;

          // New Service (Cmd+Shift+E)
          case 'e':
            if (e.shiftKey) {
              e.preventDefault();
              router.push(`/${locale}/admin/services/new`);
            }
            break;
        }
      }

      // Navigation shortcuts (without modifier keys)
      switch (e.key) {
        // Escape to close modals/go back
        case 'Escape':
          // This is typically handled by individual components
          break;

        // J/K for list navigation (can be implemented per component)
        case 'j':
        case 'k':
          // Dispatch custom event for list components to handle
          window.dispatchEvent(
            new CustomEvent('admin:list-navigate', {
              detail: { direction: e.key === 'j' ? 'down' : 'up' },
            })
          );
          break;

        // Go to sections with G + letter
        case 'g':
          // Wait for next key
          const handleSecondKey = (e2: KeyboardEvent) => {
            switch (e2.key) {
              case 'd':
                router.push(`/${locale}/admin`);
                break;
              case 'a':
                router.push(`/${locale}/admin/albums`);
                break;
              case 'v':
                router.push(`/${locale}/admin/videos`);
                break;
              case 's':
                router.push(`/${locale}/admin/services`);
                break;
              case 'c':
                router.push(`/${locale}/admin/cv`);
                break;
              case 't':
                router.push(`/${locale}/admin/settings`);
                break;
              case 'h':
                router.push(`/${locale}`);
                break;
            }
            window.removeEventListener('keydown', handleSecondKey);
          };
          window.addEventListener('keydown', handleSecondKey, { once: true });
          // Remove listener after timeout
          setTimeout(() => {
            window.removeEventListener('keydown', handleSecondKey);
          }, 1000);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, getCurrentSection, router, locale]);

  return {
    getCurrentSection,
  };
}

/* ============================================
   LIST NAVIGATION HOOK
   ============================================ */

interface UseListNavigationOptions {
  itemCount: number;
  onSelect?: (index: number) => void;
  enabled?: boolean;
}

export function useListNavigation({
  itemCount,
  onSelect,
  enabled = true,
}: UseListNavigationOptions) {
  const selectedIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    const handleNavigate = (e: CustomEvent<{ direction: 'up' | 'down' }>) => {
      const { direction } = e.detail;
      if (direction === 'down') {
        selectedIndexRef.current = Math.min(
          selectedIndexRef.current + 1,
          itemCount - 1
        );
      } else {
        selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
      }
      onSelect?.(selectedIndexRef.current);
    };

    window.addEventListener(
      'admin:list-navigate',
      handleNavigate as EventListener
    );
    return () => {
      window.removeEventListener(
        'admin:list-navigate',
        handleNavigate as EventListener
      );
    };
  }, [enabled, itemCount, onSelect]);

  return {
    selectedIndex: selectedIndexRef.current,
    setSelectedIndex: (index: number) => {
      selectedIndexRef.current = index;
    },
  };
}

/* ============================================
   SHORTCUT HINT DISPLAY
   ============================================ */

export const shortcutHints = {
  save: { keys: ['⌘', 'S'], description: 'Sauvegarder' },
  togglePublish: { keys: ['⌘', '⇧', 'P'], description: 'Publier/Dépublier' },
  newContent: { keys: ['⌘', 'N'], description: 'Nouveau contenu' },
  delete: { keys: ['⌘', '⌫'], description: 'Supprimer' },
  commandPalette: { keys: ['⌘', 'K'], description: 'Recherche rapide' },
  newAlbum: { keys: ['⌘', '⇧', 'A'], description: 'Nouvel album' },
  newVideo: { keys: ['⌘', '⇧', 'V'], description: 'Nouvelle vidéo' },
  newService: { keys: ['⌘', '⇧', 'E'], description: 'Nouveau service' },
  goToDashboard: { keys: ['G', 'D'], description: 'Aller au dashboard' },
  goToAlbums: { keys: ['G', 'A'], description: 'Aller aux albums' },
  goToVideos: { keys: ['G', 'V'], description: 'Aller aux vidéos' },
  goToServices: { keys: ['G', 'S'], description: 'Aller aux services' },
  goToSettings: { keys: ['G', 'T'], description: 'Aller aux paramètres' },
  goToSite: { keys: ['G', 'H'], description: 'Retour au site' },
  listUp: { keys: ['K'], description: 'Élément précédent' },
  listDown: { keys: ['J'], description: 'Élément suivant' },
  escape: { keys: ['Esc'], description: 'Fermer/Annuler' },
};

export type ShortcutKey = keyof typeof shortcutHints;

export default useAdminShortcuts;
