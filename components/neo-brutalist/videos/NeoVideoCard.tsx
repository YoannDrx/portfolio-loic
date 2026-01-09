"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Play, X, ExternalLink, Maximize2 } from "lucide-react";
import { NeoCard } from "../ui/NeoCard";
import { NeoTag } from "../ui/NeoTag";
import { useConsent } from "../legal/ConsentProvider";

interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  type: string;
  date: string;
  img?: string | null;
}

interface NeoVideoCardProps {
  video: VideoItem;
}

export const NeoVideoCard: React.FC<NeoVideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const t = useTranslations("videos");
  const tConsent = useTranslations("consent");
  const { state, setCategory, openManager } = useConsent();
  const allowMedia = state.media;

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const thumbnailUrl = video.img || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <NeoCard
      hover="lift"
      padding="md"
      className="hover:border-neo-accent transition-colors duration-300 h-full flex flex-col"
    >
      {/* Container Video/Thumbnail */}
      <div className="aspect-video bg-neo-text relative overflow-hidden mb-6 border-2 border-neo-border">
        {isPlaying && allowMedia ? (
          // Iframe YouTube
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title={video.title}
          />
        ) : (
          // Thumbnail avec bouton play
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />
            <button
              onClick={() => {
                if (!allowMedia) {
                  setCategory("media", true);
                }
                setIsPlaying(true);
              }}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label={t("card.play", { title: video.title })}
            >
              <div className="w-20 h-20 border-4 border-neo-text-inverse rounded-full flex items-center justify-center bg-neo-text/50 group-hover:bg-neo-accent group-hover:border-neo-accent transition-all duration-300">
                <Play
                  size={32}
                  fill="currentColor"
                  className="ml-1 text-neo-text-inverse group-hover:text-neo-text-inverse"
                />
              </div>
            </button>
            {!allowMedia && (
              <div className="absolute inset-0 bg-neo-text/70 text-neo-text-inverse flex flex-col items-center justify-center gap-3 p-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                  {tConsent("gate.mediaTitle")}
                </p>
                <p className="text-xs md:text-sm text-neo-text-inverse/80 max-w-xs leading-relaxed">
                  {tConsent("gate.mediaDescriptionShort")}
                </p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => {
                      setCategory("media", true);
                      setIsPlaying(true);
                    }}
                    className="px-4 py-2 bg-neo-accent text-neo-text font-mono text-[10px] uppercase font-bold border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                  >
                    {tConsent("gate.mediaCta")}
                  </button>
                  <button
                    onClick={openManager}
                    className="px-4 py-2 bg-neo-text text-neo-text-inverse font-mono text-[10px] uppercase font-bold border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                  >
                    {tConsent("gate.manage")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        {isPlaying && (
          <>
            <button
              onClick={() => setIsPlaying(false)}
              className="px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent transition-colors flex items-center gap-1.5"
            >
              <X size={14} />
              {t("card.close")}
            </button>
            <button
              onClick={handleFullscreen}
              className="px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent transition-colors flex items-center gap-1.5"
            >
              <Maximize2 size={14} />
              {t("card.fullscreen")}
            </button>
          </>
        )}
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text-inverse hover:border-neo-accent transition-colors flex items-center gap-1.5"
        >
          <ExternalLink size={14} />
          YouTube
        </a>
      </div>

      {/* Info */}
      <div className="flex justify-between items-start gap-4 flex-grow">
        <div className="min-w-0">
          <NeoTag variant="default" size="sm" className="mb-2 inline-block">
            {video.type}
          </NeoTag>
          <h3 className="text-lg md:text-xl font-black uppercase leading-tight text-neo-text line-clamp-2">
            {video.title}
          </h3>
        </div>
        {video.date && (
          <span className="font-mono text-xs text-neo-text/50 border-2 border-neo-border px-2 py-1 flex-shrink-0">
            {video.date.split("/")[2]}
          </span>
        )}
      </div>
    </NeoCard>
  );
};

export default NeoVideoCard;
