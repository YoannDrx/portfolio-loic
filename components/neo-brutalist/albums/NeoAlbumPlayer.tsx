"use client";

import React from 'react';
import { Music, Youtube } from 'lucide-react';
import { NeoCard } from '../ui/NeoCard';

interface NeoAlbumPlayerProps {
  spotifyEmbed?: string | null;
  youtubeEmbed?: string | null;
  title: string;
}

// Extraire l'ID Spotify depuis différents formats d'URL
const extractSpotifyId = (url: string): string | null => {
  // Format embed: https://open.spotify.com/embed/album/xxx
  // Format standard: https://open.spotify.com/album/xxx
  const embedMatch = url.match(/embed\/album\/([a-zA-Z0-9]+)/);
  if (embedMatch) return embedMatch[1];

  const standardMatch = url.match(/album\/([a-zA-Z0-9]+)/);
  if (standardMatch) return standardMatch[1];

  // Si c'est déjà juste l'ID
  if (/^[a-zA-Z0-9]{22}$/.test(url)) return url;

  return null;
};

// Extraire l'ID YouTube depuis différents formats d'URL
const extractYoutubeId = (url: string): string | null => {
  // Format embed: https://www.youtube.com/embed/xxx
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];

  // Format standard: https://www.youtube.com/watch?v=xxx
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  // Format court: https://youtu.be/xxx
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // Si c'est déjà juste l'ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
};

export const NeoAlbumPlayer: React.FC<NeoAlbumPlayerProps> = ({
  spotifyEmbed,
  youtubeEmbed,
  title
}) => {
  // Priorité Spotify, fallback YouTube
  if (spotifyEmbed) {
    const spotifyId = extractSpotifyId(spotifyEmbed);
    if (spotifyId) {
      return (
        <NeoCard hover="none" padding="none" className="overflow-hidden">
          <div className="bg-neo-surface p-4 border-b-2 border-neo-border flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1DB954] flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase text-neo-text/60">
                Spotify
              </span>
              <p className="font-bold text-neo-text text-sm truncate">
                {title}
              </p>
            </div>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/album/${spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={`Spotify - ${title}`}
            className="bg-neo-text"
          />
        </NeoCard>
      );
    }
  }

  if (youtubeEmbed) {
    const youtubeId = extractYoutubeId(youtubeEmbed);
    if (youtubeId) {
      return (
        <NeoCard hover="none" padding="none" className="overflow-hidden">
          <div className="bg-neo-surface p-4 border-b-2 border-neo-border flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold uppercase text-neo-text/60">
                YouTube
              </span>
              <p className="font-bold text-neo-text text-sm truncate">
                {title}
              </p>
            </div>
          </div>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              title={`YouTube - ${title}`}
            />
          </div>
        </NeoCard>
      );
    }
  }

  // Aucun player disponible
  return null;
};

export default NeoAlbumPlayer;
