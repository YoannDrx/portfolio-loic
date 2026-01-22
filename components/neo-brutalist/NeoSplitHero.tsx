"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { SOUND_CLOUD_PROFILE_URL, useGlobalAudioPlayer } from "@/lib/player/globalAudioPlayer";
import { useSoundCloudWaveform } from "@/lib/hooks/useSoundCloudWaveform";
import { ConsentGate } from "./legal/ConsentGate";
import { SoundCloudIcon } from "./player/SoundCloudIcon";
import { SoundCloudTrackList } from "./player/SoundCloudTrackList";
import { SoundCloudWaveform } from "./player/SoundCloudWaveform";
import { formatTime } from "./player/utils";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const letterReveal = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.5 },
  },
};

const floatingShape = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.8 + i * 0.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.6 },
  },
};

const taglineVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, delay: 1.2 },
  },
};

const glitchKeyframes = {
  "0%": { transform: "translate(0)" },
  "20%": { transform: "translate(-2px, 2px)" },
  "40%": { transform: "translate(-2px, -2px)" },
  "60%": { transform: "translate(2px, 2px)" },
  "80%": { transform: "translate(2px, -2px)" },
  "100%": { transform: "translate(0)" },
};

const normalizeArtworkUrl = (url: string | null | undefined, size: "t200x200" | "t500x500") => {
  if (!url) return null;
  return url.replace("-large", `-${size}`);
};

export const NeoSplitHero: React.FC = () => {
  const t = useTranslations("home.splitHero");
  const tPlayer = useTranslations("musicPlayer");
  const locale = useLocale();
  const isFrench = locale === "fr";

  const {
    status,
    mediaAllowed,
    isPlaying,
    track,
    queue,
    currentIndex,
    positionMs,
    durationMs,
    volume,
    error,
    actions,
  } = useGlobalAudioPlayer();

  const [lastNonZeroVolume, setLastNonZeroVolume] = useState(80);

  useEffect(() => {
    if (volume > 0) setLastNonZeroVolume(volume);
  }, [volume]);

  const progress = durationMs > 0 ? Math.min(1, positionMs / durationMs) : 0;
  const remainingMs = Math.max(0, durationMs - positionMs);
  const externalUrl = track?.permalinkUrl || SOUND_CLOUD_PROFILE_URL;
  const artworkUrl = normalizeArtworkUrl(track?.artworkUrl ?? null, "t500x500");

  const { samples, isLoading: isWaveformLoading } = useSoundCloudWaveform(
    mediaAllowed ? track?.waveformUrl : null,
    track?.id,
    96
  );

  const isPlayerUnavailable = status === "error" || !!error;
  const controlsDisabled = !mediaAllowed || status !== "ready" || isPlayerUnavailable;
  const isLoadingData = mediaAllowed && !track && queue.length === 0 && status !== "error";

  const statusLabel = useMemo(() => {
    if (!mediaAllowed) return tPlayer("status.mediaDisabled");
    if (isPlayerUnavailable) return tPlayer("status.unavailable");
    if (status === "loading") return tPlayer("status.loading");
    return isPlaying ? tPlayer("status.playing") : tPlayer("status.paused");
  }, [isPlayerUnavailable, isPlaying, mediaAllowed, status, tPlayer]);

  // Split text into words for animation
  const line1Words = t("title.line1").split(" ");
  const line3Words = t("title.line3").split(" ");

  return (
    <motion.section
      className="container mx-auto px-4 md:px-6 mb-16 min-h-[calc(100vh-8rem)] flex flex-col xl:grid xl:grid-cols-[60fr_40fr] gap-8 xl:gap-12 items-center relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          custom={0}
          variants={floatingShape}
          initial="hidden"
          animate="visible"
          className="absolute top-[15%] left-[5%] w-16 h-16 border-4 border-neo-accent/30 rotate-12"
          style={{ animation: "float 6s ease-in-out infinite" }}
        />
        <motion.div
          custom={1}
          variants={floatingShape}
          initial="hidden"
          animate="visible"
          className="absolute top-[25%] right-[15%] w-8 h-8 bg-neo-accent/20 rotate-45 hidden xl:block"
          style={{ animation: "float 8s ease-in-out infinite reverse" }}
        />
        <motion.div
          custom={2}
          variants={floatingShape}
          initial="hidden"
          animate="visible"
          className="absolute bottom-[30%] left-[10%] w-12 h-12 border-2 border-neo-text/10 rounded-full hidden md:block"
          style={{ animation: "float 7s ease-in-out infinite" }}
        />
        <motion.div
          custom={3}
          variants={floatingShape}
          initial="hidden"
          animate="visible"
          className="absolute top-[60%] right-[5%] w-20 h-1 bg-neo-accent/40 -rotate-45 hidden xl:block"
        />
      </div>

      {/* Left Panel - Text Content */}
      <motion.div className="flex flex-col justify-center w-full pt-8 md:pt-0 relative z-10">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-mono text-xs font-bold text-neo-accent flex items-center gap-3 mb-6"
        >
          <motion.span
            className="bg-neo-text text-neo-accent px-3 py-1.5 text-sm font-bold relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <span className="relative z-10">01</span>
            <motion.div
              className="absolute inset-0 bg-neo-accent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.span>
          <motion.div
            className="w-2 h-2 bg-neo-accent"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="tracking-wider">{t("basedIn")}</span>
        </motion.div>

        {/* Animated Horizontal Line */}
        <motion.div variants={lineReveal} className="h-1 bg-neo-accent mb-6 w-24" />

        {/* Main Title with Word-by-Word Animation */}
        <h1 className="text-[9vw] sm:text-[10vw] lg:text-[7vw] xl:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase break-words mb-8 text-neo-text max-w-full perspective-[1000px]">
          {/* Line 1 - Word by word reveal */}
          <span className="block overflow-hidden">
            {line1Words.map((word, i) => (
              <motion.span
                key={i}
                variants={letterReveal}
                className="inline-block mr-[0.25em]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {word}
              </motion.span>
            ))}
          </span>

          {/* Line 2 - Highlighted word with glitch effect */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: -2,
              transition: {
                duration: 0.8,
                delay: 0.6,
                type: "spring",
                stiffness: 150,
                damping: 12,
              },
            }}
            whileHover={{
              rotate: 3,
              scale: 1.02,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-block relative px-3 md:px-5 py-2 md:py-3 bg-neo-accent text-neo-text-inverse border-4 border-neo-text shadow-[8px_8px_0px_0px_var(--neo-text)] my-3 whitespace-nowrap origin-center cursor-default group"
          >
            {/* Glitch layers */}
            <span
              className="absolute inset-0 bg-neo-accent opacity-0 group-hover:opacity-100"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
                transform: "translate(-2px, 0)",
                transition: "opacity 0.1s",
              }}
            />
            <span className="relative z-10">{t("title.line2")}</span>
            {/* Decorative corner */}
            <motion.span
              className="absolute -top-2 -right-2 w-4 h-4 bg-neo-text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            />
          </motion.span>

          {/* Line 3 - Staggered word reveal */}
          <span className={`block overflow-hidden${isFrench ? " mt-2 sm:mt-1" : " mt-1"}`}>
            {line3Words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.9 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Tagline with typewriter-like effect */}
        <motion.div
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
          className="max-w-lg relative"
        >
          <motion.div
            className="absolute -left-2 top-0 bottom-0 w-1 bg-neo-accent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            style={{ originY: 0 }}
          />
          <motion.p
            className="font-mono text-sm md:text-base font-medium pl-6 pr-4 py-4 bg-neo-surface border-2 border-neo-border shadow-[6px_6px_0px_0px_var(--neo-shadow)] text-neo-text relative overflow-hidden"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            {t("tagline")}
            <motion.span
              className="absolute bottom-2 right-4 w-2 h-4 bg-neo-accent"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Persistent SoundCloud Player */}
      <motion.div
        className="w-full xl:sticky xl:top-24 xl:w-[520px] xl:max-w-[520px] xl:justify-self-end"
        variants={rightPanelVariants}
      >
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-full h-full border-4 border-neo-border bg-neo-bg -z-10" />

          <div
            data-hero-audio-player="true"
            className="border-4 border-neo-border bg-neo-surface shadow-[12px_12px_0px_0px_var(--neo-accent)] overflow-hidden w-full"
          >
            {/* Header */}
            <div className="border-b-4 border-neo-border bg-neo-text text-neo-text-inverse p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neo-accent flex items-center justify-center border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
                  <SoundCloudIcon className="w-6 h-6 text-neo-text-inverse" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-lg uppercase tracking-tight truncate">
                    {t("player.soundcloud")}
                  </div>
                </div>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tPlayer("controls.openOnSoundcloud")}
                  className="h-10 w-10 inline-flex items-center justify-center bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:-translate-y-0.5 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <ConsentGate category="media" variant="plain" className="bg-neo-bg" minHeight={360}>
              {isLoadingData ? (
                /* Skeleton Loader */
                <div className="p-4 md:p-6 space-y-5 animate-pulse">
                  {/* Track line skeleton */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 border-2 border-neo-border bg-neo-border/30 shadow-[4px_4px_0px_0px_var(--neo-shadow)] flex-shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-20 bg-neo-accent/30 rounded-sm" />
                      <div className="h-5 w-40 bg-neo-border/40 rounded-sm" />
                      <div className="h-3 w-24 bg-neo-border/30 rounded-sm" />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="h-11 w-11 border-2 border-neo-border bg-neo-border/20" />
                      <div className="h-14 w-14 border-3 border-neo-border bg-neo-accent/50" />
                      <div className="h-11 w-11 border-2 border-neo-border bg-neo-border/20" />
                    </div>
                  </div>

                  {/* Waveform skeleton */}
                  <div className="border-2 border-neo-border bg-neo-surface shadow-[6px_6px_0px_0px_var(--neo-shadow)] p-4">
                    <div className="h-14 flex items-end justify-center gap-[2px]">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-neo-border/30 rounded-sm"
                          style={{
                            height: `${20 + Math.sin(i * 0.3) * 15 + Math.random() * 20}%`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="h-3 w-10 bg-neo-border/30 rounded-sm" />
                      <div className="h-8 w-32 border-2 border-neo-border bg-neo-border/20" />
                      <div className="h-3 w-20 bg-neo-border/30 rounded-sm" />
                    </div>
                  </div>

                  {/* Track list skeleton */}
                  <div className="border-2 border-neo-border bg-neo-surface shadow-[6px_6px_0px_0px_var(--neo-shadow)] overflow-hidden">
                    <div className="px-4 py-3 border-b-2 border-neo-border bg-neo-text text-neo-text-inverse flex items-center justify-between">
                      <div className="h-3 w-16 bg-white/30 rounded-sm" />
                      <div className="h-3 w-6 bg-white/20 rounded-sm" />
                    </div>
                    <div className="max-h-56 bg-neo-bg p-2 space-y-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 border-2 border-neo-border/50"
                        >
                          <div className="h-4 w-6 bg-neo-border/30 rounded-sm" />
                          <div className="h-4 flex-1 bg-neo-border/30 rounded-sm" />
                          <div className="h-4 w-10 bg-neo-border/20 rounded-sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 md:p-6 space-y-5">
                  {/* Track line */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 border-2 border-neo-border bg-neo-surface shadow-[4px_4px_0px_0px_var(--neo-shadow)] overflow-hidden flex-shrink-0">
                      {artworkUrl ? (
                        <Image
                          src={artworkUrl}
                          alt=""
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          draggable={false}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-neo-text text-neo-text-inverse">
                          <SoundCloudIcon className="w-7 h-7" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-accent">
                        {statusLabel}
                      </div>
                      <div className="font-black uppercase tracking-tight text-neo-text truncate">
                        {track?.title || tPlayer("status.noTrack")}
                      </div>
                      <div className="font-mono text-xs text-neo-text/60 truncate">
                        {track?.artist || tPlayer("status.soundcloud")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => actions.previous()}
                        disabled={controlsDisabled}
                        aria-label={tPlayer("controls.previous")}
                        className={cn(
                          "h-11 w-11 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                          "hover:-translate-y-0.5 transition-transform",
                          "disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        )}
                      >
                        <SkipBack className="w-5 h-5 mx-auto" />
                      </button>

                      <button
                        type="button"
                        onClick={() => actions.toggle()}
                        aria-label={
                          isPlaying ? tPlayer("controls.pause") : tPlayer("controls.play")
                        }
                        className={cn(
                          "h-14 w-14 border-3 border-neo-border bg-neo-accent text-neo-text-inverse",
                          "shadow-[5px_5px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                        )}
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 mx-auto" />
                        ) : (
                          <Play className="w-7 h-7 mx-auto translate-x-[1px]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => actions.next()}
                        disabled={controlsDisabled}
                        aria-label={tPlayer("controls.next")}
                        className={cn(
                          "h-11 w-11 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                          "hover:-translate-y-0.5 transition-transform",
                          "disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        )}
                      >
                        <SkipForward className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>

                  {/* Waveform */}
                  <div className="border-2 border-neo-border bg-neo-surface shadow-[6px_6px_0px_0px_var(--neo-shadow)] p-4">
                    <SoundCloudWaveform
                      samples={samples}
                      progress={progress}
                      disabled={controlsDisabled || durationMs <= 0}
                      onSeek={(ratio) => actions.seekToRatio(ratio)}
                      className={cn(isWaveformLoading && "opacity-80")}
                      height={56}
                    />
                    <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-neo-text/70">
                      <span>{formatTime(positionMs)}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 border-2 border-neo-border bg-neo-bg shadow-[3px_3px_0px_0px_var(--neo-shadow)] px-2 h-8">
                          <button
                            type="button"
                            onClick={() => actions.setVolume(volume === 0 ? lastNonZeroVolume : 0)}
                            aria-label={
                              volume === 0 ? tPlayer("controls.unmute") : tPlayer("controls.mute")
                            }
                            className="h-6 w-6 flex items-center justify-center text-neo-text hover:-translate-y-0.5 transition-transform"
                          >
                            {volume === 0 ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={volume}
                            onChange={(e) => actions.setVolume(Number(e.target.value))}
                            aria-label={tPlayer("controls.volume")}
                            className="hidden md:block w-28 accent-neo-accent"
                          />
                        </div>
                      </div>
                      <span>
                        -{formatTime(remainingMs)} / {formatTime(durationMs)}
                      </span>
                    </div>

                    {isPlayerUnavailable && (
                      <div className="mt-3 font-mono text-xs text-neo-text/70">
                        {tPlayer("status.errorHint")}
                      </div>
                    )}
                  </div>

                  {/* Track list */}
                  <div className="border-2 border-neo-border bg-neo-surface shadow-[6px_6px_0px_0px_var(--neo-shadow)] overflow-hidden">
                    <div className="px-4 py-3 border-b-2 border-neo-border bg-neo-text text-neo-text-inverse flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                        {tPlayer("tracklist.title")}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
                        {queue.length}
                      </span>
                    </div>
                    <SoundCloudTrackList
                      tracks={queue}
                      currentTrackId={track?.id ?? null}
                      currentIndex={currentIndex}
                      isPlaying={isPlaying}
                      isLoading={mediaAllowed && status === "loading"}
                      disabled={isPlayerUnavailable}
                      onSelect={(index) => actions.selectTrack(index)}
                      className="max-h-56 bg-neo-bg"
                    />
                  </div>
                </div>
              )}
            </ConsentGate>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default NeoSplitHero;
