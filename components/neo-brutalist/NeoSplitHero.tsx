"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
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
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.2 },
  },
};

const stampVariants = {
  hidden: { opacity: 0, rotate: 10, scale: 1.2 },
  visible: {
    opacity: 1,
    rotate: -3,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.5,
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
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

  const statusLabel = useMemo(() => {
    if (!mediaAllowed) return tPlayer("status.mediaDisabled");
    if (isPlayerUnavailable) return tPlayer("status.unavailable");
    if (status === "loading") return tPlayer("status.loading");
    return isPlaying ? tPlayer("status.playing") : tPlayer("status.paused");
  }, [isPlayerUnavailable, isPlaying, mediaAllowed, status, tPlayer]);

  return (
    <motion.section
      className="container mx-auto px-4 md:px-6 mb-16 min-h-[calc(100vh-8rem)] flex flex-col lg:grid lg:grid-cols-[60fr_40fr] gap-8 lg:gap-12 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Panel - Text Content */}
      <motion.div
        className="flex flex-col justify-center w-full pt-8 md:pt-0"
        variants={leftPanelVariants}
      >
        <div className="font-mono text-xs font-bold text-neo-accent flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-neo-accent animate-pulse" />
          {t("basedIn")}
        </div>

        <h1 className="text-[9vw] sm:text-[10vw] lg:text-[7vw] xl:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase break-words mb-6 text-neo-text max-w-full">
          {t("title.line1")} <br />
          <motion.span
            variants={stampVariants}
            className="inline-block relative px-3 md:px-4 py-1 md:py-2 bg-neo-accent text-neo-text-inverse border-4 border-neo-text shadow-[8px_8px_0px_0px_var(--neo-text)] my-2 whitespace-nowrap origin-center text-center"
            style={{
              fontStretch: "condensed",
              letterSpacing: "-0.03em",
            }}
          >
            {t("title.line2")}
          </motion.span>{" "}
          <br />
          <span className={`inline-block whitespace-nowrap${isFrench ? " mt-1 sm:mt-0" : ""}`}>
            {t("title.line3")}
          </span>
        </h1>

        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-sm md:text-base font-medium border-l-4 border-neo-accent pl-4 md:pl-6 bg-neo-surface p-4 shadow-[4px_4px_0px_0px_var(--neo-shadow)] text-neo-text">
            {t("tagline")}
          </p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Persistent SoundCloud Player */}
      <motion.div
        className="w-full lg:sticky lg:top-24 lg:w-[520px] lg:max-w-[520px] lg:justify-self-end"
        variants={rightPanelVariants}
      >
        <div className="relative">
          <div className="absolute -top-2 -left-2 w-full h-full border-4 border-neo-border bg-neo-bg -z-10" />

          <div className="border-4 border-neo-border bg-neo-surface shadow-[12px_12px_0px_0px_var(--neo-accent)] overflow-hidden w-full">
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

            <ConsentGate
              category="media"
              variant="plain"
              className="bg-neo-bg"
              minHeight={360}
              onAccept={() => actions.play()}
            >
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
                      aria-label={isPlaying ? tPlayer("controls.pause") : tPlayer("controls.play")}
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
            </ConsentGate>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default NeoSplitHero;
