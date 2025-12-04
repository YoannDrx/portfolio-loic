"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Initialiser la palette de couleurs depuis localStorage
  React.useEffect(() => {
    const savedPalette = localStorage.getItem('neo-palette') || 'orange';
    document.documentElement.setAttribute('data-palette', savedPalette);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
