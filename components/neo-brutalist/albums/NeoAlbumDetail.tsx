"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Disc,
  Users,
  ArrowLeft,
  Eye,
  Headphones,
  ExternalLink,
  Music,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoCard } from "../ui/NeoCard";
import { NeoTag } from "../ui/NeoTag";
import { NeoAlbumPlayer } from "./NeoAlbumPlayer";

interface Album {
  id: string;
  title: string;
  img: string;
  poster: string;
  date: string;
  sortedDate: string;
  style: string;
  listenLink: string;
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  collabName: string | null;
  collabLink: string | null;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface NeoAlbumDetailProps {
  album: Album;
  allAlbums: Album[];
  locale: string;
  isPreview?: boolean;
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Audio wave animation component
const AudioWaveAnimation = () => (
  <div className="flex items-end gap-[2px] h-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-[3px] bg-neo-accent rounded-full"
        animate={{
          height: ["4px", "16px", "8px", "12px", "4px"],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
);

export default function NeoAlbumDetail({
  album,
  allAlbums,
  locale,
  isPreview = false,
}: NeoAlbumDetailProps) {
  const t = useTranslations("albums.detail");
  const tCommon = useTranslations("common");

  // Filter related albums (same style, excluding current)
  const relatedAlbums = allAlbums
    .filter((a) => a.id !== album.id && a.style === album.style)
    .slice(0, 3);

  const hasPlayer = album.spotifyEmbed || album.youtubeEmbed;

  // Find previous and next albums for navigation
  const currentIndex = allAlbums.findIndex((a) => a.id === album.id);
  const prevAlbum =
    currentIndex > 0 ? allAlbums[currentIndex - 1] : allAlbums[allAlbums.length - 1];
  const nextAlbum =
    currentIndex < allAlbums.length - 1 ? allAlbums[currentIndex + 1] : allAlbums[0];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-24 pb-24">
        {/* Preview Banner */}
        {isPreview && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase">
                Prévisualisation - {album.published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/albums"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t("backToAlbums")}
            </Link>
          </motion.div>

          {/* ==================== HERO SECTION ==================== */}
          <section className="mb-16 lg:mb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-[minmax(280px,400px)_1fr] gap-8 lg:gap-12 items-start w-full"
            >
              {/* Left Column - Album Cover */}
              <motion.div
                variants={fadeInLeft}
                className="relative max-w-[320px] sm:max-w-[360px] lg:max-w-none mx-auto lg:mx-0"
              >
                {/* Decorative background element */}
                <div className="absolute -inset-4 bg-neo-accent/10 rotate-2 -z-10 hidden lg:block" />
                <div className="absolute -inset-2 bg-neo-text/5 -rotate-1 -z-10 hidden lg:block" />

                <NeoCard
                  hover="lift"
                  padding="none"
                  className="overflow-hidden shadow-[10px_10px_0px_0px_var(--neo-shadow)] border-4"
                >
                  <div className="aspect-square relative overflow-hidden group">
                    <Image
                      src={album.img}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                      sizes="(max-width: 640px) 320px, (max-width: 1024px) 360px, 400px"
                    />
                    {/* Overlay with play indication */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neo-text/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </NeoCard>

                {/* Album number badge */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-5 lg:-right-5 bg-neo-text text-neo-accent w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center border-4 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)]">
                  <Disc className="w-7 h-7 lg:w-8 lg:h-8" />
                </div>
              </motion.div>

              {/* Right Column - Album Info + Description */}
              <motion.div variants={fadeInRight} className="space-y-6">
                {/* Genre Tag */}
                <NeoTag variant="accent" size="lg" className="inline-flex">
                  <Disc className="w-4 h-4 mr-2" />
                  {album.style}
                </NeoTag>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-neo-text">
                  {album.title}
                </h1>

                {/* Metadata Grid */}
                <div className="space-y-4 py-6 border-y-4 border-neo-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neo-text flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-6 h-6 text-neo-accent" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tCommon("releaseDate")}
                        </span>
                        <span className="font-bold text-lg">{album.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neo-text flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-neo-accent" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tCommon("artist")}
                        </span>
                        <span className="font-bold text-lg">{album.poster}</span>
                      </div>
                    </div>
                  </div>

                  {album.collabName && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neo-accent flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-neo-text-inverse" />
                      </div>
                      <div>
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tCommon("collaborators")}
                        </span>
                        <span className="font-bold">{album.collabName}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 01 - À propos */}
                <div className="pt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                      01
                    </span>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neo-text">
                      {t("about")}
                    </h2>
                    <div className="flex-1 h-1 bg-neo-border" />
                  </div>
                  <div
                    className="prose prose-base max-w-none text-neo-text
                      prose-headings:font-black prose-headings:uppercase prose-headings:text-neo-text
                      prose-p:font-mono prose-p:leading-relaxed prose-p:text-sm
                      prose-strong:text-neo-accent prose-strong:font-bold
                      prose-a:text-neo-accent prose-a:no-underline hover:prose-a:underline
                      prose-ul:text-sm prose-li:font-mono"
                    dangerouslySetInnerHTML={{
                      __html: locale === "fr" ? album.descriptionsFr : album.descriptionsEn,
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* ==================== PLAYER SECTION ==================== */}
          {hasPlayer && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 lg:mb-24"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                  02
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                  {t("player")}
                </h2>
                <div className="flex-1 h-1 bg-neo-border" />
              </div>

              {/* Split Layout: Player + Other Platforms */}
              <div
                className={`grid grid-cols-1 ${album.listenLink ? "lg:grid-cols-[1fr_320px]" : ""} gap-6`}
              >
                {/* Left: Player */}
                <NeoCard
                  variant="default"
                  padding="lg"
                  className="border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
                >
                  <NeoAlbumPlayer
                    spotifyEmbed={album.spotifyEmbed}
                    youtubeEmbed={album.youtubeEmbed}
                    title={album.title}
                  />

                  {/* Now Playing Indicator */}
                  <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t-2 border-neo-border">
                    <AudioWaveAnimation />
                    <span className="font-mono text-xs font-bold uppercase text-neo-text/60">
                      {t("nowPlaying")}
                    </span>
                    <AudioWaveAnimation />
                  </div>
                </NeoCard>

                {/* Right: Other Platforms */}
                {album.listenLink && (
                  <NeoCard
                    variant="inverted"
                    padding="lg"
                    className="border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)] hover:shadow-[8px_8px_0px_0px_var(--neo-accent)] transition-shadow duration-300 flex flex-col justify-center"
                  >
                    <div className="text-center space-y-5">
                      {/* Icon */}
                      <div className="w-14 h-14 bg-neo-accent mx-auto flex items-center justify-center rotate-3">
                        <Headphones className="w-7 h-7 text-neo-text-inverse" />
                      </div>

                      {/* Title */}
                      <h3 className="font-black text-xl uppercase tracking-tight text-neo-text-inverse">
                        {t("alsoAvailable")}
                      </h3>

                      {/* Description */}
                      <p className="font-mono text-sm text-neo-text-inverse/70 leading-relaxed">
                        {t("otherPlatformsDescription")}
                      </p>

                      {/* Button */}
                      <a
                        href={album.listenLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 bg-neo-accent text-neo-text-inverse
                          border-2 border-neo-accent hover:bg-neo-bg hover:text-neo-text hover:border-neo-border
                          transition-colors font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_0px_var(--neo-accent)]
                          hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)]"
                      >
                        <Music className="w-4 h-4" />
                        <span>{t("allPlatforms")}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </NeoCard>
                )}
              </div>
            </motion.section>
          )}

          {/* ==================== LISTEN SECTION (when no player) ==================== */}
          {!hasPlayer && album.listenLink && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 lg:mb-24"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                  02
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                  {t("listen")}
                </h2>
                <div className="flex-1 h-1 bg-neo-border" />
              </div>

              {/* Listen Card */}
              <NeoCard
                variant="default"
                padding="lg"
                className="max-w-2xl border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
              >
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-neo-accent mx-auto flex items-center justify-center">
                    <Headphones className="w-8 h-8 text-neo-text-inverse" />
                  </div>
                  <p className="font-mono text-sm text-neo-text/70">{t("listenDescription")}</p>
                  <a
                    href={album.listenLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-4 bg-neo-accent text-neo-text-inverse
                      border-3 border-neo-border hover:bg-neo-text hover:text-neo-accent
                      transition-colors font-mono text-sm font-bold uppercase shadow-[4px_4px_0px_0px_var(--neo-shadow)]
                      hover:shadow-[6px_6px_0px_0px_var(--neo-shadow)]"
                  >
                    <Music className="w-5 h-5" />
                    <span>{t("listenOnPlatforms")}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </NeoCard>
            </motion.section>
          )}

          {/* ==================== RELATED ALBUMS ==================== */}
          {relatedAlbums.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 lg:mb-24"
            >
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                  {hasPlayer || album.listenLink ? "03" : "02"}
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                  {t("relatedAlbums")}
                </h2>
                <div className="flex-1 h-1 bg-neo-border" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {relatedAlbums.map((relatedAlbum, index) => (
                  <motion.div
                    key={relatedAlbum.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={{ pathname: "/albums/[id]", params: { id: relatedAlbum.id } }}>
                      <NeoCard hover="lift" padding="sm" className="group h-full">
                        <div className="aspect-square relative overflow-hidden mb-4">
                          <Image
                            src={relatedAlbum.img}
                            alt={relatedAlbum.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <NeoTag variant="accent" size="sm" className="mb-2">
                          {relatedAlbum.style}
                        </NeoTag>
                        <h3 className="text-xl font-black uppercase truncate text-neo-text">
                          {relatedAlbum.title}
                        </h3>
                        <p className="font-mono text-sm text-neo-text/60 mt-1">
                          {relatedAlbum.date}
                        </p>
                      </NeoCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ==================== ALBUM NAVIGATION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Previous Album */}
              <Link
                href={{ pathname: "/albums/[id]", params: { id: prevAlbum.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-16 md:w-20 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronLeft className="w-8 h-8 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0 border-2 border-neo-border">
                        <Image
                          src={prevAlbum.img}
                          alt={prevAlbum.title}
                          fill
                          className="object-cover transition-transform duration-300"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {t("previousAlbum")}
                        </span>
                        <h3 className="font-black text-lg md:text-xl uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {prevAlbum.title}
                        </h3>
                        <span className="font-mono text-xs text-neo-text/50">
                          {prevAlbum.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>

              {/* Next Album */}
              <Link
                href={{ pathname: "/albums/[id]", params: { id: nextAlbum.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full flex-row-reverse">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-16 md:w-20 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronRight className="w-8 h-8 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-4 p-4 flex-1 min-w-0 flex-row-reverse text-right">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0 border-2 border-neo-border">
                        <Image
                          src={nextAlbum.img}
                          alt={nextAlbum.title}
                          fill
                          className="object-cover transition-transform duration-300"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {t("nextAlbum")}
                        </span>
                        <h3 className="font-black text-lg md:text-xl uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {nextAlbum.title}
                        </h3>
                        <span className="font-mono text-xs text-neo-text/50">
                          {nextAlbum.style}
                        </span>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>
            </div>

            {/* Back to albums link */}
            <div className="mt-8 text-center">
              <Link
                href="/albums"
                className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("backToAlbums")}
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
