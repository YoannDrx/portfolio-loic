"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Clapperboard,
  Compass,
  Headphones,
  Mic2,
  SlidersHorizontal,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoContactInfo } from "./NeoContactInfo";
import { GeometricIllustration } from "./GeometricIllustration";
import { BrutalistButton } from "../ui/BrutalistButton";
import { NeoTag } from "../ui/NeoTag";
import { GridBackground } from "../ui/GridBackground";
import { ImmersivePageAtmosphere } from "../ui/ImmersivePageAtmosphere";
import { Link } from "@/i18n/routing";

export const NeoContact = () => {
  const t = useTranslations("contact");
  const reduceMotion = useReducedMotion();
  const tickerItems = [
    { label: t("directContact.specialties.composition"), icon: Sparkles },
    { label: t("directContact.specialties.artDirection"), icon: Compass },
    { label: t("directContact.specialties.coaching"), icon: Mic2 },
    { label: t("directContact.specialties.musicProduction"), icon: AudioLines },
    { label: t("directContact.specialties.projectScoping"), icon: Clapperboard },
    { label: t("directContact.specialties.mixing"), icon: SlidersHorizontal },
    { label: t("directContact.specialties.mastering"), icon: Headphones },
    { label: t("directContact.specialties.soundDesign"), icon: WandSparkles },
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text selection:bg-neo-text selection:text-neo-accent">
      <GridBackground withAccentGlow />
      <ImmersivePageAtmosphere />
      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
        {/* Hero Split Screen */}
        <section className="relative min-h-[78vh] overflow-hidden border-b-4 border-neo-border pt-12 pb-16 md:py-24 px-4 md:px-8 flex items-center">
          <div
            className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 font-mono text-[22rem] font-black leading-none text-neo-accent opacity-[0.07]"
            aria-hidden="true"
          >
            @
          </div>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            {/* Badge au-dessus de la grille */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center gap-3"
            >
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                06
              </span>
              <NeoTag>{t("hero.badge")}</NeoTag>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-24 items-center">
              {/* LEFT - Accroche + Illustration */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="overflow-hidden"
              >
                {/* Titre */}
                <motion.h1
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[13vw] md:text-[9vw] lg:text-[6vw] font-black leading-[0.78] tracking-[-0.07em] uppercase text-neo-text break-words"
                >
                  {t("hero.title")}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 text-lg md:text-xl max-w-xl border-l-4 border-neo-accent pl-5 text-neo-text/70"
                >
                  {t("hero.description")}
                </motion.p>

                {/* Illustration géométrique */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-10 hidden max-w-md lg:block opacity-70"
                >
                  <GeometricIllustration />
                </motion.div>
              </motion.div>

              {/* RIGHT - Infos Contact */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <NeoContactInfo />
              </motion.div>
            </div>
          </div>
        </section>

        <section
          className="overflow-hidden border-b-4 border-neo-border bg-neo-accent py-3 text-neo-on-accent"
          aria-label={t("directContact.title")}
        >
          <motion.div
            initial={{ x: 0 }}
            animate={reduceMotion ? undefined : { x: "-50%" }}
            transition={
              reduceMotion ? undefined : { duration: 48, repeat: Infinity, ease: "linear" }
            }
            className="flex w-max whitespace-nowrap font-mono text-sm font-black uppercase tracking-[0.18em]"
          >
            {(reduceMotion ? [0] : [0, 1]).map((group) => (
              <div
                key={group}
                className="flex shrink-0 items-center"
                aria-hidden={group === 1 ? "true" : undefined}
              >
                {tickerItems.map((item) => (
                  <span key={item.label} className="flex shrink-0 items-center gap-7 px-5 md:px-8">
                    <span>{item.label}</span>
                    <span className="flex h-7 w-7 rotate-45 items-center justify-center border-2 border-neo-border bg-neo-text text-neo-accent shadow-[2px_2px_0px_0px_var(--neo-shadow)]">
                      <item.icon className="h-3.5 w-3.5 -rotate-45" aria-hidden="true" />
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-neo-text">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-neo-text-inverse text-lg mb-6"
            >
              {t("cta.text")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <Link href="/services">
                <BrutalistButton variant="dark" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  {t("cta.button")}
                </BrutalistButton>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoContact;
