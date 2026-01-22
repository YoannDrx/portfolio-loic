"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useConsent } from "../legal/ConsentProvider";
import {
  SOUND_CLOUD_PLAYLIST_EMBED_URL,
  getGlobalAudioPlayerState,
  hydrateGlobalAudioPlayerVolume,
  setGlobalAudioPlayerError,
  setGlobalAudioPlayerMediaAllowed,
  setGlobalAudioPlayerPlaying,
  setGlobalAudioPlayerProgress,
  setGlobalAudioPlayerQueue,
  setGlobalAudioPlayerStatus,
  setGlobalAudioPlayerCurrentIndex,
  setGlobalAudioPlayerTrack,
  setGlobalAudioPlayerWidget,
  tryConsumePendingGlobalAudioPlayerAction,
  fetchFullSoundCloudQueue,
  resetFullQueueFetchState,
} from "@/lib/player/globalAudioPlayer";

const READY_TIMEOUT_MS = 12000;
const PROGRESS_THROTTLE_MS = 200;

const parseSoundCloudDateMs = (value: string | null | undefined) => {
  if (!value) return null;

  const direct = Date.parse(value);
  if (Number.isFinite(direct)) return direct;

  const match = value.match(
    /^(\d{4})[/-](\d{2})[/-](\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?(?:\s*(Z|[+-]\d{4}))?$/
  );
  if (!match) return null;

  const [, year, month, day, timeRaw, tzRaw] = match;
  const time = timeRaw ?? "00:00:00";
  const tz =
    tzRaw === "Z"
      ? "Z"
      : typeof tzRaw === "string" && /^[+-]\d{4}$/.test(tzRaw)
        ? `${tzRaw.slice(0, 3)}:${tzRaw.slice(3)}`
        : "Z";

  const iso = `${year}-${month}-${day}T${time}${tz}`;
  const normalized = Date.parse(iso);
  return Number.isFinite(normalized) ? normalized : null;
};

const getSoundSortDateMs = (sound: SoundCloudSound) => {
  return (
    parseSoundCloudDateMs(sound.release_date) ??
    parseSoundCloudDateMs(sound.display_date) ??
    parseSoundCloudDateMs(sound.created_at) ??
    parseSoundCloudDateMs(sound.last_modified) ??
    null
  );
};

const mapSound = (sound: SoundCloudSound | null | undefined) => {
  if (!sound?.id || !sound.title) return null;
  return {
    id: sound.id,
    title: sound.title,
    artist: sound.user?.username,
    artworkUrl: sound.artwork_url ?? null,
    waveformUrl: sound.waveform_url ?? null,
    permalinkUrl: sound.permalink_url ?? null,
    durationMs: typeof sound.duration === "number" ? sound.duration : undefined,
  };
};

export const GlobalAudioPlayerEngine = () => {
  const { state: consentState } = useConsent();
  const mediaAllowed = consentState.media;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const soundIdRef = useRef<number | null>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgressCommitRef = useRef(0);
  const durationRef = useRef(0);

  const [scriptStatus, setScriptStatus] = useState<"idle" | "loaded" | "error">("idle");

  useEffect(() => {
    hydrateGlobalAudioPlayerVolume();
  }, []);

  // Fetch tracks from API as soon as media is allowed (don't wait for widget)
  useEffect(() => {
    if (!mediaAllowed) return;
    // Fetch tracks immediately when consent is given
    fetchFullSoundCloudQueue().catch(() => {
      // Silently fail - widget will provide fallback queue
    });
  }, [mediaAllowed]);

  useEffect(() => {
    if (!mediaAllowed) return;
    if (scriptStatus !== "idle") return;
    if (window.SC?.Widget) setScriptStatus("loaded");
  }, [mediaAllowed, scriptStatus]);

  useEffect(() => {
    setGlobalAudioPlayerMediaAllowed(mediaAllowed);

    if (!mediaAllowed) {
      try {
        widgetRef.current?.pause();
      } catch {
        // noop
      }
      widgetRef.current = null;
      setGlobalAudioPlayerWidget(null);
      setGlobalAudioPlayerStatus("idle");
      setGlobalAudioPlayerPlaying(false);
      setGlobalAudioPlayerError(null);
      resetFullQueueFetchState();
      durationRef.current = 0;
      soundIdRef.current = null;
      setScriptStatus("idle");
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
  }, [mediaAllowed]);

  const canInitWidget = useMemo(() => {
    return mediaAllowed && scriptStatus === "loaded" && !!iframeRef.current && !widgetRef.current;
  }, [mediaAllowed, scriptStatus]);

  useEffect(() => {
    if (!canInitWidget) return;
    const iframeEl = iframeRef.current;
    if (!iframeEl) return;

    const scWidgetFactory = window.SC?.Widget;
    if (!scWidgetFactory) {
      setGlobalAudioPlayerStatus("error");
      setGlobalAudioPlayerError("SoundCloud API unavailable");
      return;
    }
    const events = scWidgetFactory.Events;
    if (!events) {
      setGlobalAudioPlayerStatus("error");
      setGlobalAudioPlayerError("SoundCloud events unavailable");
      return;
    }

    const widget = scWidgetFactory(iframeEl);
    widgetRef.current = widget;
    setGlobalAudioPlayerWidget(widget);
    setGlobalAudioPlayerStatus("loading");
    setGlobalAudioPlayerError(null);

    const clearReadyTimeout = () => {
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    };

    readyTimeoutRef.current = setTimeout(() => {
      setGlobalAudioPlayerStatus("error");
      setGlobalAudioPlayerError("SoundCloud player timed out");
    }, READY_TIMEOUT_MS);

    const refreshSound = () => {
      try {
        widget.getCurrentSound((sound: SoundCloudSound) => {
          const track = mapSound(sound);
          if (track) {
            setGlobalAudioPlayerTrack(track);
            const { queue, currentIndex } = getGlobalAudioPlayerState();
            if (queue.length) {
              const idx = queue.findIndex((t) => t.id === track.id);
              if (idx >= 0 && idx !== currentIndex) setGlobalAudioPlayerCurrentIndex(idx);
            }
            if (soundIdRef.current !== track.id) {
              soundIdRef.current = track.id;
              setGlobalAudioPlayerProgress(0);
            }
          }
          const duration = typeof sound?.duration === "number" ? sound.duration : 0;
          if (duration > 0) durationRef.current = duration;
          try {
            widget.getPosition((pos: number) => {
              setGlobalAudioPlayerProgress(pos, durationRef.current || undefined);
            });
          } catch {
            setGlobalAudioPlayerProgress(0, durationRef.current || undefined);
          }
        });
      } catch {
        // noop
      }
    };

    const refreshQueue = () => {
      try {
        widget.getSounds((sounds: SoundCloudSound[]) => {
          if (!Array.isArray(sounds) || sounds.length === 0) return;
          const queue = sounds
            .map((sound, widgetIndex) => {
              const track = mapSound(sound);
              if (!track) return null;
              return {
                track,
                widgetIndex,
                sortMs: getSoundSortDateMs(sound) ?? 0,
              };
            })
            .filter((item): item is NonNullable<typeof item> => !!item)
            .sort((a, b) => {
              const dateDiff = b.sortMs - a.sortMs;
              if (dateDiff) return dateDiff;
              return b.track.id - a.track.id;
            })
            .map(({ track, widgetIndex }) => ({ ...track, widgetIndex }));
          setGlobalAudioPlayerQueue(queue);
          const currentId = getGlobalAudioPlayerState().track?.id;
          if (typeof currentId === "number") {
            const idx = queue.findIndex((t) => t.id === currentId);
            if (idx >= 0) setGlobalAudioPlayerCurrentIndex(idx);
          } else if (queue.length > 0) {
            // No track selected yet, set the first track from the queue
            setGlobalAudioPlayerTrack(queue[0]);
            setGlobalAudioPlayerCurrentIndex(0);
          } else {
            try {
              widget.getCurrentSoundIndex((idx: number) => {
                if (!Number.isFinite(idx)) return;
                const safeWidgetIndex = Math.max(0, Math.floor(idx));
                const queueIndex = queue.findIndex((t) => t.widgetIndex === safeWidgetIndex);
                if (queueIndex >= 0) setGlobalAudioPlayerCurrentIndex(queueIndex);
              });
            } catch {
              // noop
            }
          }
        });
      } catch {
        // noop
      }
    };

    widget.bind(events.READY, () => {
      clearReadyTimeout();
      setGlobalAudioPlayerStatus("ready");
      setGlobalAudioPlayerError(null);
      try {
        widget.setVolume(getGlobalAudioPlayerState().volume);
      } catch {
        // noop
      }

      // Skip to first track to force loading metadata (without playing)
      try {
        widget.skip(0);
      } catch {
        // noop
      }

      refreshQueue();
      refreshSound();
      tryConsumePendingGlobalAudioPlayerAction();

      // Retry loading queue after a delay if it's still empty
      // (widget may need time to load metadata after READY)
      setTimeout(() => {
        const state = getGlobalAudioPlayerState();
        if (state.queue.length === 0 || !state.track) {
          refreshQueue();
          refreshSound();
        }
      }, 1000);

      // Fetch full track list from API (widget only provides first 20)
      fetchFullSoundCloudQueue().catch(() => {
        // Silently fall back to widget queue
      });
    });

    widget.bind(events.PLAY, () => {
      setGlobalAudioPlayerPlaying(true);
      if (getGlobalAudioPlayerState().queue.length === 0) refreshQueue();
      refreshSound();
    });

    widget.bind(events.PAUSE, () => {
      setGlobalAudioPlayerPlaying(false);
    });

    widget.bind(events.FINISH, () => {
      setGlobalAudioPlayerPlaying(false);
      setGlobalAudioPlayerProgress(0, durationRef.current || undefined);
      refreshSound();
    });

    widget.bind(events.PLAY_PROGRESS, (e?: SoundCloudPlayProgressEvent) => {
      if (!e) return;
      const now = Date.now();
      if (now - lastProgressCommitRef.current < PROGRESS_THROTTLE_MS) return;
      lastProgressCommitRef.current = now;

      setGlobalAudioPlayerProgress(e.currentPosition, durationRef.current || undefined);
    });

    widget.bind(events.ERROR, () => {
      clearReadyTimeout();
      setGlobalAudioPlayerStatus("error");
      setGlobalAudioPlayerError("SoundCloud player error");
    });

    return () => {
      clearReadyTimeout();
      try {
        widget.unbind(events.READY);
        widget.unbind(events.PLAY);
        widget.unbind(events.PAUSE);
        widget.unbind(events.FINISH);
        widget.unbind(events.PLAY_PROGRESS);
        widget.unbind(events.ERROR);
        widget.pause();
      } catch {
        // noop
      }
      widgetRef.current = null;
      setGlobalAudioPlayerWidget(null);
      durationRef.current = 0;
      soundIdRef.current = null;
      setGlobalAudioPlayerStatus("idle");
      setGlobalAudioPlayerPlaying(false);
    };
  }, [canInitWidget]);

  if (!mediaAllowed) return null;

  return (
    <>
      <Script
        src="https://w.soundcloud.com/player/api.js"
        strategy="afterInteractive"
        onReady={() => setScriptStatus("loaded")}
        onLoad={() => setScriptStatus("loaded")}
        onError={() => {
          setScriptStatus("error");
          setGlobalAudioPlayerStatus("error");
          setGlobalAudioPlayerError("SoundCloud script blocked");
        }}
      />

      <iframe
        ref={iframeRef}
        src={SOUND_CLOUD_PLAYLIST_EMBED_URL}
        title="SoundCloud Player"
        allow="autoplay"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed -left-[9999px] -top-[9999px] h-1 w-1 opacity-0 pointer-events-none"
      />
    </>
  );
};
