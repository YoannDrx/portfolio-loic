"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ArrowRight, Disc, Star } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoHeroSection } from "../ui/NeoHeroSection";
import { NeoCard } from "../ui/NeoCard";
import { BrutalistButton } from "../ui/BrutalistButton";
import { NeoTag } from "../ui/NeoTag";
import { Link } from "@/i18n/routing";

interface Album {
  id: string;
  title: string;
  img: string | null;
  style: string | null;
  date: string;
  listenLink: string | null;
  collabName?: string | null;
  order?: number;
}

interface NeoAlbumsPageProps {
  albums: Album[];
}

const normalizeGenre = (style: string | null) => {
  if (!style) return null;

  const normalized = style
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("metal") || normalized.includes("hardcore")) return "Metal";
  if (
    normalized.includes("hip-hop") ||
    normalized.includes("hip hop") ||
    normalized.includes("rnb") ||
    normalized.includes("trap")
  )
    return "Hip-Hop";
  if (normalized.includes("ambient")) return "Ambient";
  if (normalized.includes("synthwave")) return "Synthwave";
  if (normalized.includes("cyberpunk")) return "Cyberpunk";
  if (normalized.includes("bass")) return "Bass Music";
  if (normalized.includes("pop punk") || normalized.includes("punk")) return "Pop Punk";
  if (normalized.includes("all music genres")) return "Various";

  return style;
};

const sortGenres = (genres: string[]) => {
  const order = [
    "Metal",
    "Hip-Hop",
    "Ambient",
    "Bass Music",
    "Synthwave",
    "Cyberpunk",
    "Pop Punk",
    "Various",
  ];

  const orderIndex = (genre: string) => {
    const index = order.indexOf(genre);
    return index === -1 ? Number.POSITIVE_INFINITY : index;
  };

  return [...genres].sort((a, b) => {
    const byOrder = orderIndex(a) - orderIndex(b);
    if (byOrder !== 0) return byOrder;
    return a.localeCompare(b);
  });
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } },
};

export const NeoAlbumsPage: React.FC<NeoAlbumsPageProps> = ({ albums }) => {
  const t = useTranslations("albums");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genreCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const album of albums) {
      const genre = normalizeGenre(album.style);
      if (!genre) continue;
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
    return counts;
  }, [albums]);

  // Extract unique genres
  const genres = useMemo(() => {
    return sortGenres(Array.from(genreCounts.keys()));
  }, [genreCounts]);

  // Filter albums by genre
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const albumGenre = normalizeGenre(album.style);

      const matchesGenre = !selectedGenre || albumGenre === selectedGenre;
      if (!matchesGenre) return false;
      return true;
    });
  }, [albums, selectedGenre]);

  // Stats - valeurs fixes demandées par Loïc
  const stats = useMemo(
    () => ({
      total: 20,
      genres: "∞",
      collaborations: albums.filter((a) => a.collabName).length,
      years: "2018 - 2026",
    }),
    [albums]
  );

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
        {/* Hero */}
        <NeoHeroSection
          badgeNumber="04"
          badge={t("hero.badge")}
          title={t("hero.title")}
          description={t("hero.description")}
          fullViewport
        >
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="lg"
              icon={<Music className="w-5 h-5" />}
              onClick={() =>
                document.getElementById("albums-grid")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.cta")}
            </BrutalistButton>
            <Link href="/contact">
              <BrutalistButton variant="secondary" size="lg">
                {t("hero.ctaSecondary")}
              </BrutalistButton>
            </Link>
          </div>
        </NeoHeroSection>

        {/* Stats Bar */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: stats.total.toString(), label: t("stats.total") },
                { val: stats.genres.toString(), label: t("stats.genres") },
                { val: stats.collaborations.toString(), label: t("stats.collaborations") },
                { val: stats.years, label: t("stats.period") },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-neo-accent tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest mt-2 opacity-60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b-2 border-neo-border sticky top-[72px] bg-neo-bg z-30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                  !selectedGenre
                    ? "bg-neo-accent text-neo-text-inverse border-neo-accent"
                    : "bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent"
                }`}
              >
                {t("filterAll")} ({albums.length})
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 font-mono text-xs font-bold uppercase border-2 border-neo-border transition-all ${
                    selectedGenre === genre
                      ? "bg-neo-accent text-neo-text-inverse border-neo-accent"
                      : "bg-neo-surface hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent"
                  }`}
                >
                  {genre} ({genreCounts.get(genre) ?? 0})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Albums Grid */}
        <section id="albums-grid" className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGenre || "all"}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                {filteredAlbums.length > 0 ? (
                  filteredAlbums.map((album) => (
                    <motion.div
                      key={album.id}
                      variants={fadeInUp}
                      layout
                      className="group relative"
                    >
                      <Link
                        href={{ pathname: "/albums/[id]", params: { id: album.id } }}
                        className="block"
                      >
                        {/* Cover */}
                        <div className="aspect-square border-4 border-neo-border bg-neo-bg-alt relative mb-6 overflow-hidden shadow-[8px_8px_0px_0px_var(--neo-accent)] group-hover:shadow-[12px_12px_0px_0px_var(--neo-accent)] transition-all duration-300">
                          <div
                            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={{ backgroundImage: album.img ? `url(${album.img})` : undefined }}
                          />
                          {!album.img && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Disc className="w-20 h-20 opacity-20" />
                            </div>
                          )}
                          {/* Overlay with arrow icon */}
                          <div className="absolute inset-0 flex items-center justify-center bg-neo-text/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-20 h-20 bg-neo-accent rounded-full flex items-center justify-center border-4 border-neo-border">
                              <ArrowRight size={32} className="text-neo-text-inverse" />
                            </div>
                          </div>
                          {/* Badge Favori pour les albums épinglés */}
                          {album.order !== undefined && album.order < 100 && (
                            <div className="absolute top-3 right-3 bg-neo-accent text-neo-text-inverse px-3 py-1 border-2 border-neo-border flex items-center gap-1.5 font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_0px_var(--neo-border)]">
                              <Star size={12} className="fill-current" />
                              {t("featured")}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-2xl font-black uppercase leading-tight mb-2 truncate text-neo-text">
                              {album.title}
                            </h3>
                            <NeoTag variant="accent" size="sm">
                              {normalizeGenre(album.style) || "Genre"}
                            </NeoTag>
                          </div>
                          <span className="font-mono text-sm font-bold border-2 border-neo-border px-2 py-1 flex-shrink-0">
                            {new Date(album.date).getFullYear()}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <motion.div variants={fadeInUp} className="col-span-full text-center py-16">
                    <Disc className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="font-mono text-lg opacity-60">{t("noAlbums")}</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-neo-text">
          <div className="container mx-auto px-4 md:px-6">
            <NeoCard variant="inverted" hover="none" padding="lg" className="text-center">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neo-text-inverse mb-4">
                {t("albumsCta.title")}
              </h2>
              <p className="font-mono text-lg text-neo-text-inverse/60 max-w-2xl mx-auto mb-8">
                {t("albumsCta.description")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <BrutalistButton
                    variant="dark"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {t("albumsCta.buttonSecondary")}
                  </BrutalistButton>
                </Link>
              </div>
            </NeoCard>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoAlbumsPage;
