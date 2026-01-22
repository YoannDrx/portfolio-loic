"use client";

import { useMemo, useSyncExternalStore } from "react";

export const SOUND_CLOUD_PROFILE_URL = "https://soundcloud.com/loic-ghanem";
export const SOUND_CLOUD_TRACKS_URL = `${SOUND_CLOUD_PROFILE_URL}/tracks`;

// Embed the full public catalogue (tracks page) instead of a limited playlist.
export const SOUND_CLOUD_PLAYLIST_EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
  SOUND_CLOUD_TRACKS_URL
)}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;

export type GlobalAudioPlayerStatus = "idle" | "loading" | "ready" | "error";

export type GlobalAudioTrack = {
  id: number;
  title: string;
  artist?: string;
  artworkUrl?: string | null;
  waveformUrl?: string | null;
  permalinkUrl?: string | null;
  durationMs?: number;
  widgetIndex?: number;
};

export type GlobalAudioPlayerState = {
  status: GlobalAudioPlayerStatus;
  mediaAllowed: boolean;
  hasStarted: boolean;
  isDismissed: boolean;
  isPlaying: boolean;
  track: GlobalAudioTrack | null;
  queue: GlobalAudioTrack[];
  currentIndex: number | null;
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
  queue: [],
  currentIndex: null,
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
type PendingAction =
  | { type: PendingActionType; requestedAt: number }
  | { type: "select"; requestedAt: number; widgetIndex: number }
  | null;

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

export const setGlobalAudioPlayerQueue = (queue: GlobalAudioTrack[]) => {
  setState({ queue });
};

let hasFetchedFullQueue = false;
let isFetchingQueue = false;

type ApiTrack = {
  id: number;
  title: string;
  artist?: string;
  artworkUrl?: string | null;
  waveformUrl?: string | null;
  permalinkUrl?: string | null;
  durationMs?: number;
  widgetIndex?: number;
};

export const fetchFullSoundCloudQueue = async (): Promise<boolean> => {
  if (hasFetchedFullQueue || isFetchingQueue) return hasFetchedFullQueue;

  isFetchingQueue = true;
  try {
    const res = await fetch("/api/soundcloud/tracks");
    if (!res.ok) {
      isFetchingQueue = false;
      return false;
    }

    const data = await res.json();
    if (!data.tracks || !Array.isArray(data.tracks)) {
      isFetchingQueue = false;
      return false;
    }

    const currentState = getGlobalAudioPlayerState();
    const widgetQueue = currentState.queue;

    // Build a map of track ID to widget index for quick lookup
    const widgetIndexMap = new Map<number, number>();
    widgetQueue.forEach((wt) => {
      if (typeof wt.widgetIndex === "number") {
        widgetIndexMap.set(wt.id, wt.widgetIndex);
      }
    });

    // Map API tracks and find widget indices by matching track IDs
    const mappedTracks: GlobalAudioTrack[] = (data.tracks as ApiTrack[]).map((track) => {
      const widgetIndex = widgetIndexMap.get(track.id);
      return {
        id: track.id,
        title: track.title,
        artist: track.artist,
        artworkUrl: track.artworkUrl,
        waveformUrl: track.waveformUrl,
        permalinkUrl: track.permalinkUrl,
        durationMs: track.durationMs,
        // Only set widgetIndex if track is in widget's range (first 20)
        widgetIndex: widgetIndex !== undefined ? widgetIndex : undefined,
      };
    });

    setGlobalAudioPlayerQueue(mappedTracks);

    // Update current index if we have a current track
    const currentId = currentState.track?.id;
    if (typeof currentId === "number") {
      const idx = mappedTracks.findIndex((t) => t.id === currentId);
      if (idx >= 0) setGlobalAudioPlayerCurrentIndex(idx);
    } else if (mappedTracks.length > 0) {
      // No track selected yet, set the first track as the current one
      setGlobalAudioPlayerTrack(mappedTracks[0]);
      setGlobalAudioPlayerCurrentIndex(0);
    }

    hasFetchedFullQueue = true;
    isFetchingQueue = false;
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch SoundCloud tracks:", error);
    isFetchingQueue = false;
    return false;
  }
};

export const resetFullQueueFetchState = () => {
  hasFetchedFullQueue = false;
  isFetchingQueue = false;
};

export const setGlobalAudioPlayerCurrentIndex = (currentIndex: number | null) => {
  setState({ currentIndex });
};

export const setGlobalAudioPlayerProgress = (positionMs: number, durationMs?: number) => {
  setState({
    positionMs,
    ...(typeof durationMs === "number" && durationMs > 0 ? { durationMs } : null),
  });
};

export const setGlobalAudioPlayerPlaying = (isPlaying: boolean) => {
  setState({ isPlaying });
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
};

export const queueGlobalAudioPlayerSelectTrack = (widgetIndex: number) => {
  pendingAction = {
    type: "select",
    widgetIndex: Math.max(0, Math.floor(widgetIndex)),
    requestedAt: Date.now(),
  };
};

export const tryConsumePendingGlobalAudioPlayerAction = () => {
  if (!widget) return false;
  if (!pendingAction) return false;
  const isFresh = Date.now() - pendingAction.requestedAt <= PENDING_ACTION_TTL_MS;
  const action = pendingAction;
  pendingAction = null;
  if (!isFresh) return false;

  if (action.type === "select") {
    try {
      widget.skip(action.widgetIndex);
      widget.play();
      return true;
    } catch {
      return false;
    }
  }

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

const resolveCurrentIndex = () => {
  if (typeof state.currentIndex === "number") return state.currentIndex;
  const currentId = state.track?.id;
  if (typeof currentId !== "number") return null;
  const idx = state.queue.findIndex((t) => t.id === currentId);
  return idx >= 0 ? idx : null;
};

export const globalAudioPlayerActions = {
  play: () => {
    markGlobalAudioPlayerStarted();
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
    markGlobalAudioPlayerStarted();
    queueGlobalAudioPlayerAction("toggle");
    if (!canControlWidget()) return;
    widget?.toggle();
  },
  next: () => {
    const { queue } = state;
    const idx = resolveCurrentIndex();
    if (queue.length && typeof idx === "number") {
      globalAudioPlayerActions.selectTrack((idx + 1) % queue.length);
      return;
    }
    if (!canControlWidget()) return;
    widget?.next();
  },
  previous: () => {
    const { queue } = state;
    const idx = resolveCurrentIndex();
    if (queue.length && typeof idx === "number") {
      globalAudioPlayerActions.selectTrack((idx - 1 + queue.length) % queue.length);
      return;
    }
    if (!canControlWidget()) return;
    widget?.prev();
  },
  selectTrack: (index: number) => {
    markGlobalAudioPlayerStarted();
    const safeIndex = Math.max(0, Math.floor(index));
    const boundedIndex =
      state.queue.length > 0 ? Math.min(safeIndex, state.queue.length - 1) : safeIndex;
    setGlobalAudioPlayerCurrentIndex(boundedIndex);
    const nextTrack = state.queue[boundedIndex];
    if (nextTrack) setGlobalAudioPlayerTrack(nextTrack);
    setGlobalAudioPlayerProgress(0);

    const widgetIndex = nextTrack?.widgetIndex;
    const isInWidgetRange = typeof widgetIndex === "number" && widgetIndex >= 0 && widgetIndex < 20;

    if (!canControlWidget()) {
      // Queue action for when widget becomes ready
      if (isInWidgetRange && typeof widgetIndex === "number") {
        queueGlobalAudioPlayerSelectTrack(widgetIndex);
      }
      return;
    }

    try {
      if (isInWidgetRange && typeof widgetIndex === "number") {
        // Track is in widget's loaded range, use skip
        widget?.skip(widgetIndex);
        widget?.play();
      } else if (nextTrack?.permalinkUrl) {
        // Track is beyond widget range, load it directly
        widget?.load(nextTrack.permalinkUrl, { auto_play: true });
      }
    } catch {
      // noop
    }
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
