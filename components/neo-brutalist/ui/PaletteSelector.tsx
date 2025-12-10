"use client";

import { useState, useEffect, useRef } from "react";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PaletteOption {
  id: string;
  name: string;
  color: string;
  category: "neon" | "sober";
}

const palettes: PaletteOption[] = [
  // Neons vifs
  { id: "orange", name: "Orange", color: "#FF3300", category: "neon" },
  { id: "cyan", name: "Cyan", color: "#00F0FF", category: "neon" },
  { id: "magenta", name: "Magenta", color: "#FF006E", category: "neon" },
  { id: "lime", name: "Lime", color: "#D5FF0A", category: "neon" },
  { id: "purple", name: "Purple", color: "#8B5CF6", category: "neon" },
  { id: "pink", name: "Pink", color: "#FF69B4", category: "neon" },
  // Tons sobres
  { id: "slate", name: "Slate", color: "#64748B", category: "sober" },
  { id: "stone", name: "Stone", color: "#78716C", category: "sober" },
  { id: "indigo", name: "Indigo", color: "#4F46E5", category: "sober" },
  { id: "teal", name: "Teal", color: "#14B8A6", category: "sober" },
  { id: "ocean", name: "Ocean", color: "#0EA5E9", category: "sober" },
  { id: "charcoal", name: "Charcoal", color: "#374151", category: "sober" },
];

interface PaletteSelectorProps {
  className?: string;
}

export const PaletteSelector = ({ className }: PaletteSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPalette, setCurrentPalette] = useState("orange");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("neo-palette") || "orange";
    setCurrentPalette(saved);
    document.documentElement.setAttribute("data-palette", saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (paletteId: string) => {
    setCurrentPalette(paletteId);
    localStorage.setItem("neo-palette", paletteId);
    document.documentElement.setAttribute("data-palette", paletteId);
  };

  const handleThemeToggle = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <button
        className={cn("p-2 border-2 border-neo-border bg-neo-surface", className)}
        aria-label="Choisir une palette de couleurs"
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const current = palettes.find((p) => p.id === currentPalette);
  const isDark = theme === "dark";

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-9 h-9 flex items-center justify-center border-2 border-neo-border",
          "transition-colors duration-150",
          isOpen
            ? "bg-neo-accent"
            : "bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse",
          className
        )}
        aria-label="Choisir une palette de couleurs"
      >
        <Palette className="w-4 h-4" style={{ color: isOpen ? "white" : current?.color }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay with centered modal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              {/* Modal centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="bg-neo-surface border-4 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)] md:shadow-[8px_8px_0px_0px_var(--neo-shadow)] p-4 w-full max-w-xs md:max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mode d'affichage */}
                <div className="font-mono text-xs font-bold uppercase mb-3 text-neo-text/60">
                  Mode d'affichage
                </div>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleThemeToggle("light")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 transition-all duration-150",
                      !isDark
                        ? "border-neo-text bg-neo-accent text-neo-text-inverse shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                        : "border-neo-border bg-neo-bg hover:bg-neo-surface"
                    )}
                    aria-label="Mode clair"
                  >
                    <Sun className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold uppercase">Light</span>
                  </button>
                  <button
                    onClick={() => handleThemeToggle("dark")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 transition-all duration-150",
                      isDark
                        ? "border-neo-text bg-neo-accent text-neo-text-inverse shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                        : "border-neo-border bg-neo-bg hover:bg-neo-surface"
                    )}
                    aria-label="Mode sombre"
                  >
                    <Moon className="w-4 h-4" />
                    <span className="font-mono text-xs font-bold uppercase">Dark</span>
                  </button>
                </div>

                {/* Séparateur */}
                <div className="border-t border-neo-border mb-4" />

                {/* Neons Vifs */}
                <div className="font-mono text-xs font-bold uppercase mb-3 text-neo-text/60">
                  Neons Vifs
                </div>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {palettes
                    .filter((p) => p.category === "neon")
                    .map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => handleSelect(palette.id)}
                        className={cn(
                          "w-8 h-8 border-2 transition-all duration-150 hover:scale-110",
                          currentPalette === palette.id
                            ? "border-neo-text scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                            : "border-transparent hover:border-neo-border"
                        )}
                        style={{ backgroundColor: palette.color }}
                        title={palette.name}
                        aria-label={`Palette ${palette.name}`}
                      />
                    ))}
                </div>

                {/* Tons Sobres */}
                <div className="font-mono text-xs font-bold uppercase mb-3 text-neo-text/60">
                  Tons Sobres
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {palettes
                    .filter((p) => p.category === "sober")
                    .map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() => handleSelect(palette.id)}
                        className={cn(
                          "w-8 h-8 border-2 transition-all duration-150 hover:scale-110",
                          currentPalette === palette.id
                            ? "border-neo-text scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                            : "border-transparent hover:border-neo-border"
                        )}
                        style={{ backgroundColor: palette.color }}
                        title={palette.name}
                        aria-label={`Palette ${palette.name}`}
                      />
                    ))}
                </div>

                {/* Résumé actif */}
                <div className="mt-4 pt-3 border-t border-neo-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border border-neo-border"
                        style={{ backgroundColor: current?.color }}
                      />
                      <span className="font-mono text-xs font-bold uppercase text-neo-text">
                        {current?.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-neo-text/50 uppercase">
                      {isDark ? "Dark" : "Light"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaletteSelector;
