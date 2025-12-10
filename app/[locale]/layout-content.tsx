"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ConsentProvider } from "@/components/neo-brutalist/legal/ConsentProvider";
import { NeoCookieConsent } from "@/components/neo-brutalist/legal/NeoCookieConsent";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("home.splitHero");
  const [scrollIndicatorProgress, setScrollIndicatorProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 200, 1);
      setScrollIndicatorProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toutes les pages publiques utilisent le design Neo-Brutalist
  // qui gère sa propre navbar et footer dans chaque composant de page
  // Seules les routes admin nécessitent potentiellement un layout différent
  const isAdminRoute = pathname?.includes("/admin");

  if (isAdminRoute) {
    // L'admin gère son propre layout
    return (
      <ConsentProvider>
        <main className="min-h-screen">{children}</main>
      </ConsentProvider>
    );
  }

  // Pages Neo-Brutalist - elles incluent leur propre NeoNavbar et NeoFooter
  return (
    <ConsentProvider>
      <main className="min-h-screen">{children}</main>
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1 - scrollIndicatorProgress, y: scrollIndicatorProgress * 12 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-x-0 bottom-2 md:bottom-4 pb-[env(safe-area-inset-bottom)] flex justify-center pointer-events-none z-50"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-neo-text">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
            {t("scrollDown")}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]"
          >
            <ArrowDown size={30} />
          </motion.div>
        </div>
      </motion.div>
      <NeoCookieConsent />
    </ConsentProvider>
  );
}
