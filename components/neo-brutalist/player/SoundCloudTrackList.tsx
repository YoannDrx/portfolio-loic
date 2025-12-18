"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { GlobalAudioTrack } from "@/lib/player/globalAudioPlayer";
import { formatTime } from "./utils";

type SoundCloudTrackListProps = {
  tracks: GlobalAudioTrack[];
  currentTrackId?: number | null;
  currentIndex?: number | null;
  isPlaying?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onSelect?: (index: number) => void;
  className?: string;
};

const formatTrackNumber = (index: number) => String(index + 1).padStart(2, "0");

export const SoundCloudTrackList: React.FC<SoundCloudTrackListProps> = ({
  tracks,
  currentTrackId,
  currentIndex,
  isPlaying = false,
  isLoading = false,
  disabled = false,
  onSelect,
  className,
}) => {
  const t = useTranslations("musicPlayer");

  const items = useMemo(() => {
    return Array.isArray(tracks) ? tracks : [];
  }, [tracks]);

  if (isLoading && items.length === 0) {
    return (
      <div className={cn("font-mono text-xs text-neo-text/60 px-3 py-3", className)}>
        {t("tracklist.loading")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={cn("font-mono text-xs text-neo-text/60 px-3 py-3", className)}>
        {t("tracklist.empty")}
      </div>
    );
  }

  const clickDisabled = disabled || !onSelect;

  return (
    <div className={cn("max-h-52 overflow-auto px-3 py-3", className)}>
      <ul className="space-y-2">
        {items.map((track, index) => {
          const isActive =
            (typeof currentTrackId === "number" && currentTrackId === track.id) ||
            (typeof currentIndex === "number" && currentIndex === index);

          return (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => onSelect?.(index)}
                disabled={clickDisabled}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "w-full flex items-center gap-3 text-left",
                  "px-3 py-2 border-2 border-neo-border",
                  "bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                  "hover:-translate-y-0.5 transition-transform",
                  isActive &&
                    "bg-neo-accent text-neo-text-inverse shadow-[3px_3px_0px_0px_var(--neo-border)]",
                  clickDisabled &&
                    "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
                )}
              >
                <span
                  className={cn(
                    "w-8 flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.22em]",
                    isActive ? "text-white/80" : "text-neo-text/50"
                  )}
                >
                  {formatTrackNumber(index)}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-black uppercase tracking-tight truncate">
                    {track.title}
                  </span>
                </span>

                {typeof track.durationMs === "number" && track.durationMs > 0 && (
                  <span
                    className={cn(
                      "flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.18em]",
                      isActive ? "text-white/70" : "text-neo-text/50"
                    )}
                  >
                    {formatTime(track.durationMs)}
                  </span>
                )}

                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2.5 w-2.5 border-2 border-neo-border flex-shrink-0",
                    isActive ? "bg-neo-text-inverse" : "bg-neo-accent",
                    isActive && isPlaying && "animate-pulse"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
