"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Music, ArrowRight, ArrowUpRight, Disc, Sparkles } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoHeroSection } from "../ui/NeoHeroSection";
import { NeoCard } from "../ui/NeoCard";
import { BrutalistButton } from "../ui/BrutalistButton";
import { GridBackground } from "../ui/GridBackground";
import { ImmersivePageAtmosphere } from "../ui/ImmersivePageAtmosphere";
import { SectionTransition } from "../ui/SectionTransition";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface Album {
  id: string;
  slug?: string | null;
  title: string;
  img: string | null;
  style: string | null;
  date: string;
  listenLink: string | null;
  collabName?: string | null;
  spotifyEmbed?: string | null;
  featured?: boolean;
  featuredOrder?: number | null;
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
  if (normalized.includes("k-pop") || normalized.includes("kpop")) return "K-Pop";
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
    "K-Pop",
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

interface AlbumCardProps {
  album: Album;
  normalizeGenre: (style: string | null) => string | null;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, normalizeGenre }) => {
  const t = useTranslations("albums");
  const detailId = album.slug || album.id;
  return (
    <motion.article variants={fadeInUp} layout className="group relative">
      <Link
        href={{ pathname: "/albums/[id]", params: { id: detailId } }}
        className="relative block aspect-square overflow-hidden border-4 border-neo-border bg-neo-bg-alt shadow-[8px_8px_0px_0px_var(--neo-shadow)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-accent md:group-hover:-translate-y-2 md:group-hover:shadow-[14px_14px_0px_0px_var(--neo-accent)]"
      >
        {album.img ? (
          <Image
            src={album.img}
            alt={`${album.title} — pochette de l'album`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:saturate-[0.7]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Disc className="w-20 h-20 opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
        <div className="absolute left-0 top-0 flex w-full items-start justify-between gap-4 p-4">
          <span className="border-2 border-white/80 bg-black/50 px-2 py-1 font-mono text-xs font-bold text-white backdrop-blur-sm">
            {new Date(album.date).getFullYear()}
          </span>
          <span className="-translate-y-[180%] bg-neo-accent px-3 py-2 font-mono text-[10px] font-bold uppercase text-neo-on-accent transition-transform duration-500 group-hover:translate-y-0">
            {t("viewAlbum")}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <span className="mb-3 inline-flex border border-white/40 bg-black/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
            {normalizeGenre(album.style) || "Genre"}
          </span>
          <div className="flex items-end justify-between gap-4">
            <h3 className="max-w-[85%] text-2xl font-black uppercase leading-[0.88] tracking-tighter text-white md:text-3xl">
              {album.title}
            </h3>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-white bg-white text-black transition-all duration-300 group-hover:-rotate-45 group-hover:bg-neo-accent group-hover:text-neo-on-accent">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

interface FeaturedAlbumCardProps extends AlbumCardProps {
  index: number;
}

const FeaturedAlbumCard = ({ album, index, normalizeGenre }: FeaturedAlbumCardProps) => {
  const t = useTranslations("albums");
  const detailId = album.slug || album.id;

  return (
    <motion.article variants={fadeInUp} className="group relative">
      <Link
        href={{ pathname: "/albums/[id]", params: { id: detailId } }}
        className="relative block min-h-[30rem] overflow-hidden border-4 border-neo-border bg-neo-text shadow-[10px_10px_0px_0px_var(--neo-shadow)] transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-accent md:min-h-[38rem] md:group-hover:-translate-y-2 md:group-hover:shadow-[16px_16px_0px_0px_var(--neo-accent)]"
      >
        {album.img ? (
          <Image
            src={album.img}
            alt={`${album.title} — pochette de l'album`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Disc className="h-24 w-24 opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20 transition-colors duration-500 group-hover:via-black/30" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(135deg,transparent_45%,rgba(var(--neo-accent-rgb),0.22)_100%)]" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-6 p-5 md:p-7">
          <span className="inline-flex items-center gap-2 border-2 border-neo-accent bg-neo-accent px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-neo-on-accent">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("featured")}
          </span>
          <span className="font-mono text-5xl font-black tracking-[-0.12em] text-white/35 md:text-7xl">
            0{index + 1}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
            <span className="border border-white/50 bg-black/35 px-2 py-1 backdrop-blur-sm">
              {normalizeGenre(album.style) || "Genre"}
            </span>
            <span className="border border-white/50 bg-black/35 px-2 py-1 backdrop-blur-sm">
              {new Date(album.date).getFullYear()}
            </span>
          </div>
          <div className="flex items-end justify-between gap-5">
            <div>
              <h3 className="text-4xl font-black uppercase leading-[0.82] tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
                {album.title}
              </h3>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors group-hover:text-neo-accent">
                {t("featuredCta")}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-white bg-white text-black transition-all duration-300 group-hover:-rotate-45 group-hover:border-neo-accent group-hover:bg-neo-accent group-hover:text-neo-on-accent md:h-14 md:w-14">
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export const NeoAlbumsPage: React.FC<NeoAlbumsPageProps> = ({ albums }) => {
  const t = useTranslations("albums");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const featuredAlbums = useMemo(
    () =>
      albums
        .filter((album) => album.featured)
        .sort(
          (a, b) =>
            (a.featuredOrder ?? Number.POSITIVE_INFINITY) -
            (b.featuredOrder ?? Number.POSITIVE_INFINITY)
        ),
    [albums]
  );

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
      return selectedGenre ? true : !album.featured;
    });
  }, [albums, selectedGenre]);

  // Stats
  const stats = useMemo(
    () => ({
      total: albums.length,
      genres: "∞",
      collaborations: albums.filter((a) => a.collabName).length,
      years: `2018 - ${new Date().getFullYear()}`,
    }),
    [albums]
  );

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <GridBackground withAccentGlow />
      <ImmersivePageAtmosphere />
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

        <div id="albums-grid" className="scroll-mt-24" />

        {featuredAlbums.length > 0 && (
          <section className="relative overflow-hidden border-t-4 border-neo-border bg-neo-surface py-20 md:py-28">
            <div className="pointer-events-none absolute -right-16 top-8 font-display text-[28vw] font-black leading-none tracking-[-0.12em] text-neo-text/[0.035] md:text-[18vw]">
              {String(featuredAlbums.length).padStart(2, "0")}
            </div>
            <div className="container relative mx-auto px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6 }}
                className="mb-10 grid gap-6 border-b-4 border-neo-border pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"
              >
                <div>
                  <span className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.22em] text-neo-accent">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {t("featuredEyebrow", { count: featuredAlbums.length })}
                  </span>
                  <h2 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.86] tracking-[-0.055em] text-neo-text md:text-6xl lg:text-7xl">
                    {t("featuredTitle")}
                  </h2>
                </div>
                <p className="max-w-2xl border-l-4 border-neo-accent pl-5 text-base font-medium leading-relaxed text-neo-text/75 md:text-lg lg:justify-self-end">
                  {t("featuredDescription")}
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                variants={staggerContainer}
                className="grid gap-8 lg:grid-cols-2 lg:gap-10"
              >
                {featuredAlbums.map((album, index) => (
                  <FeaturedAlbumCard
                    key={album.id}
                    album={album}
                    index={index}
                    normalizeGenre={normalizeGenre}
                  />
                ))}
              </motion.div>
            </div>
          </section>
        )}

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

        <SectionTransition />

        {/* Filters */}
        <section className="py-5 border-b-4 border-neo-border sticky top-0 bg-neo-bg/90 backdrop-blur-xl z-30">
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
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="mb-10 flex items-end justify-between gap-6 border-b-4 border-neo-border pb-5"
            >
              <h2 className="text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">
                {selectedGenre || t("catalogTitle")}
              </h2>
              <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.18em] text-neo-accent">
                {t("resultCount", { count: filteredAlbums.length })}
              </span>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGenre || "all"}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9"
              >
                {filteredAlbums.length > 0 ? (
                  filteredAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} normalizeGenre={normalizeGenre} />
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

        <SectionTransition inverted />

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
