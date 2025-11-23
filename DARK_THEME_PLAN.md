# 🌙 Plan d'implémentation du Theme Dark pour le Dashboard Admin

## Vue d'ensemble

Ajout d'un theme dark complet pour le dashboard admin avec:
- Toggle smooth entre light et dark
- Persistance du choix utilisateur
- Design cohérent et accessible
- Contraste optimal dans les deux modes

---

## Phase 1 : Setup & Configuration

### 1.1 Installation de next-themes
```bash
npm install next-themes
# ou
yarn add next-themes
```

### 1.2 Création du ThemeProvider
**Fichier**: `components/theme-provider.tsx`

```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 1.3 Intégration dans le layout admin
**Fichier**: `app/[locale]/admin/layout.tsx`

```tsx
import { ThemeProvider } from "@/components/theme-provider";

export default async function AdminLayout({ children, params }) {
  // ... auth logic

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="admin-theme"
    >
      <div className="min-h-screen bg-admin-bg-secondary dark:bg-gray-900">
        {/* ... rest */}
      </div>
    </ThemeProvider>
  );
}
```

---

## Phase 2 : Theme Switcher Component

### 2.1 Création du composant
**Fichier**: `components/admin/ThemeSwitcher.tsx`

```tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative h-10 w-10 rounded-lg"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### 2.2 Ajout dans le header
**Position**: Entre la search bar et le user menu
- Visible sur desktop et mobile
- Animation smooth de rotation Sun <-> Moon

---

## Phase 3 : Extension du Design System

### 3.1 Ajout des couleurs dark dans tailwind.config.ts

```typescript
theme: {
  extend: {
    colors: {
      // ... couleurs admin existantes

      // Dark mode colors
      'admin-dark': {
        // Backgrounds
        bg: {
          DEFAULT: '#0F1419',      // Fond principal dark
          secondary: '#1A1F2E',    // Fond secondaire (cards, sidebar)
          tertiary: '#252D3A',     // Fond tertiaire (hover states)
        },
        // Borders
        border: {
          DEFAULT: '#2D3748',      // Bordure normale
          light: '#374151',        // Bordure claire
          dark: '#1F2937',         // Bordure foncée
        },
        // Text
        text: {
          primary: '#F9FAFB',      // Texte principal (blanc cassé)
          secondary: '#D1D5DB',    // Texte secondaire (gris clair)
          tertiary: '#9CA3AF',     // Texte tertiaire (gris moyen)
        },
      },
    },
  },
}
```

### 3.2 Stratégie de naming
- Utiliser `dark:` prefix pour toutes les classes dark
- Exemples:
  - `bg-white dark:bg-admin-dark-bg`
  - `text-admin-text-primary dark:text-admin-dark-text-primary`
  - `border-admin-border dark:border-admin-dark-border`

---

## Phase 4 : Mise à jour des composants principaux

### 4.1 AdminLayout
**Changements**:
```tsx
<div className="min-h-screen bg-admin-bg-secondary dark:bg-admin-dark-bg">
  <div className="flex h-screen overflow-hidden">
    {/* ... */}
    <main className="flex-1 overflow-y-auto p-8 dark:bg-admin-dark-bg">
      {/* ... */}
    </main>
  </div>
</div>
```

### 4.2 AdminSidebar
**Changements clés**:
- Background: `bg-white dark:bg-admin-dark-bg-secondary`
- Borders: `border-admin-border dark:border-admin-dark-border`
- Logo: Garde le gradient (fonctionne sur les deux themes)
- Navigation items:
  - Active: `bg-gradient-to-r from-admin-primary-500 to-admin-accent-500` (identique)
  - Inactive: `text-admin-text-secondary dark:text-admin-dark-text-secondary`
  - Hover: `hover:bg-admin-bg-secondary dark:hover:bg-admin-dark-bg-tertiary`
- Quick Stats card: `bg-white dark:bg-admin-dark-bg-tertiary`

### 4.3 AdminHeader
**Changements clés**:
- Background: `bg-white dark:bg-admin-dark-bg-secondary`
- Border: `border-admin-border dark:border-admin-dark-border`
- Search bar:
  - Input: `bg-admin-bg-secondary dark:bg-admin-dark-bg-tertiary`
  - Text: `text-gray-900 dark:text-admin-dark-text-primary`
  - Placeholder: `placeholder:text-admin-text-tertiary dark:placeholder:text-admin-dark-text-tertiary`
- User menu:
  - Avatar: Garde le gradient
  - Dropdown: `bg-white dark:bg-admin-dark-bg-secondary`

---

## Phase 5 : Dashboard Components

### 5.1 DashboardKPICard
**Changements**:
```tsx
<Card className="border-admin-border dark:border-admin-dark-border bg-white dark:bg-admin-dark-bg-secondary">
  {/* Gradient background decoration - garder tel quel */}

  {/* Content */}
  <div className="text-admin-text-primary dark:text-admin-dark-text-primary">
    {/* ... */}
  </div>
</Card>
```

### 5.2 RecentActivity
- Card background: `bg-white dark:bg-admin-dark-bg-secondary`
- Item hover: `hover:bg-admin-bg-secondary dark:hover:bg-admin-dark-bg-tertiary`
- Text colors: Adapter tous les textes

### 5.3 QuickActions
- Grid items: `bg-admin-accent-50 dark:bg-admin-dark-bg-tertiary`
- Hover: Adapter les backgrounds colorés pour le dark

---

## Phase 6 : Tables (Albums, Videos, Services)

### 6.1 Container & Header
```tsx
<div className="rounded-lg border-admin-border dark:border-admin-dark-border bg-white dark:bg-admin-dark-bg-secondary">
  <Table>
    <TableHeader className="bg-admin-bg-secondary dark:bg-admin-dark-bg-tertiary">
      <TableRow>
        <TableHead className="text-admin-text-primary dark:text-admin-dark-text-primary">
          {/* ... */}
        </TableHead>
      </TableRow>
    </TableHeader>
  </Table>
</div>
```

### 6.2 Table Rows
- Hover: `hover:bg-admin-bg-secondary dark:hover:bg-admin-dark-bg-tertiary`
- Borders: `border-admin-border-light dark:border-admin-dark-border`
- Cell text: `text-admin-text-primary dark:text-admin-dark-text-primary`

### 6.3 Badges
**Statut Publié**:
```tsx
<Badge className="bg-admin-success-500 dark:bg-admin-success-600">
  Publié
</Badge>
```

**Statut Brouillon**:
```tsx
<Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
  Brouillon
</Badge>
```

**Type badges** (albums, videos, services):
- Garder les couleurs vives (cyan, magenta, violet)
- Ajuster juste le background: `bg-cyan-50 dark:bg-cyan-950/30`

### 6.4 Action Buttons
- Hover colors adaptés:
  - View: `hover:bg-admin-primary-50 dark:hover:bg-admin-primary-900/30`
  - Edit: `hover:bg-admin-accent-50 dark:hover:bg-admin-accent-900/30`
  - Delete: `hover:bg-admin-danger-50 dark:hover:bg-admin-danger-900/30`

---

## Phase 7 : Filtres & Pagination

### 7.1 SearchFilters
- Input: `bg-white dark:bg-admin-dark-bg-secondary`
- Advanced panel: `bg-white dark:bg-admin-dark-bg-secondary`
- Select dropdowns: Adapter les backgrounds
- Active filter button: `bg-admin-primary-50 dark:bg-admin-primary-900/30`
- Reset button: `hover:bg-admin-danger-50 dark:hover:bg-admin-danger-900/30`

### 7.2 Pagination
- Buttons: `bg-white dark:bg-admin-dark-bg-secondary`
- Active page: `bg-admin-primary-500` (identique)
- Disabled: `opacity-50 dark:opacity-40`

---

## Phase 8 : Composants UI de base

### 8.1 Input
**Fichier**: `components/ui/input.tsx`

```tsx
className={cn(
  "bg-transparent dark:bg-admin-dark-bg-tertiary",
  "border-input dark:border-admin-dark-border",
  "text-gray-900 dark:text-admin-dark-text-primary",
  "placeholder:text-muted-foreground dark:placeholder:text-admin-dark-text-tertiary",
  "focus:border-admin-primary-300 dark:focus:border-admin-primary-600",
  // ...
)}
```

### 8.2 Button
- Primary: Garder les gradients (fonctionnent sur les deux themes)
- Outline: `border-admin-border dark:border-admin-dark-border`
- Ghost: `hover:bg-admin-bg-secondary dark:hover:bg-admin-dark-bg-tertiary`

### 8.3 Card
```tsx
className={cn(
  "bg-white dark:bg-admin-dark-bg-secondary",
  "border-admin-border dark:border-admin-dark-border",
  "text-admin-text-primary dark:text-admin-dark-text-primary",
  // ...
)}
```

### 8.4 Badge
- Adapter chaque variant avec dark mode
- Success: `bg-admin-success-500 dark:bg-admin-success-600`
- Danger: `bg-admin-danger-500 dark:bg-admin-danger-600`
- Outline: `border-admin-border dark:border-admin-dark-border`

### 8.5 Select & Dropdown
- Menu background: `bg-white dark:bg-admin-dark-bg-secondary`
- Items hover: `hover:bg-admin-bg-secondary dark:hover:bg-admin-dark-bg-tertiary`

---

## Phase 9 : Settings Page

### 9.1 Tabs
- Active tab: `bg-white dark:bg-admin-dark-bg-secondary`
- Inactive tab: `text-admin-text-secondary dark:text-admin-dark-text-secondary`

### 9.2 Form Inputs
- Tous les inputs adaptés avec dark mode
- Labels: `text-admin-text-primary dark:text-admin-dark-text-primary`

### 9.3 Export Cards
- Card: `bg-white dark:bg-admin-dark-bg-secondary`
- Icons: Garder les couleurs vives

---

## Phase 10 : Tests & Optimisations

### 10.1 Checklist de tests
- [ ] Toggle smooth entre light et dark
- [ ] Pas de flash au chargement (SSR)
- [ ] Persistance du choix (localStorage)
- [ ] Tous les hover states fonctionnent
- [ ] Tous les focus states visibles
- [ ] Contraste suffisant (WCAG AA minimum)
- [ ] Images/logos visibles dans les deux modes
- [ ] Gradients et couleurs vives conservés
- [ ] Transitions fluides (200-300ms)

### 10.2 États à tester
**Sur chaque page** (Dashboard, Albums, Videos, Services, Settings):
- ✅ Hover sur les boutons
- ✅ Hover sur les table rows
- ✅ Focus sur les inputs
- ✅ Active state sur navigation
- ✅ Disabled state sur les boutons
- ✅ Empty states
- ✅ Loading states

### 10.3 Optimisations
- Éviter le flash avec `suppressHydrationWarning` sur `<html>`
- Utiliser `useEffect` avec `mounted` state dans ThemeSwitcher
- Précharger les couleurs dark en CSS variables
- Ajouter `transition-colors duration-200` sur tous les éléments qui changent

---

## Phase 11 : Documentation

### 11.1 Ajouter au README
```markdown
## Theme Dark

Le dashboard admin supporte un theme dark complet.

**Toggle**: Bouton Sun/Moon dans le header
**Persistance**: Le choix est sauvegardé dans localStorage
**Design**: Couleurs adaptées avec contraste optimal
```

### 11.2 Variables CSS (optionnel mais recommandé)
Créer `styles/admin-theme.css`:
```css
@layer base {
  :root {
    --admin-bg: 255 255 255;
    --admin-text: 17 24 39;
    /* ... */
  }

  .dark {
    --admin-bg: 15 20 25;
    --admin-text: 249 250 251;
    /* ... */
  }
}
```

---

## Résumé de l'effort

**Fichiers à créer**: 3
- `components/theme-provider.tsx`
- `components/admin/ThemeSwitcher.tsx`
- `DARK_THEME_PLAN.md` ✅

**Fichiers à modifier**: ~20
- Layout admin
- Sidebar, Header
- Dashboard components (3 files)
- Tables (3 files: AlbumsContent, videos-list, services-list)
- SearchFilters, Pagination
- Settings
- UI components (8 files: input, button, badge, card, select, etc.)

**Temps estimé**: 3-4 heures
- Phase 1-2 (Setup): 30min
- Phase 3 (Design system): 30min
- Phase 4-5 (Layout & Dashboard): 1h
- Phase 6-7 (Tables & Filters): 1h
- Phase 8-9 (UI & Settings): 1h
- Phase 10 (Tests): 30min

---

## Ordre d'implémentation recommandé

1. ✅ Setup next-themes + ThemeProvider
2. ✅ Créer ThemeSwitcher + l'ajouter au header
3. ✅ Étendre tailwind.config.ts avec couleurs dark
4. ✅ Mettre à jour Layout, Sidebar, Header
5. ✅ Tester le toggle et voir le résultat
6. ✅ Mettre à jour Dashboard
7. ✅ Mettre à jour Tables une par une
8. ✅ Mettre à jour UI components
9. ✅ Mettre à jour Settings
10. ✅ Tests complets
11. ✅ Tweaks et polish

**Philosophie**: Travailler par couches (layout → dashboard → tables → details) plutôt que page par page. Ça permet de voir rapidement le résultat global.

---

## Notes importantes

⚠️ **Gradients**: Les gradients (primary-accent) fonctionnent bien sur les deux themes → les garder tels quels

⚠️ **Couleurs vives**: Les couleurs néon (cyan, magenta, purple) doivent rester vives en dark mode → juste adapter le background

⚠️ **Contraste**: Viser WCAG AA minimum (ratio 4.5:1 pour le texte normal, 3:1 pour le texte large)

⚠️ **Images**: Si des images ont des backgrounds blancs, considérer ajouter un léger border en dark mode

⚠️ **Shadows**: Adapter les ombres: `shadow-sm dark:shadow-gray-900/20`
