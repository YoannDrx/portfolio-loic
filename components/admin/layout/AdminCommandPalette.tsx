"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutDashboard,
  Image,
  Video,
  Briefcase,
  Settings,
  FileText,
  Plus,
  Home,
  Command,
  ArrowRight,
  Clock,
} from "lucide-react";
import { adminCommandBackdrop, adminCommandContent, adminCommandItem } from "@/lib/animations";

/* ============================================
   TYPES
   ============================================ */

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category: "navigation" | "action" | "recent";
  icon: typeof LayoutDashboard;
  shortcut?: string;
  href?: string;
  action?: () => void;
  color?: string;
}

interface AdminCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

/* ============================================
   COMMAND ITEMS
   ============================================ */

const getCommandItems = (locale: string, _router: ReturnType<typeof useRouter>): CommandItem[] => [
  // Navigation
  {
    id: "nav-dashboard",
    label: "Dashboard",
    description: "Vue d'ensemble",
    category: "navigation",
    icon: LayoutDashboard,
    href: `/${locale}/admin`,
    color: "text-[var(--admin-neon-cyan)]",
  },
  {
    id: "nav-albums",
    label: "Albums",
    description: "Gérer les albums photos",
    category: "navigation",
    icon: Image,
    href: `/${locale}/admin/albums`,
    color: "text-[var(--admin-neon-lime)]",
  },
  {
    id: "nav-videos",
    label: "Vidéos",
    description: "Gérer les vidéos",
    category: "navigation",
    icon: Video,
    href: `/${locale}/admin/videos`,
    color: "text-[var(--admin-neon-magenta)]",
  },
  {
    id: "nav-services",
    label: "Services",
    description: "Gérer les services",
    category: "navigation",
    icon: Briefcase,
    href: `/${locale}/admin/services`,
    color: "text-[var(--admin-neon-purple)]",
  },
  {
    id: "nav-cv",
    label: "CV / Resume",
    description: "Éditer le CV",
    category: "navigation",
    icon: FileText,
    href: `/${locale}/admin/cv`,
    color: "text-[var(--admin-neon-orange)]",
  },
  {
    id: "nav-settings",
    label: "Paramètres",
    description: "Configuration du système",
    category: "navigation",
    icon: Settings,
    href: `/${locale}/admin/settings`,
    color: "text-muted-foreground",
  },

  // Actions
  {
    id: "action-new-album",
    label: "Nouvel album",
    description: "Créer un nouvel album",
    category: "action",
    icon: Plus,
    href: `/${locale}/admin/albums/new`,
    shortcut: "⌘+Shift+A",
    color: "text-[var(--admin-neon-lime)]",
  },
  {
    id: "action-new-video",
    label: "Nouvelle vidéo",
    description: "Ajouter une vidéo",
    category: "action",
    icon: Plus,
    href: `/${locale}/admin/videos/new`,
    shortcut: "⌘+Shift+V",
    color: "text-[var(--admin-neon-magenta)]",
  },
  {
    id: "action-new-service",
    label: "Nouveau service",
    description: "Créer un service",
    category: "action",
    icon: Plus,
    href: `/${locale}/admin/services/new`,
    shortcut: "⌘+Shift+S",
    color: "text-[var(--admin-neon-purple)]",
  },
  {
    id: "action-site",
    label: "Voir le site",
    description: "Ouvrir le site public",
    category: "action",
    icon: Home,
    href: `/${locale}`,
    color: "text-muted-foreground",
  },
];

/* ============================================
   CATEGORY HEADERS
   ============================================ */

const categoryLabels: Record<string, { label: string; icon: typeof Hash }> = {
  navigation: { label: "Navigation", icon: ArrowRight },
  action: { label: "Actions rapides", icon: Plus },
  recent: { label: "Récemment visités", icon: Clock },
};

/* ============================================
   COMMAND ITEM COMPONENT
   ============================================ */

interface CommandItemProps {
  item: CommandItem;
  isSelected: boolean;
  onSelect: () => void;
}

function CommandItemRow({ item, isSelected, onSelect }: CommandItemProps) {
  const Icon = item.icon;

  return (
    <motion.button
      variants={adminCommandItem}
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
        isSelected
          ? "bg-[var(--glass-active)] text-white"
          : "text-muted-foreground hover:bg-[var(--glass-subtle)] hover:text-foreground"
      )}
      style={{
        boxShadow: isSelected ? "var(--admin-glow-cyan-sm)" : "none",
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
          isSelected ? "bg-[var(--glass-active)]" : "bg-[var(--glass-subtle)]"
        )}
      >
        <Icon className={cn("h-5 w-5", item.color || "text-white")} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{item.label}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground truncate">{item.description}</div>
        )}
      </div>
      {item.shortcut && (
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--glass-subtle)] text-xs font-mono text-muted-foreground">
          {item.shortcut}
        </div>
      )}
      {isSelected && <ArrowRight className="h-4 w-4 text-[var(--admin-neon-cyan)]" />}
    </motion.button>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export function AdminCommandPalette({ isOpen, onClose, locale }: AdminCommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandItems = useMemo(() => getCommandItems(locale, router), [locale, router]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query) return commandItems;
    const lowerQuery = query.toLowerCase();
    return commandItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [query, commandItems]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Flatten for keyboard navigation
  const flatItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  // Handle item selection
  const handleSelect = useCallback(
    (item: CommandItem) => {
      if (item.href) {
        router.push(item.href);
      } else if (item.action) {
        item.action();
      }
      onClose();
      setQuery("");
      setSelectedIndex(0);
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % flatItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
          break;
        case "Enter":
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, handleSelect, onClose]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[var(--admin-z-command-palette)]"
            variants={adminCommandBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{ backdropFilter: "blur(8px)" }}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[var(--admin-z-command-palette)]"
            variants={adminCommandContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="overflow-hidden rounded-2xl border border-[var(--glass-border)]"
              style={{
                background: "var(--admin-surface-elevated-solid)",
                boxShadow: "var(--admin-shadow-modal), var(--admin-glow-cyan-sm)",
              }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--glass-border)]">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Rechercher une page ou une action..."
                  className="flex-1 bg-transparent text-white placeholder-neutral-500 outline-none text-base"
                />
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--glass-active)] text-xs font-mono text-muted-foreground">
                  <span>esc</span>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {flatItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="h-8 w-8 mb-3 opacity-50" />
                    <p className="text-sm">Aucun résultat trouvé</p>
                  </div>
                ) : (
                  Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      {/* Category header */}
                      <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        {categoryLabels[category]?.label || category}
                      </div>

                      {/* Items */}
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: { staggerChildren: 0.03 },
                          },
                        }}
                      >
                        {items.map((item) => {
                          const itemIndex = flatItems.indexOf(item);
                          return (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              isSelected={selectedIndex === itemIndex}
                              onSelect={() => handleSelect(item)}
                            />
                          );
                        })}
                      </motion.div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--glass-border)] text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--glass-active)] font-mono">
                      ↑
                    </kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--glass-active)] font-mono">
                      ↓
                    </kbd>
                    <span className="ml-1">pour naviguer</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--glass-active)] font-mono">
                      ↵
                    </kbd>
                    <span className="ml-1">pour sélectionner</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Command className="h-3 w-3" />
                  <span>K pour ouvrir</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   HOOK FOR COMMAND PALETTE
   ============================================ */

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

export default AdminCommandPalette;
