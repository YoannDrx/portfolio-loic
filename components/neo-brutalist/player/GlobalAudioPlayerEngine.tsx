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
  setGlobalAudioPlayerStatus,
  setGlobalAudioPlayerTrack,
  setGlobalAudioPlayerWidget,
  tryConsumePendingGlobalAudioPlayerAction,
} from "@/lib/player/globalAudioPlayer";

const READY_TIMEOUT_MS = 12000;
const PROGRESS_THROTTLE_MS = 200;

const mapSound = (sound: SoundCloudSound | null | undefined) => {
  if (!sound?.id || !sound.title) return null;
  return {
    id: sound.id,
    title: sound.title,
    artist: sound.user?.username,
    artworkUrl: sound.artwork_url ?? null,
    waveformUrl: sound.waveform_url ?? null,
    permalinkUrl: sound.permalink_url ?? null,
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

    widget.bind(events.READY, () => {
      clearReadyTimeout();
      setGlobalAudioPlayerStatus("ready");
      setGlobalAudioPlayerError(null);
      try {
        widget.setVolume(getGlobalAudioPlayerState().volume);
      } catch {
        // noop
      }
      refreshSound();
      tryConsumePendingGlobalAudioPlayerAction();
    });

    widget.bind(events.PLAY, () => {
      setGlobalAudioPlayerPlaying(true);
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
    };
  }, [canInitWidget]);

  if (!mediaAllowed) return null;

  return (
    <>
      <Script
        src="https://w.soundcloud.com/player/api.js"
        strategy="afterInteractive"
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
