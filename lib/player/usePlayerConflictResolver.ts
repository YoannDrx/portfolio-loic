"use client";

import { useEffect } from "react";
import { globalAudioPlayerActions } from "./globalAudioPlayer";
import {
  setOnSpotifyOpenCallback,
  spotifyPlayerActions,
  getSpotifyPlayerState,
} from "./spotifyPlayer";

/**
 * Hook qui gère les conflits entre les players SoundCloud et Spotify.
 * Quand un player commence à jouer, l'autre est mis en pause.
 */
export const usePlayerConflictResolver = () => {
  useEffect(() => {
    // Quand Spotify s'ouvre, pause SoundCloud
    setOnSpotifyOpenCallback(() => {
      globalAudioPlayerActions.pause();
    });

    return () => {
      setOnSpotifyOpenCallback(() => {});
    };
  }, []);
};

/**
 * Fonction pour fermer le Spotify player quand SoundCloud commence à jouer.
 * À appeler depuis les composants qui contrôlent le SoundCloud player.
 */
export const closeSpotifyOnSoundCloudPlay = () => {
  const spotifyState = getSpotifyPlayerState();
  if (spotifyState.isOpen) {
    spotifyPlayerActions.close();
  }
};
