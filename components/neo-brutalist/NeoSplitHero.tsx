"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { usePlayerPreference, type PlayerType } from "@/lib/hooks/usePlayerPreference";
import { ConsentGate } from "./legal/ConsentGate";

// SoundCloud icon component
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.19-1.332c-.01-.057-.044-.094-.09-.094m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.12.12.074 0 .12-.06.12-.12l.24-2.458-.24-2.563c0-.06-.061-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.24-2.544-.24-2.64c-.015-.075-.06-.135-.135-.135m1.065.42c-.09 0-.15.075-.165.165l-.195 2.22.195 2.52c.015.09.075.165.165.165s.165-.075.18-.165l.21-2.52-.21-2.22c-.015-.09-.09-.165-.18-.165m.99-.345c-.105 0-.18.075-.18.18l-.18 2.535.18 2.535c0 .105.075.18.18.18.104 0 .18-.075.195-.18l.195-2.535-.195-2.535c-.015-.105-.09-.18-.195-.18m1.155-.675c-.12 0-.195.09-.21.195l-.165 3.195.165 2.505c.015.12.09.21.21.21.119 0 .21-.09.21-.21l.18-2.505-.18-3.195c0-.105-.09-.195-.21-.195m.93-.135c-.12 0-.21.09-.225.21l-.15 3.315.15 2.49c.015.12.105.21.225.21.12 0 .21-.09.225-.21l.165-2.49-.165-3.315c-.015-.12-.105-.21-.225-.21m1.005-.165c-.135 0-.24.105-.24.24l-.15 3.465.15 2.475c0 .135.105.24.24.24.135 0 .24-.105.255-.24l.165-2.475-.165-3.465c-.015-.135-.12-.24-.255-.24m1.08.135c-.15 0-.255.105-.27.24l-.135 3.33.15 2.46c.015.15.12.255.27.255.15 0 .27-.105.27-.255l.165-2.46-.165-3.33c0-.135-.12-.24-.27-.24m1.02-.36c-.165 0-.285.12-.285.285l-.12 3.705.12 2.43c0 .164.12.284.285.284.164 0 .284-.12.3-.284l.135-2.43-.135-3.705c-.016-.165-.136-.285-.3-.285m1.095.405c-.164 0-.299.12-.299.3l-.12 3.3.12 2.415c0 .18.135.3.3.3.164 0 .299-.12.314-.3l.135-2.415-.135-3.3c-.015-.18-.15-.3-.315-.3m1.125-.81c-.18 0-.314.135-.33.315l-.104 4.11.12 2.385c.014.18.149.315.329.315.18 0 .315-.135.33-.315l.135-2.385-.135-4.11c-.015-.18-.15-.315-.345-.315m1.185.495c-.195 0-.345.15-.345.345l-.105 3.63.12 2.37c0 .195.15.345.345.345.194 0 .344-.15.359-.345l.135-2.37-.135-3.63c-.015-.195-.165-.345-.374-.345m1.065-.195c-.195 0-.36.165-.36.36l-.09 3.825.105 2.34c0 .21.165.36.36.36.195 0 .36-.15.375-.36l.12-2.34-.12-3.825c-.015-.195-.18-.36-.39-.36m2.22 1.47c-.27 0-.48.21-.495.48l-.075 1.875.09 2.31c.015.27.225.48.495.48.27 0 .48-.21.495-.48l.105-2.31-.105-1.875c-.015-.27-.225-.48-.51-.48m1.095-.03c-.285 0-.51.225-.525.51l-.06 1.92.075 2.28c.015.285.24.51.525.51.284 0 .51-.225.525-.51l.09-2.28-.09-1.92c-.015-.285-.24-.51-.54-.51m1.095-.03c-.3 0-.54.24-.54.54l-.06 1.95.075 2.265c.015.3.24.54.54.54.3 0 .54-.24.555-.54l.09-2.265-.09-1.95c-.015-.3-.255-.54-.57-.54m1.11.015c-.315 0-.57.255-.57.57l-.045 1.95.06 2.25c.016.315.256.57.57.57.316 0 .57-.255.586-.57l.075-2.25-.075-1.95c-.015-.315-.27-.57-.6-.57m1.095.105c-.33 0-.585.255-.585.585l-.045 1.86.06 2.22c.015.33.255.585.585.585.33 0 .585-.255.6-.585l.075-2.22-.075-1.86c-.015-.33-.27-.585-.615-.585m1.11.06c-.345 0-.615.27-.615.615v1.8l.06 2.19c.015.345.27.615.615.615.344 0 .614-.27.63-.615l.06-2.19-.06-1.8c-.016-.345-.286-.615-.69-.615m2.94.54c-.135-.015-.27-.045-.405-.045-.405 0-.795.09-1.14.27-.18.09-.285.255-.285.465l-.015.015v6.12c0 .195.135.39.33.435.045.015 5.085.015 5.1.015 1.245 0 2.25-1.005 2.25-2.25 0-1.245-1.005-2.25-2.25-2.25-.345 0-.675.075-.975.225-.24-1.215-1.305-2.13-2.595-2.13" />
  </svg>
);

// Spotify icon component
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const DeezerIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2 16h4v2H2v-2zm5-3h4v5H7v-5zm5-3h4v8h-4V10zm5-3h4v11h-4V7z" />
  </svg>
);

const AppleMusicIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.3 2.4c-.9.06-1.93.63-2.56 1.41-.56.7-.99 1.83-.82 2.88 1.04.08 2.1-.53 2.77-1.34.66-.8 1.07-1.93.61-2.95Zm1.89 6.05c-1.52-.09-2.8.84-3.52.84-.73 0-1.84-.8-3.02-.78-1.55.02-2.99.9-3.79 2.28-1.63 2.83-.42 7 1.16 9.3.77 1.11 1.68 2.36 2.88 2.31 1.13-.05 1.56-.75 2.93-.75 1.36 0 1.75.75 2.94.73 1.22-.02 1.99-1.12 2.74-2.24.86-1.27 1.21-2.5 1.23-2.57-.03-.01-2.37-.91-2.4-3.61-.02-2.25 1.84-3.33 1.93-3.39-.05-.15-1.86-2.7-4.08-2.12Z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.6 7.2c-.2-.8-.8-1.5-1.6-1.7C18.4 5.2 12 5.2 12 5.2s-6.4 0-8 .3c-.8.2-1.4.9-1.6 1.7-.4 1.6-.4 4.8-.4 4.8s0 3.2.4 4.8c.2.8.8 1.5 1.6 1.6 1.6.4 8 .4 8 .4s6.4 0 8-.4c.8-.1 1.4-.8 1.6-1.6.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM9.75 14.7v-5l4.5 2.5-4.5 2.5Z" />
  </svg>
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const leftPanelVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const rightPanelVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const, delay: 0.2 },
  },
};

const stampVariants = {
  hidden: { opacity: 0, rotate: 10, scale: 1.2 },
  visible: {
    opacity: 1,
    rotate: -3,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.5,
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

const playerVariants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

type PlayerConfig = {
  id: PlayerType;
  label: string;
  icon: React.ReactNode;
  embedUrl: string;
  allow?: string;
  height?: number;
  referrerPolicy?: React.IframeHTMLAttributes<HTMLIFrameElement>["referrerPolicy"];
};

// Player Tab Button component
interface PlayerTabProps {
  player: PlayerType;
  activePlayer: PlayerType;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const PlayerTab: React.FC<PlayerTabProps> = ({ player, activePlayer, onClick, icon, label }) => {
  const isActive = player === activePlayer;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95, y: 2 }}
      whileHover={{ y: -2 }}
      className={`
        flex flex-1 items-center justify-center
        px-3 py-3
        border-neo-border transition-all duration-200
        ${
          isActive
            ? "bg-neo-accent text-neo-text-inverse shadow-[inset_4px_4px_0px_rgba(0,0,0,0.2)]"
            : "bg-neo-surface text-neo-text hover:bg-neo-surface-hover"
        }
      `}
      role="tab"
      aria-selected={isActive}
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </motion.button>
  );
};

export const NeoSplitHero: React.FC = () => {
  const t = useTranslations("home.splitHero");
  const locale = useLocale();
  const { player, setPlayer, isLoaded } = usePlayerPreference();
  const isFrench = locale === "fr";

  // Player configuration per platform
  const playersConfig: PlayerConfig[] = [
    {
      id: "soundcloud",
      label: t("player.soundcloud"),
      icon: <SoundCloudIcon className="w-6 h-6" />,
      embedUrl:
        "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1342377886%3Fsecret_token%3Ds-0WB6x1mRFeB&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
      allow: "autoplay",
      height: 560,
    },
    {
      id: "spotify",
      label: t("player.spotify"),
      icon: <SpotifyIcon className="w-6 h-6" />,
      embedUrl:
        "https://open.spotify.com/embed/artist/3PPQlrmOzl6QUBSP3gcyLA?utm_source=generator&theme=0",
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
      height: 560,
    },
    {
      id: "appleMusic",
      label: t("player.appleMusic"),
      icon: <AppleMusicIcon className="w-6 h-6" />,
      embedUrl:
        "https://embed.music.apple.com/fr/artist/loic-ghanem/464997920/see-all?section=top-songs",
      allow: "autoplay *; encrypted-media *; fullscreen *; clipboard-write",
      height: 560,
      referrerPolicy: "origin",
    },
    {
      id: "deezer",
      label: t("player.deezer"),
      icon: <DeezerIcon className="w-6 h-6" />,
      embedUrl: "https://widget.deezer.com/widget/dark/artist/5642263/top_tracks",
      allow: "autoplay; clipboard-write; encrypted-media; fullscreen",
      height: 560,
    },
    {
      id: "youtube",
      label: t("player.youtube"),
      icon: <YoutubeIcon className="w-6 h-6" />,
      embedUrl: "https://www.youtube.com/embed/qVTMst6UAlA?list=UULbxfVx61feUL3uw2me9tSA&start=52",
      allow:
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      height: 560,
      referrerPolicy: "strict-origin-when-cross-origin",
    },
  ];

  const activePlayerConfig = playersConfig.find(({ id }) => id === player) ?? playersConfig[0];

  return (
    <motion.section
      className="container mx-auto px-4 md:px-6 mb-16 min-h-[calc(100vh-8rem)] flex flex-col lg:grid lg:grid-cols-[60fr_40fr] gap-8 lg:gap-12 items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left Panel - Text Content */}
      <motion.div
        className="flex flex-col justify-center w-full pt-8 md:pt-0"
        variants={leftPanelVariants}
      >
        {/* Decorative label */}
        <div className="font-mono text-xs font-bold text-neo-accent flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-neo-accent animate-pulse" />
          {t("basedIn")}
        </div>

        {/* Massive Title */}
        <h1 className="text-[9vw] sm:text-[10vw] lg:text-[7vw] xl:text-[6vw] leading-[0.9] font-black tracking-tighter uppercase break-words mb-6 text-neo-text max-w-full">
          {t("title.line1")} <br />
          {/* Stamp Effect */}
          <motion.span
            variants={stampVariants}
            className="inline-block relative px-3 md:px-4 py-1 md:py-2 bg-neo-accent text-neo-text-inverse border-4 border-neo-text shadow-[8px_8px_0px_0px_var(--neo-text)] my-2 whitespace-nowrap origin-center text-center"
            style={{
              fontStretch: "condensed",
              letterSpacing: "-0.03em",
            }}
          >
            {t("title.line2")}
          </motion.span>{" "}
          <br />
          <span className={`inline-block whitespace-nowrap${isFrench ? " mt-1 sm:mt-0" : ""}`}>
            {t("title.line3")}
          </span>
        </h1>

        {/* Tagline */}
        <motion.div
          className="max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-sm md:text-base font-medium border-l-4 border-neo-accent pl-4 md:pl-6 bg-neo-surface p-4 shadow-[4px_4px_0px_0px_var(--neo-shadow)] text-neo-text">
            {t("tagline")}
          </p>
        </motion.div>
      </motion.div>

      {/* Right Panel - Player */}
      <motion.div className="w-full lg:sticky lg:top-24" variants={rightPanelVariants}>
        {/* Player Container - Neo-Brutalist style */}
        <div className="relative">
          {/* Decorative offset layer */}
          <div className="absolute -top-2 -left-2 w-full h-full border-4 border-neo-border bg-neo-bg -z-10" />

          {/* Main container */}
          <div className="border-4 border-neo-border bg-neo-surface shadow-[12px_12px_0px_0px_var(--neo-accent)] overflow-hidden min-w-[300px]">
            {/* Player Switch Tabs */}
            <div
              className="grid grid-cols-3 sm:grid-cols-5 border-b-4 border-neo-border"
              role="tablist"
            >
              {playersConfig.map((playerConfig) => (
                <PlayerTab
                  key={playerConfig.id}
                  player={playerConfig.id}
                  activePlayer={player}
                  onClick={() => setPlayer(playerConfig.id)}
                  icon={playerConfig.icon}
                  label={playerConfig.label}
                />
              ))}
            </div>

            {/* Player Content */}
            <ConsentGate
              category="media"
              variant="plain"
              className="bg-neo-bg"
              minHeight={activePlayerConfig.height ?? 560}
            >
              <div
                className="bg-neo-bg"
                role="tabpanel"
                style={{ minHeight: activePlayerConfig.height ?? 560 }}
              >
                <AnimatePresence mode="wait">
                  {isLoaded && (
                    <motion.div
                      key={activePlayerConfig.id}
                      variants={playerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <iframe
                        src={activePlayerConfig.embedUrl}
                        width="100%"
                        height={activePlayerConfig.height ?? 560}
                        frameBorder="0"
                        allow={
                          activePlayerConfig.allow ??
                          "autoplay; encrypted-media; fullscreen; picture-in-picture"
                        }
                        loading="lazy"
                        className="w-full bg-neo-bg"
                        title={`${activePlayerConfig.label} Player`}
                        allowFullScreen
                        referrerPolicy={activePlayerConfig.referrerPolicy}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading state */}
                {!isLoaded && (
                  <div
                    className="flex items-center justify-center"
                    style={{ height: activePlayerConfig.height ?? 560 }}
                  >
                    <div className="w-8 h-8 border-4 border-neo-accent border-t-transparent animate-spin" />
                  </div>
                )}
              </div>
            </ConsentGate>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default NeoSplitHero;
