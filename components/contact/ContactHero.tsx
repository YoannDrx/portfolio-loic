"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageSquare, Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import MagneticButton from "@/components/immersive/MagneticButton";
import { cn } from "@/lib/utils";

/* ============================================
   TYPES
   ============================================ */

interface ContactHeroProps {
  locale: string;
}

/* ============================================
   VISUAL ORB COMPONENT - Communication Atom
   ============================================ */

function CommunicationOrb() {
  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(213, 255, 10, 0.2), rgba(0, 240, 255, 0.1), transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner core */}
      <motion.div
        className="absolute inset-[15%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(213, 255, 10, 0.3), rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.1))",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.05, 0.95, 1],
          rotate: [0, 360],
        }}
        transition={{
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* Center bright core */}
      <motion.div
        className="absolute inset-[35%] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(213, 255, 10, 0.6), transparent 70%)",
          boxShadow: "0 0 60px rgba(213, 255, 10, 0.4)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Central icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-20 h-20 rounded-full bg-glass-subtle backdrop-blur-sm border border-neon-lime/30 flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-neon-lime" />
        </div>
      </motion.div>

      {/* Floating particles around orb */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-neon-lime/60"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 6) * 120, 0],
            y: [0, Math.sin((i * Math.PI * 2) / 6) * 120, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Orbiting icons */}
      {[
        { Icon: Mail, delay: 0 },
        { Icon: Phone, delay: 1.5 },
        { Icon: MapPin, delay: 3 },
      ].map(({ Icon, delay }, i) => (
        <motion.div
          key={i}
          className="absolute w-10 h-10 rounded-full bg-glass-subtle backdrop-blur-sm border border-neon-cyan/30 flex items-center justify-center"
          style={{
            left: "50%",
            top: "50%",
          }}
          animate={{
            x: [
              Math.cos(((i * Math.PI * 2) / 3)) * 100,
              Math.cos(((i * Math.PI * 2) / 3) + Math.PI * 2) * 100,
            ],
            y: [
              Math.sin(((i * Math.PI * 2) / 3)) * 100,
              Math.sin(((i * Math.PI * 2) / 3) + Math.PI * 2) * 100,
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay,
          }}
        >
          <Icon className="w-5 h-5 text-neon-cyan" />
        </motion.div>
      ))}
    </div>
  );
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
      <span className="text-neon-lime">{icon}</span>
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

export default function ContactHero({ locale }: ContactHeroProps) {
  const t = useTranslations("contact");
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
            <div className="relative rounded-2xl lg:rounded-none overflow-hidden bg-obsidian-900/60 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border border-neon-lime/20 lg:border-transparent">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-lime/5 via-transparent to-neon-cyan/5 pointer-events-none lg:hidden" />

              <div className="relative p-5 lg:p-0">
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neon-lime/10 border border-neon-lime/30 mb-3 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-neon-lime" />
                  <span className="text-neon-lime text-xs sm:text-sm font-medium uppercase tracking-wider">{t("hero.badge")}</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className={cn(
                    "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-3 sm:mb-6",
                    "bg-gradient-to-r from-white via-neon-lime to-neon-cyan bg-clip-text text-transparent"
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
                  <StatBadge value="24h" label={t("hero.stats.response")} icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />} delay={0.5} />
                  <StatBadge value="100%" label={t("hero.stats.satisfaction")} icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />} delay={0.6} />
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MagneticButton href="#contact-form" color="lime" variant="solid" size="md" glow rightIcon={ArrowRight}>
                    {t("hero.cta")}
                  </MagneticButton>

                  <MagneticButton href={`/${locale}/services`} color="cyan" variant="outline" size="md" rightIcon={ArrowRight}>
                    {t("hero.ctaSecondary")}
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Visual (hidden on mobile) */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CommunicationOrb />
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
