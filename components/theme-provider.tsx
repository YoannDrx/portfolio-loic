"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Hook custom pour accéder au thème Neo-Brutalist (palette + mode)
export function useNeoTheme() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [palette, setPaletteState] = React.useState('orange');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const savedPalette = localStorage.getItem('neo-palette') || 'orange';
    setPaletteState(savedPalette);
  }, []);

  const setPalette = React.useCallback((newPalette: string) => {
    setPaletteState(newPalette);
    localStorage.setItem('neo-palette', newPalette);
    document.documentElement.setAttribute('data-palette', newPalette);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  return {
    // Theme mode
    theme,
    setTheme,
    resolvedTheme,
    isDark,
    isLight,
    // Palette
    palette,
    setPalette,
    // Status
    mounted,
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Initialiser la palette de couleurs depuis localStorage
  React.useEffect(() => {
    const savedPalette = localStorage.getItem('neo-palette') || 'orange';
    document.documentElement.setAttribute('data-palette', savedPalette);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
