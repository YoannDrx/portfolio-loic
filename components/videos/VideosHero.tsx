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
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[var(--glass-subtle)] backdrop-blur-sm border border-[var(--glass-border)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="text-neon-cyan">{icon}</span>
      <div className="flex flex-col">
        <span className="text-foreground font-bold text-lg leading-none">{value}</span>
        <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
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
    <section ref={ref} className="relative min-h-[85vh] flex items-center py-16 lg:py-24">
      <div className="container-custom">
        <div className="max-w-3xl">
          {/* Text Content - Full focus on the dramatic light beam background */}
          <div>
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Film className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-wider">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6",
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
              className="text-lg text-foreground/85 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t("hero.description")}
            </motion.p>

            {/* Inline Stats */}
            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <StatBadge
                value={videosCount}
                label={t("stats.total")}
                icon={<Film className="w-5 h-5" />}
                delay={0.5}
              />
              <StatBadge
                value={categoriesCount}
                label={t("stats.categories")}
                icon={<Clapperboard className="w-5 h-5" />}
                delay={0.6}
              />
              <StatBadge
                value={syncCount}
                label={t("stats.syncPlacements")}
                icon={<Tv className="w-5 h-5" />}
                delay={0.7}
              />
              <StatBadge
                value="50+"
                label={t("stats.brands")}
                icon={<Award className="w-5 h-5" />}
                delay={0.8}
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <MagneticButton
                href="#videos-grid"
                color="cyan"
                variant="solid"
                size="lg"
                glow
                rightIcon={ArrowRight}
              >
                {t("hero.cta")}
              </MagneticButton>

              <MagneticButton
                href={`/${locale}/contact`}
                color="purple"
                variant="outline"
                size="lg"
                rightIcon={Mail}
              >
                {t("hero.ctaSecondary")}
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
