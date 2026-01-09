"use client";

import React from "react";
import Image from "next/image";

interface FilmImage {
  src: string;
  alt: string;
}

interface FilmBannerProps {
  images?: FilmImage[];
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

export const FilmBanner: React.FC<FilmBannerProps> = ({
  images = filmCollages,
  speed = 30,
  pauseOnHover = true,
}) => {
  const renderImages = (keyPrefix: string, showAlt: boolean = true) =>
    images.map((img, idx) => (
      <div
        key={`${keyPrefix}-${idx}`}
        className="h-[180px] md:h-[280px] lg:h-[350px] flex-shrink-0"
      >
        <Image
          src={img.src}
          alt={showAlt ? img.alt : ""}
          width={900}
          height={350}
          className="h-full w-auto object-cover"
          priority={idx < 2 && showAlt}
        />
      </div>
    ));

  return (
    <section className="overflow-hidden bg-neo-bg border-y-4 border-neo-border">
      <div className={pauseOnHover ? "group" : ""}>
        <div className="flex">
          {/* First set */}
          <div
            className={`flex animate-marquee ${
              pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
            }`}
            style={{
              animationDuration: `${speed}s`,
              animationDirection: "reverse",
            }}
          >
            {renderImages("first", true)}
          </div>
          {/* Duplicate for seamless loop */}
          <div
            className={`flex animate-marquee ${
              pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
            }`}
            aria-hidden="true"
            style={{
              animationDuration: `${speed}s`,
              animationDirection: "reverse",
            }}
          >
            {renderImages("dup", false)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilmBanner;
