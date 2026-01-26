"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Music, X } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useSpotifyPlayer } from "@/lib/player/spotifyPlayer";
import { cn } from "@/lib/utils";

export const SpotifyPlayerBar = () => {
  const { isOpen, isMinimized, album, actions } = useSpotifyPlayer();

  if (!isOpen || !album) return null;

  const bottomOffsetPx = 12;
  const spotifyEmbedUrl = `https://open.spotify.com/embed/album/${album.spotifyId}?utm_source=generator&theme=0&autoplay=1`;

  return (
    <>
      {/* Spacer pour éviter que le contenu soit caché */}
      <div
        aria-hidden="true"
        style={{
          height: `calc(${isMinimized ? 80 : 160}px + ${bottomOffsetPx}px + env(safe-area-inset-bottom))`,
        }}
      />

      <AnimatePresence>
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
          className="fixed inset-x-0 z-50 px-3 md:px-6"
          style={{ bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom))` }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Shadow layer */}
              <div className="absolute -top-2 -left-2 w-full h-full border-4 border-neo-border bg-[#1DB954] -z-10" />

              <div className="border-4 border-neo-border bg-neo-surface shadow-[10px_10px_0px_0px_#1DB954] overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-neo-surface">
                  {/* Album artwork */}
                  <div className="h-12 w-12 md:h-14 md:w-14 border-2 border-neo-border bg-neo-surface shadow-[3px_3px_0px_0px_var(--neo-shadow)] overflow-hidden flex-shrink-0">
                    {album.img ? (
                      <Image
                        src={album.img}
                        alt={album.title}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-[#1DB954] text-white">
                        <Music className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Track info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#1DB954] rounded-full flex items-center justify-center flex-shrink-0">
                        <Music className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1DB954]">
                        Spotify
                      </span>
                    </div>
                    <div className="font-black uppercase tracking-tight text-neo-text line-clamp-1 text-sm md:text-base">
                      {album.title}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Link to album detail */}
                    <Link
                      href={{ pathname: "/albums/[id]", params: { id: album.id } }}
                      className={cn(
                        "hidden sm:flex h-10 items-center gap-2 px-3 border-2 border-neo-border",
                        "bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)] hover:-translate-y-0.5 transition-transform"
                      )}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                        Détails
                      </span>
                    </Link>

                    {/* Expand/Collapse */}
                    <button
                      type="button"
                      onClick={() => actions.toggle()}
                      aria-label={isMinimized ? "Agrandir" : "Réduire"}
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 border-2 border-neo-border bg-neo-bg text-neo-text shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                        "hover:-translate-y-0.5 transition-transform"
                      )}
                    >
                      {isMinimized ? (
                        <ChevronUp className="w-5 h-5 mx-auto" />
                      ) : (
                        <ChevronDown className="w-5 h-5 mx-auto" />
                      )}
                    </button>

                    {/* Close */}
                    <button
                      type="button"
                      onClick={() => actions.close()}
                      aria-label="Fermer"
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 border-2 border-neo-border bg-neo-text text-neo-text-inverse shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
                        "hover:-translate-y-0.5 transition-transform"
                      )}
                    >
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>

                {/* Spotify embed - collapsible */}
                <AnimatePresence initial={false}>
                  {!isMinimized && (
                    <motion.div
                      key="spotify-embed"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="border-t-2 border-neo-border overflow-hidden"
                    >
                      <iframe
                        key={album.spotifyId}
                        src={spotifyEmbedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        title={`Spotify - ${album.title}`}
                        className="bg-neo-text block"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default SpotifyPlayerBar;
