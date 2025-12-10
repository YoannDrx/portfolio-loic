"use client";

import React from "react";
import { Music, Youtube, Radio } from "lucide-react";
import { ConsentGate } from "../legal/ConsentGate";

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
  title,
}) => {
  // Priorité Spotify, fallback YouTube
  if (spotifyEmbed) {
    const spotifyId = extractSpotifyId(spotifyEmbed);
    if (spotifyId) {
      return (
        <ConsentGate category="media">
          <div className="space-y-4">
            {/* Platform header */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-neo-border">
              <div className="w-14 h-14 bg-[#1DB954] flex items-center justify-center border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
                <Music className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-neo-text/50 block">
                  Streaming via
                </span>
                <span className="font-black text-xl uppercase tracking-tight text-neo-text">
                  Spotify
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1DB954]/10 border border-[#1DB954]/30">
                <Radio className="w-4 h-4 text-[#1DB954]" />
                <span className="font-mono text-xs text-[#1DB954]">Live</span>
              </div>
            </div>

            {/* Player iframe */}
            <div className="rounded-none overflow-hidden border-2 border-neo-border">
              <iframe
                src={`https://open.spotify.com/embed/album/${spotifyId}?utm_source=generator&theme=0`}
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify - ${title}`}
                className="bg-neo-text block"
              />
            </div>

            {/* Album title */}
            <div className="text-center">
              <p className="font-mono text-sm text-neo-text/60">{title}</p>
            </div>
          </div>
        </ConsentGate>
      );
    }
  }

  if (youtubeEmbed) {
    const youtubeId = extractYoutubeId(youtubeEmbed);
    if (youtubeId) {
      return (
        <ConsentGate category="media">
          <div className="space-y-4">
            {/* Platform header */}
            <div className="flex items-center gap-4 pb-4 border-b-2 border-neo-border">
              <div className="w-14 h-14 bg-[#FF0000] flex items-center justify-center border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
                <Youtube className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-neo-text/50 block">
                  Streaming via
                </span>
                <span className="font-black text-xl uppercase tracking-tight text-neo-text">
                  YouTube
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#FF0000]/10 border border-[#FF0000]/30">
                <Radio className="w-4 h-4 text-[#FF0000]" />
                <span className="font-mono text-xs text-[#FF0000]">Video</span>
              </div>
            </div>

            {/* Player iframe */}
            <div className="aspect-video rounded-none overflow-hidden border-2 border-neo-border">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                title={`YouTube - ${title}`}
                className="block"
              />
            </div>

            {/* Album title */}
            <div className="text-center">
              <p className="font-mono text-sm text-neo-text/60">{title}</p>
            </div>
          </div>
        </ConsentGate>
      );
    }
  }

  // Aucun player disponible
  return null;
};

export default NeoAlbumPlayer;
