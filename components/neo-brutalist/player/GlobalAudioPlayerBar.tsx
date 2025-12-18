"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useConsent } from "../legal/ConsentProvider";
import { useSoundCloudWaveform } from "@/lib/hooks/useSoundCloudWaveform";
import { SOUND_CLOUD_PROFILE_URL, useGlobalAudioPlayer } from "@/lib/player/globalAudioPlayer";
import { cn } from "@/lib/utils";
import { SoundCloudIcon } from "./SoundCloudIcon";
import { SoundCloudWaveform } from "./SoundCloudWaveform";
import { formatTime } from "./utils";

const isHomePathname = (pathname: string | null) => {
  const path = pathname ?? "";
  return /^\/(en|fr)$/.test(path);
};

const normalizeArtworkUrl = (url: string | null | undefined, size: "t200x200" | "t500x500") => {
  if (!url) return null;
  return url.replace("-large", `-${size}`);
};

export const GlobalAudioPlayerBar = () => {
  const t = useTranslations("musicPlayer");
  const pathname = usePathname();
  const isHome = isHomePathname(pathname);

  const { openManager } = useConsent();
  const {
    status,
    mediaAllowed,
    hasStarted,
    isPlaying,
    track,
    positionMs,
    durationMs,
    error,
    actions,
  } = useGlobalAudioPlayer();

  const [showOnHome, setShowOnHome] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setShowOnHome(true);
      return;
    }

    let raf = 0;
    const update = () => {
      const threshold = Math.max(240, Math.floor(window.innerHeight * 0.4));
      setShowOnHome(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isHome]);

  const shouldShow = hasStarted && (!isHome || showOnHome);

  const progress = durationMs > 0 ? Math.min(1, positionMs / durationMs) : 0;
  const remainingMs = Math.max(0, durationMs - positionMs);
  const externalUrl = track?.permalinkUrl || SOUND_CLOUD_PROFILE_URL;
  const artworkUrl = normalizeArtworkUrl(track?.artworkUrl ?? null, "t200x200");

  const { samples, isLoading: isWaveformLoading } = useSoundCloudWaveform(
    mediaAllowed ? track?.waveformUrl : null,
    track?.id,
    96
  );

  const displayTitle = track?.title || t("status.noTrack");
  const displayArtist = track?.artist || t("status.soundcloud");

  const isPlayerUnavailable = status === "error" || !!error;
  const controlsDisabled = !mediaAllowed || status !== "ready" || isPlayerUnavailable;

  const statusLabel = useMemo(() => {
    if (!mediaAllowed) return t("status.mediaDisabled");
    if (isPlayerUnavailable) return t("status.unavailable");
    if (status === "loading") return t("status.loading");
    return isPlaying ? t("status.playing") : t("status.paused");
  }, [isPlayerUnavailable, isPlaying, mediaAllowed, status, t]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] px-3 md:px-6"
        >
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-full h-full border-4 border-neo-border bg-neo-bg -z-10" />

              <div className="border-4 border-neo-border bg-neo-surface shadow-[10px_10px_0px_0px_var(--neo-shadow)] overflow-hidden">
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4">
                  {/* Track info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 md:h-12 md:w-12 border-2 border-neo-border bg-neo-surface shadow-[3px_3px_0px_0px_var(--neo-shadow)] overflow-hidden flex-shrink-0">
                      {artworkUrl ? (
                        <Image
                          src={artworkUrl}
                          alt=""
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                          draggable={false}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-neo-text text-neo-text-inverse">
                          <SoundCloudIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-accent">
                        {statusLabel}
                      </div>
                      <div className="font-black uppercase tracking-tight text-neo-text truncate">
                        {displayTitle}
                      </div>
                      <div className="font-mono text-xs text-neo-text/60 truncate">
                        {displayArtist}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => actions.previous()}
                      disabled={controlsDisabled}
                      aria-label={t("controls.previous")}
                      className={cn(
                        "h-10 w-10 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                        "hover:-translate-y-0.5 transition-transform",
                        "disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      )}
                    >
                      <SkipBack className="w-5 h-5 mx-auto" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!mediaAllowed) {
                          openManager();
                          return;
                        }
                        actions.toggle();
                      }}
                      aria-label={isPlaying ? t("controls.pause") : t("controls.play")}
                      className={cn(
                        "h-12 w-12 border-3 border-neo-border bg-neo-accent text-neo-text-inverse",
                        "shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform",
                        !mediaAllowed && "bg-neo-text text-neo-text-inverse"
                      )}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 mx-auto" />
                      ) : (
                        <Play className="w-6 h-6 mx-auto translate-x-[1px]" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => actions.next()}
                      disabled={controlsDisabled}
                      aria-label={t("controls.next")}
                      className={cn(
                        "h-10 w-10 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                        "hover:-translate-y-0.5 transition-transform",
                        "disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                      )}
                    >
                      <SkipForward className="w-5 h-5 mx-auto" />
                    </button>

                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("controls.openOnSoundcloud")}
                      className={cn(
                        "hidden sm:inline-flex h-10 items-center gap-2 px-3 border-2 border-neo-border",
                        "bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:-translate-y-0.5 transition-transform"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                        {t("controls.open")}
                      </span>
                    </a>

                    <a
                      href={externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("controls.openOnSoundcloud")}
                      className={cn(
                        "sm:hidden h-10 w-10 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                        "hover:-translate-y-0.5 transition-transform"
                      )}
                    >
                      <ExternalLink className="w-5 h-5 mx-auto mt-2.5" />
                    </a>
                  </div>
                </div>

                {/* Waveform + timing */}
                <div className="border-t-2 border-neo-border bg-neo-bg px-3 md:px-4 py-3 md:py-4">
                  <SoundCloudWaveform
                    samples={samples}
                    progress={progress}
                    disabled={controlsDisabled || durationMs <= 0}
                    onSeek={(ratio) => actions.seekToRatio(ratio)}
                    className={cn(isWaveformLoading && "opacity-80")}
                    height={38}
                  />
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-neo-text/60">
                    <span>{formatTime(positionMs)}</span>
                    <span className="hidden sm:inline-block">
                      {isWaveformLoading ? t("status.waveformLoading") : t("status.waveformReady")}
                    </span>
                    <span>
                      -{formatTime(remainingMs)} / {formatTime(durationMs)}
                    </span>
                  </div>

                  {isPlayerUnavailable && (
                    <div className="mt-2 font-mono text-xs text-neo-text/70">
                      {t("status.errorHint")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
