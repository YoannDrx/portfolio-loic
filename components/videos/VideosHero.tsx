"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Film, Tv, Award, Clapperboard, ArrowRight, Mail } from "lucide-react";
import MagneticButton from "@/components/immersive/MagneticButton";
import { cn } from "@/lib/utils";

/* ============================================
   TYPES
   ============================================ */

interface VideosHeroProps {
  videosCount: number;
  categoriesCount: number;
  syncCount: number;
  locale: string;
}

/* ============================================
   STAT BADGE COMPONENT
   ============================================ */

interface StatBadgeProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
}

function StatBadge({ value, label, icon, delay = 0 }: StatBadgeProps) {
  return (
    <motion.div
      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[var(--glass-subtle)] backdrop-blur-sm border border-[var(--glass-border)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="text-neon-cyan">{icon}</span>
      <div className="flex flex-col">
        <span className="text-foreground font-bold text-base sm:text-lg leading-none">{value}</span>
        <span className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">{label}</span>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function VideosHero({
  videosCount,
  categoriesCount,
  syncCount,
  locale,
}: VideosHeroProps) {
  const t = useTranslations("videos");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-6 sm:min-h-[85vh] sm:flex sm:items-center sm:py-16 lg:py-24">
      <div className="container-custom">
        <div className="max-w-3xl">
          {/* Glass Card Container for mobile */}
          <motion.div
            className="relative rounded-2xl sm:rounded-none overflow-hidden bg-obsidian-900/60 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none border border-neon-cyan/20 sm:border-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5 pointer-events-none sm:hidden" />

            <div className="relative p-5 sm:p-0">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-3 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Film className="w-3 h-3 sm:w-4 sm:h-4 text-neon-cyan" />
                <span className="text-neon-cyan text-xs sm:text-sm font-medium uppercase tracking-wider">
                  {t("hero.badge")}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className={cn(
                  "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 sm:mb-6",
                  "bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent"
                )}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {t("hero.title")}
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-sm sm:text-lg text-white/80 sm:text-foreground/85 mb-4 sm:mb-8 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t("hero.description")}
              </motion.p>

              {/* Inline Stats */}
              <motion.div
                className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <StatBadge
                  value={videosCount}
                  label={t("stats.total")}
                  icon={<Film className="w-4 h-4 sm:w-5 sm:h-5" />}
                  delay={0.5}
                />
                <StatBadge
                  value={categoriesCount}
                  label={t("stats.categories")}
                  icon={<Clapperboard className="w-4 h-4 sm:w-5 sm:h-5" />}
                  delay={0.6}
                />
                <StatBadge
                  value={syncCount}
                  label={t("stats.syncPlacements")}
                  icon={<Tv className="w-4 h-4 sm:w-5 sm:h-5" />}
                  delay={0.7}
                />
                <StatBadge
                  value="50+"
                  label={t("stats.brands")}
                  icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                  delay={0.8}
                />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-2 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <MagneticButton
                  href="#videos-grid"
                  color="cyan"
                  variant="solid"
                  size="md"
                  glow
                  rightIcon={ArrowRight}
                >
                  {t("hero.cta")}
                </MagneticButton>

                <MagneticButton
                  href={`/${locale}/contact`}
                  color="purple"
                  variant="outline"
                  size="md"
                  rightIcon={Mail}
                >
                  {t("hero.ctaSecondary")}
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-muted-foreground"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
