"use client";

import { useState, useEffect, useCallback } from "react";

export type PlayerType = "soundcloud" | "spotify" | "appleMusic" | "deezer" | "youtube";

const STORAGE_KEY = "loic-player-pref";
const DEFAULT_PLAYER: PlayerType = "soundcloud";
const VALID_PLAYERS: PlayerType[] = ["soundcloud", "spotify", "appleMusic", "deezer", "youtube"];

interface UsePlayerPreference {
  player: PlayerType;
  setPlayer: (player: PlayerType) => void;
  isLoaded: boolean;
}

const isValidPlayer = (value: string | null): value is PlayerType => {
  return !!value && VALID_PLAYERS.includes(value as PlayerType);
};

export function usePlayerPreference(): UsePlayerPreference {
  const [player, setPlayerState] = useState<PlayerType>(DEFAULT_PLAYER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isValidPlayer(saved)) {
        setPlayerState(saved);
      }
    } catch {
      // localStorage not available (SSR or privacy mode)
    }
    setIsLoaded(true);
  }, []);

  // Save preference to localStorage
  const setPlayer = useCallback((newPlayer: PlayerType) => {
    setPlayerState(newPlayer);
    try {
      localStorage.setItem(STORAGE_KEY, newPlayer);
    } catch {
      // localStorage not available
    }
  }, []);

  return { player, setPlayer, isLoaded };
}
