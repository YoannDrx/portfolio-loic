'use client';

import { usePathname } from 'next/navigation';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Toutes les pages publiques utilisent le design Neo-Brutalist
  // qui gère sa propre navbar et footer dans chaque composant de page
  // Seules les routes admin nécessitent potentiellement un layout différent
  const isAdminRoute = pathname?.includes('/admin');

  if (isAdminRoute) {
    // L'admin gère son propre layout
    return <main className="min-h-screen">{children}</main>;
  }

  // Pages Neo-Brutalist - elles incluent leur propre NeoNavbar et NeoFooter
  return <main className="min-h-screen">{children}</main>;
}
