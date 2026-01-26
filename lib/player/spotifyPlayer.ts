"use client";

import { useMemo, useSyncExternalStore } from "react";

export type SpotifyAlbum = {
  id: string;
  title: string;
  img: string | null;
  spotifyId: string;
};

export type SpotifyPlayerState = {
  isOpen: boolean;
  isMinimized: boolean;
  album: SpotifyAlbum | null;
};

const DEFAULT_STATE: SpotifyPlayerState = {
  isOpen: false,
  isMinimized: false,
  album: null,
};

let state: SpotifyPlayerState = DEFAULT_STATE;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setState = (
  partial: Partial<SpotifyPlayerState> | ((prev: SpotifyPlayerState) => Partial<SpotifyPlayerState>)
) => {
  const patch = typeof partial === "function" ? partial(state) : partial;
  state = { ...state, ...patch };
  emit();
};

export const getSpotifyPlayerState = () => state;

export const subscribeSpotifyPlayer = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Extraire l'ID Spotify depuis différents formats d'URL
const extractSpotifyId = (url: string): string | null => {
  // Format embed: https://open.spotify.com/embed/album/xxx
  const embedMatch = url.match(/embed\/album\/([a-zA-Z0-9]+)/);
  if (embedMatch) return embedMatch[1];

  // Format standard: https://open.spotify.com/album/xxx ou intl-fr/album/xxx
  const standardMatch = url.match(/album\/([a-zA-Z0-9]+)/);
  if (standardMatch) return standardMatch[1];

  // Si c'est déjà juste l'ID
  if (/^[a-zA-Z0-9]{22}$/.test(url)) return url;

  return null;
};

// Callback pour pause le SoundCloud player (sera défini par le layout)
let onSpotifyOpenCallback: (() => void) | null = null;

export const setOnSpotifyOpenCallback = (callback: () => void) => {
  onSpotifyOpenCallback = callback;
};

export const spotifyPlayerActions = {
  open: (album: { id: string; title: string; img: string | null; spotifyEmbed: string }) => {
    const spotifyId = extractSpotifyId(album.spotifyEmbed);
    if (!spotifyId) return;

    // Pause SoundCloud avant de lancer Spotify
    onSpotifyOpenCallback?.();

    setState({
      isOpen: true,
      isMinimized: false,
      album: {
        id: album.id,
        title: album.title,
        img: album.img,
        spotifyId,
      },
    });
  },

  close: () => {
    setState({
      isOpen: false,
      isMinimized: false,
      album: null,
    });
  },

  minimize: () => {
    setState({ isMinimized: true });
  },

  expand: () => {
    setState({ isMinimized: false });
  },

  toggle: () => {
    setState((prev) => ({ isMinimized: !prev.isMinimized }));
  },
};

export const useSpotifyPlayer = () => {
  const snapshot = useSyncExternalStore(
    subscribeSpotifyPlayer,
    getSpotifyPlayerState,
    getSpotifyPlayerState
  );

  return useMemo(
    () => ({
      ...snapshot,
      actions: spotifyPlayerActions,
    }),
    [snapshot]
  );
};
