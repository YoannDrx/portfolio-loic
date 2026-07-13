"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Video, ArrowRight, Film } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { BrutalistButton } from "../ui/BrutalistButton";
import { NeoTag } from "../ui/NeoTag";
import { NeoVideoCard } from "./NeoVideoCard";
import { GridBackground } from "../ui/GridBackground";
import { ImmersivePageAtmosphere } from "../ui/ImmersivePageAtmosphere";
import { SectionTransition } from "../ui/SectionTransition";
import { Link } from "@/i18n/routing";

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  type: string;
  date: string;
  img?: string | null;
  order?: number | null;
}

interface NeoVideosPageProps {
  videos: VideoItem[];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
};

export const NeoVideosPage: React.FC<NeoVideosPageProps> = ({ videos }) => {
  const t = useTranslations("videos");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Ordre des catégories souhaité
  const categoryOrder = ["Sync", "MusicToPicture", "OriginalMusic"];

  // Extract unique types dans l'ordre souhaité
  const types = useMemo(() => {
    const typeSet = new Set<string>();
    videos.forEach((video) => {
      if (video.type) typeSet.add(video.type);
    });
    // Trier selon l'ordre défini
    return Array.from(typeSet).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [videos]);

  // Fonction pour parser les dates au format DD/MM/YYYY
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // Seuil de priorité : order < 100 = prioritaire, order >= 100 = tri par date
  const PRIORITY_THRESHOLD = 100;

  // Fonction de tri hybride : prioritaires d'abord (par order), puis normales (par date DESC)
  const hybridSort = (a: VideoItem, b: VideoItem) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;

    const aPriority = orderA < PRIORITY_THRESHOLD;
    const bPriority = orderB < PRIORITY_THRESHOLD;

    // 1. Prioritaires d'abord (triés par order ASC)
    if (aPriority && bPriority) {
      return orderA - orderB;
    }
    if (aPriority) return -1;
    if (bPriority) return 1;

    // 2. Non-prioritaires : tri par année DESC
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  };

  // Grouper les vidéos par catégorie et trier avec le tri hybride
  const groupedVideos = useMemo(() => {
    const groups: Record<string, VideoItem[]> = {};

    categoryOrder.forEach((cat) => {
      groups[cat] = videos.filter((v) => v.type === cat).sort(hybridSort);
    });

    return groups;
  }, [videos]);

  // Filter videos by type
  const filteredVideos = useMemo(() => {
    if (!selectedType) return null; // null = afficher par catégories
    return videos.filter((video) => video.type === selectedType).sort(hybridSort);
  }, [videos, selectedType]);

  const getTypeLabel = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("original")) return t("filterOriginalMusic");
    if (lowerType.includes("sync")) return t("filterSync");
    if (
      lowerType.includes("musictopicture") ||
      lowerType.includes("music to picture") ||
      lowerType.includes("m2p")
    )
      return t("filterMusicToPicture");
    return type;
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <GridBackground withAccentGlow />
      <ImmersivePageAtmosphere />
      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
        {/* Hero - Light variant */}
        <section className="relative min-h-[72vh] md:min-h-[78vh] overflow-hidden border-b-4 border-neo-border flex flex-col justify-center pt-12 pb-20 md:py-28 px-4 md:px-8">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, rotate: -18, scale: 0.8 }}
            animate={{ opacity: 0.12, rotate: 8, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -right-20 top-1/2 hidden h-[30rem] w-[30rem] -translate-y-1/2 items-center justify-center rounded-full border-[3rem] border-neo-accent lg:flex"
          >
            <Film className="h-40 w-40 text-neo-text" />
          </motion.div>
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex items-center gap-3"
            >
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                05
              </span>
              <NeoTag variant="default">{t("hero.badge")}</NeoTag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-5xl text-[13vw] md:text-[9vw] lg:text-[7vw] font-black leading-[0.78] tracking-[-0.07em] uppercase text-neo-text"
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl max-w-2xl border-l-4 border-neo-accent pl-5 text-neo-text/65"
            >
              {t("hero.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <BrutalistButton
                variant="primary"
                size="lg"
                icon={<Video className="w-5 h-5" />}
                onClick={() =>
                  document.getElementById("videos-grid")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("hero.cta")}
              </BrutalistButton>
              <Link href="/contact">
                <BrutalistButton variant="secondary" size="lg">
                  {t("hero.ctaSecondary")}
                </BrutalistButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-5 border-b-4 border-neo-border sticky top-0 bg-neo-bg/90 backdrop-blur-xl z-30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                  !selectedType
                    ? "bg-neo-accent text-neo-text-inverse border-neo-accent"
                    : "bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent"
                }`}
              >
                {t("filterAll")} ({videos.length})
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                    selectedType === type
                      ? "bg-neo-accent text-neo-text-inverse border-neo-accent"
                      : "bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent"
                  }`}
                >
                  {getTypeLabel(type)} ({videos.filter((v) => v.type === type).length})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section id="videos-grid" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              {/* Affichage filtré par catégorie unique */}
              {filteredVideos ? (
                <motion.div
                  key={selectedType || "filtered"}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={staggerContainer}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-10"
                >
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => (
                      <motion.div key={video.id} variants={fadeInUp} layout className="h-full">
                        <NeoVideoCard video={video} />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div variants={fadeInUp} className="col-span-full text-center py-16">
                      <Film className="w-16 h-16 mx-auto mb-4 text-neo-text/20" />
                      <p className="font-mono text-lg text-neo-text/60">{t("noVideos")}</p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* Affichage groupé par catégories */
                <motion.div
                  key="grouped"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="space-y-24"
                >
                  {categoryOrder.map((category) => {
                    const categoryVideos = groupedVideos[category];
                    if (!categoryVideos || categoryVideos.length === 0) return null;

                    return (
                      <motion.div key={category} variants={fadeInUp}>
                        {/* Titre de catégorie */}
                        <div className="flex items-end gap-4 mb-10 border-b-4 border-neo-border pb-5">
                          <span className="font-mono text-sm text-neo-accent">
                            /{String(categoryOrder.indexOf(category) + 1).padStart(2, "0")}
                          </span>
                          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-neo-text">
                            {getTypeLabel(category)}
                          </h2>
                          <span className="font-mono text-sm bg-neo-accent text-neo-text-inverse px-2 py-1">
                            {categoryVideos.length}
                          </span>
                        </div>

                        {/* Grille de vidéos */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-10">
                          {categoryVideos.map((video) => (
                            <motion.div
                              key={video.id}
                              variants={fadeInUp}
                              layout
                              className="h-full"
                            >
                              <NeoVideoCard video={video} />
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <SectionTransition inverted />

        {/* CTA */}
        <section className="py-24 bg-neo-text">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Video className="w-16 h-16 mx-auto mb-6 text-neo-accent" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neo-text-inverse mb-4">
                {t("videosCta.title")}
              </h2>
              <p className="font-mono text-lg text-neo-text-inverse/65 max-w-2xl mx-auto mb-8">
                {t("videosCta.description")}
              </p>
              <div className="flex justify-center">
                <Link href="/contact">
                  <BrutalistButton
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {t("videosCta.button")}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoVideosPage;
