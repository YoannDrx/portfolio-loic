"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";

interface FilmImage {
  src: string;
  alt: string;
}

interface FilmBannerProps {
  speed?: number;
  pauseOnHover?: boolean;
}

// Film collages data
const filmCollages: FilmImage[] = [
  {
    src: "/img/films/collage-2022.jpg",
    alt: "Productions 2022 - America, I Want You Back, Magic for Humans, Divorce, Trust Me",
  },
  {
    src: "/img/films/collage-2023.png",
    alt: "Productions 2023 - Skandal, Shaq, Queen of Oz, Mr Inbetween, Evil, Firefly Lane",
  },
  {
    src: "/img/films/collage-2024.png",
    alt: "Productions 2024 - L'Agence, Maternelles, Project Icon, Trafficked, Tattoo Cover",
  },
  {
    src: "/img/films/collage-2025.png",
    alt: "Productions 2025 - Notes of Berlin, Mother Undercover, Mysteries of the Abandoned",
  },
];

export const FilmBanner: React.FC<FilmBannerProps> = ({ speed = 40, pauseOnHover = true }) => {
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations("home.banners");
  const allImages = [...filmCollages, ...filmCollages];

  return (
    <section
      className="relative overflow-hidden bg-neo-bg border-y-4 border-neo-border"
      aria-label={t("productions")}
    >
      <button
        type="button"
        onClick={() => setIsPaused((paused) => !paused)}
        className="absolute top-3 right-3 z-10 p-2 bg-neo-surface text-neo-text border-2 border-neo-border shadow-[3px_3px_0px_0px_var(--neo-shadow)]"
        aria-label={isPaused ? t("resume") : t("pause")}
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>
      <div className={pauseOnHover ? "group" : ""}>
        {/* Single animated track */}
        <div
          className={`flex w-max ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
          style={{
            animation: `scroll ${speed}s linear infinite`,
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {allImages.map((img, idx) => {
            const isFirstSet = idx < filmCollages.length;

            return (
              <div
                key={`film-${idx}`}
                className="relative flex-shrink-0 h-[200px] md:h-[320px] lg:h-[400px] aspect-[9/4]"
              >
                <Image
                  src={img.src}
                  alt={isFirstSet ? img.alt : ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 450px, (max-width: 1024px) 720px, 900px"
                  aria-hidden={!isFirstSet}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Inline keyframes for the animation - va vers la gauche */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default FilmBanner;
