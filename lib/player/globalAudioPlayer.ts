"use client";

import { useMemo, useSyncExternalStore } from "react";

export const SOUND_CLOUD_PLAYLIST_EMBED_URL =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1342377886%3Fsecret_token%3Ds-0WB6x1mRFeB&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false";

export const SOUND_CLOUD_PROFILE_URL = "https://soundcloud.com/loic-ghanem";

export type GlobalAudioPlayerStatus = "idle" | "loading" | "ready" | "error";

export type GlobalAudioTrack = {
  id: number;
  title: string;
  artist?: string;
  artworkUrl?: string | null;
  waveformUrl?: string | null;
  permalinkUrl?: string | null;
};

export type GlobalAudioPlayerState = {
  status: GlobalAudioPlayerStatus;
  mediaAllowed: boolean;
  hasStarted: boolean;
  isDismissed: boolean;
  isPlaying: boolean;
  track: GlobalAudioTrack | null;
  positionMs: number;
  durationMs: number;
  volume: number;
  error: string | null;
};

const VOLUME_STORAGE_KEY = "loic-player-volume-v1";

const DEFAULT_STATE: GlobalAudioPlayerState = {
  status: "idle",
  mediaAllowed: false,
  hasStarted: false,
  isDismissed: false,
  isPlaying: false,
  track: null,
  positionMs: 0,
  durationMs: 0,
  volume: 80,
  error: null,
};

let state: GlobalAudioPlayerState = DEFAULT_STATE;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setState = (
  partial:
    | Partial<GlobalAudioPlayerState>
    | ((prev: GlobalAudioPlayerState) => Partial<GlobalAudioPlayerState>)
) => {
  const patch = typeof partial === "function" ? partial(state) : partial;
  state = { ...state, ...patch };
  emit();
};

export const getGlobalAudioPlayerState = () => state;

export const subscribeGlobalAudioPlayer = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

type PendingActionType = "play" | "toggle";
type PendingAction = { type: PendingActionType; requestedAt: number } | null;

const PENDING_ACTION_TTL_MS = 15000;
let pendingAction: PendingAction = null;

let widget: SoundCloudWidget | null = null;

let hasHydratedVolume = false;

const clampVolume = (value: number) => {
  if (!Number.isFinite(value)) return DEFAULT_STATE.volume;
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const hydrateGlobalAudioPlayerVolume = () => {
  if (hasHydratedVolume) return;
  hasHydratedVolume = true;
  try {
    const raw = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (!raw) return;
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) return;
    setState({ volume: clampVolume(parsed) });
  } catch {
    // localStorage not available
  }
};

export const setGlobalAudioPlayerMediaAllowed = (mediaAllowed: boolean) => {
  setState(() => ({
    mediaAllowed,
    ...(mediaAllowed ? null : { status: "idle", isPlaying: false, positionMs: 0 }),
    ...(mediaAllowed ? null : { error: null }),
  }));
};

export const setGlobalAudioPlayerStatus = (status: GlobalAudioPlayerStatus) => {
  setState({ status });
};

export const setGlobalAudioPlayerError = (error: string | null) => {
  setState({
    error,
    ...(error ? { status: "error" } : null),
  });
};

export const setGlobalAudioPlayerTrack = (track: GlobalAudioTrack | null) => {
  setState((prev) => {
    if (!track) {
      return { track: null, positionMs: 0, durationMs: 0 };
    }
    const isNewTrack = prev.track?.id !== track.id;
    return {
      track,
      ...(isNewTrack ? { positionMs: 0, durationMs: 0 } : null),
    };
  });
};

export const setGlobalAudioPlayerProgress = (positionMs: number, durationMs?: number) => {
  setState({
    positionMs,
    ...(typeof durationMs === "number" && durationMs > 0 ? { durationMs } : null),
  });
};

export const setGlobalAudioPlayerPlaying = (isPlaying: boolean) => {
  setState({ isPlaying, hasStarted: state.hasStarted || isPlaying });
};

export const markGlobalAudioPlayerStarted = () => {
  setState({ hasStarted: true, isDismissed: false });
};

export const setGlobalAudioPlayerWidget = (nextWidget: SoundCloudWidget | null) => {
  widget = nextWidget;
};

export const setGlobalAudioPlayerDismissed = (isDismissed: boolean) => {
  setState({ isDismissed, ...(isDismissed ? null : { hasStarted: true }) });
};

export const setGlobalAudioPlayerVolume = (volume: number) => {
  const clamped = clampVolume(volume);
  setState({ volume: clamped });
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
  } catch {
    // localStorage not available
  }
  if (!widget || !state.mediaAllowed) return;
  try {
    widget.setVolume(clamped);
  } catch {
    // noop
  }
};

export const queueGlobalAudioPlayerAction = (type: PendingActionType) => {
  pendingAction = { type, requestedAt: Date.now() };
  markGlobalAudioPlayerStarted();
};

export const tryConsumePendingGlobalAudioPlayerAction = () => {
  if (!widget) return false;
  if (!pendingAction) return false;
  const isFresh = Date.now() - pendingAction.requestedAt <= PENDING_ACTION_TTL_MS;
  const action = pendingAction;
  pendingAction = null;
  if (!isFresh) return false;

  if (action.type === "play") {
    widget.play();
    return true;
  }
  if (action.type === "toggle") {
    widget.toggle();
    return true;
  }
  return false;
};

const canControlWidget = () => !!widget && state.status === "ready" && state.mediaAllowed;

export const globalAudioPlayerActions = {
  play: () => {
    queueGlobalAudioPlayerAction("play");
    if (!canControlWidget()) return;
    widget?.play();
  },
  pause: () => {
    if (!canControlWidget()) return;
    widget?.pause();
  },
  setVolume: (volume: number) => {
    setGlobalAudioPlayerVolume(volume);
  },
  toggle: () => {
    queueGlobalAudioPlayerAction("toggle");
    if (!canControlWidget()) return;
    widget?.toggle();
  },
  next: () => {
    markGlobalAudioPlayerStarted();
    if (!canControlWidget()) return;
    widget?.next();
  },
  previous: () => {
    markGlobalAudioPlayerStarted();
    if (!canControlWidget()) return;
    widget?.prev();
  },
  open: () => {
    setGlobalAudioPlayerDismissed(false);
  },
  dismiss: () => {
    setGlobalAudioPlayerDismissed(true);
    setGlobalAudioPlayerPlaying(false);
    try {
      widget?.pause();
    } catch {
      // noop
    }
  },
  seekTo: (milliseconds: number) => {
    markGlobalAudioPlayerStarted();
    if (!canControlWidget()) return;
    const clamped = Math.max(0, Math.floor(milliseconds));
    widget?.seekTo(clamped);
    setGlobalAudioPlayerProgress(clamped);
  },
  seekToRatio: (ratio: number) => {
    if (!state.durationMs) return;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    globalAudioPlayerActions.seekTo(Math.floor(state.durationMs * clampedRatio));
  },
};

export const useGlobalAudioPlayer = () => {
  const snapshot = useSyncExternalStore(
    subscribeGlobalAudioPlayer,
    getGlobalAudioPlayerState,
    getGlobalAudioPlayerState
  );

  return useMemo(
    () => ({
      ...snapshot,
      actions: globalAudioPlayerActions,
    }),
    [snapshot]
  );
};
