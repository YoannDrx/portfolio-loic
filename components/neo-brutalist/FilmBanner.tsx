"use client";

import React from "react";
import Image from "next/image";

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
  // On triple les images pour assurer une boucle parfaite
  const allImages = [...filmCollages, ...filmCollages, ...filmCollages];

  return (
    <section className="overflow-hidden bg-neo-bg border-y-4 border-neo-border">
      <div className={pauseOnHover ? "group" : ""}>
        {/* Single animated track */}
        <div
          className={`flex w-max ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""}`}
          style={{
            animation: `scroll ${speed}s linear infinite`,
          }}
        >
          {allImages.map((img, idx) => {
            const isFirstSet = idx < filmCollages.length;

            return (
              <div
                key={`film-${idx}`}
                className="relative flex-shrink-0 h-[200px] md:h-[320px] lg:h-[400px]"
              >
                <Image
                  src={img.src}
                  alt={isFirstSet ? img.alt : ""}
                  width={900}
                  height={400}
                  className="h-full w-auto object-cover"
                  priority={idx < 2}
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
            transform: translateX(calc(-100% / 3));
          }
        }
      `}</style>
    </section>
  );
};

export default FilmBanner;
