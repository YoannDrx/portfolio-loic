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
  const isLegalPage = pathname?.includes("/privacy-policy") || pathname?.includes("/terms-of-use");

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
        animate={{ opacity: 1 - scrollIndicatorProgress }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex fixed right-1 md:right-4 top-1/2 -translate-y-1/2 pr-[env(safe-area-inset-right)] pointer-events-none z-50"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.25em] [writing-mode:vertical-rl] ${
              isLegalPage ? "text-white" : "text-neo-text/70"
            }`}
          >
            {t("scrollDown")}
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="drop-shadow-[0_4px_0_rgba(0,0,0,0.25)]"
          >
            <ArrowDown size={24} className={isLegalPage ? "text-white" : "text-neo-accent"} />
          </motion.div>
        </div>
      </motion.div>
      <NeoCookieConsent />
    </ConsentProvider>
  );
}
