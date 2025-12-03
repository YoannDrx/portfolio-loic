"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Disc, Music, Users, Calendar, ArrowRight, Mail } from "lucide-react";
import MagneticButton from "@/components/immersive/MagneticButton";
import VinylOrb from "./VinylOrb";
import { cn } from "@/lib/utils";

/* ============================================
   TYPES
   ============================================ */

interface AlbumsHeroProps {
  albumsCount: number;
  genresCount: number;
  collabCount: number;
  period: string;
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
      <span className="text-neon-magenta">{icon}</span>
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

export default function AlbumsHero({
  albumsCount,
  genresCount,
  collabCount,
  period,
  locale,
}: AlbumsHeroProps) {
  const t = useTranslations("albums");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Scroll-based opacity for scroll indicator
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <section ref={ref} className="relative py-6 sm:min-h-[80vh] sm:flex sm:items-center sm:py-16 lg:py-24">
      <div className="container-custom">
        <div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Text Content in Glass Card on mobile */}
          <motion.div
            className=""
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Glass Card Container for mobile */}
            <div className="relative rounded-2xl lg:rounded-none overflow-hidden bg-obsidian-900/60 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border border-neon-magenta/20 lg:border-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/5 via-transparent to-neon-purple/5 pointer-events-none lg:hidden" />

              <div className="relative p-5 lg:p-0">
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 mb-3 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Disc className="w-3 h-3 sm:w-4 sm:h-4 text-neon-magenta" />
                  <span className="text-neon-magenta text-xs sm:text-sm font-medium uppercase tracking-wider">
                    {t("hero.badge")}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className={cn(
                    "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 sm:mb-6",
                    "bg-gradient-to-r from-white via-neon-magenta to-neon-purple bg-clip-text text-transparent"
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
                    value={albumsCount}
                    label={t("stats.total")}
                    icon={<Disc className="w-4 h-4 sm:w-5 sm:h-5" />}
                    delay={0.5}
                  />
                  <StatBadge
                    value={genresCount}
                    label={t("stats.genres")}
                    icon={<Music className="w-4 h-4 sm:w-5 sm:h-5" />}
                    delay={0.6}
                  />
                  <StatBadge
                    value={collabCount}
                    label={t("stats.collaborations")}
                    icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                    delay={0.7}
                  />
                  <StatBadge
                    value={period}
                    label={t("stats.period")}
                    icon={<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />}
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
                    href="#albums-grid"
                    color="magenta"
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
            </div>
          </motion.div>

          {/* Right Column - Vinyl Visual (hidden on mobile) */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <VinylOrb />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - visible on all screens, fades on scroll */}
      <motion.div
        className="fixed sm:absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity: scrollIndicatorOpacity }}
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
