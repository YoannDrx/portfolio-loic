"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
      className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span className="text-neon-magenta">{icon}</span>
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg leading-none">{value}</span>
        <span className="text-gray-400 text-xs uppercase tracking-wider">{label}</span>
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

  return (
    <section ref={ref} className="relative min-h-[80vh] flex items-center py-16 lg:py-24">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-magenta/10 border border-neon-magenta/30 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Disc className="w-4 h-4 text-neon-magenta" />
              <span className="text-neon-magenta text-sm font-medium uppercase tracking-wider">
                {t("hero.badge")}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className={cn(
                "text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6",
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
              className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed"
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
                value={albumsCount}
                label={t("stats.total")}
                icon={<Disc className="w-5 h-5" />}
                delay={0.5}
              />
              <StatBadge
                value={genresCount}
                label={t("stats.genres")}
                icon={<Music className="w-5 h-5" />}
                delay={0.6}
              />
              <StatBadge
                value={collabCount}
                label={t("stats.collaborations")}
                icon={<Users className="w-5 h-5" />}
                delay={0.7}
              />
              <StatBadge
                value={period}
                label={t("stats.period")}
                icon={<Calendar className="w-5 h-5" />}
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
                href="#albums-grid"
                color="magenta"
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

          {/* Right Column - Vinyl Visual */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <VinylOrb />
          </motion.div>
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
          className="flex flex-col items-center gap-2 text-gray-500"
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
