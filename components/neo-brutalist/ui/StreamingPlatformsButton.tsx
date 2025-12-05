"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface StreamingPlatformsButtonProps {
  fanlinkUrl: string;
  className?: string;
}

// SVG Icons for streaming platforms
const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const AppleMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.06 1.667.06h11.03a12.5 12.5 0 001.57-.1c.822-.07 1.61-.252 2.33-.63 1.13-.594 1.91-1.482 2.36-2.673.195-.522.307-1.063.384-1.613.07-.512.106-1.026.12-1.541V6.125zM17.4 15.64c0 .256-.015.505-.068.75-.114.527-.41.884-.912 1.033-.178.053-.364.068-.552.06-.4-.016-.768-.138-1.13-.276a7.8 7.8 0 01-1.64-.892c-.054-.036-.11-.07-.194-.125v1.457c0 .397-.012.794-.066 1.188-.067.493-.223.945-.576 1.303-.276.28-.604.454-.98.536-.253.055-.51.072-.768.067a3.39 3.39 0 01-1.202-.26 2.33 2.33 0 01-1.34-1.345c-.13-.34-.172-.7-.172-1.06 0-.404.053-.8.196-1.18.252-.67.693-1.144 1.35-1.412.466-.19.958-.24 1.458-.232.24.004.477.028.714.063.075.01.15.025.238.04V9.08c0-.13.013-.258.03-.386a.772.772 0 01.574-.667c.162-.048.332-.056.5-.05.234.008.43.097.59.267.133.14.2.31.223.5.016.13.02.26.02.39v3.263c0 .09.01.18.014.27v1.973z"/>
  </svg>
);

const DeezerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.81 4.16v3.03H24V4.16h-5.19zM6.27 8.38v3.027h5.189V8.38h-5.19zm12.54 0v3.027H24V8.38h-5.19zM0 12.59v3.027h5.19v-3.03H0zm6.27 0v3.027h5.189v-3.03h-5.19zm6.27 0v3.027h5.19v-3.03h-5.19zm6.27 0v3.027H24v-3.03h-5.19zM0 16.81v3.015h5.19v-3.02H0zm6.27 0v3.015h5.189v-3.02h-5.19zm6.27 0v3.015h5.19v-3.02h-5.19zm6.27 0v3.015H24v-3.02h-5.19z"/>
  </svg>
);

const YoutubeMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
);

const AmazonMusicIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705a.66.66 0 01-.753.077c-1.058-.878-1.247-1.287-1.826-2.126-1.746 1.781-2.983 2.315-5.246 2.315-2.68 0-4.768-1.655-4.768-4.963 0-2.583 1.4-4.339 3.39-5.201 1.725-.756 4.134-.891 5.978-1.099v-.41c0-.754.057-1.644-.384-2.295-.384-.575-1.121-.813-1.771-.813-1.203 0-2.275.617-2.536 1.895-.054.285-.261.567-.549.58l-3.062-.329c-.259-.055-.546-.266-.473-.661C5.9.673 9.341-.006 12.468-.006c1.591 0 3.676.424 4.931 1.629 1.591 1.48 1.44 3.456 1.44 5.608v5.078c0 1.528.635 2.199 1.232 3.021.212.294.258.645-.01.865-.665.553-1.848 1.586-2.5 2.162l-.417-.163z"/>
  </svg>
);

const platforms = [
  { name: 'Spotify', icon: SpotifyIcon, color: '#1DB954' },
  { name: 'Apple Music', icon: AppleMusicIcon, color: '#FA243C' },
  { name: 'Deezer', icon: DeezerIcon, color: '#FEAA2D' },
  { name: 'YouTube Music', icon: YoutubeMusicIcon, color: '#FF0000' },
  { name: 'Amazon', icon: AmazonMusicIcon, color: '#FF9900' },
];

const iconVariants = {
  initial: { y: 0 },
  hover: { y: -4 },
};

const containerVariants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const StreamingPlatformsButton: React.FC<StreamingPlatformsButtonProps> = ({
  fanlinkUrl,
  className,
}) => {
  const t = useTranslations('albums.detail');

  return (
    <motion.a
      href={fanlinkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative block w-full',
        className
      )}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="relative bg-neo-accent border-4 border-neo-border p-6
          shadow-[6px_6px_0px_0px_var(--neo-shadow)]
          transition-shadow duration-300
          group-hover:shadow-[10px_10px_0px_0px_var(--neo-shadow)]"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main content */}
        <div className="flex flex-col items-center gap-4">
          {/* Platform icons */}
          <motion.div
            className="flex items-center gap-3"
            variants={containerVariants}
          >
            {platforms.map((platform) => (
              <motion.div
                key={platform.name}
                className="w-10 h-10 bg-neo-text rounded-sm flex items-center justify-center
                  transition-colors duration-200"
                style={{
                  '--platform-color': platform.color
                } as React.CSSProperties}
                variants={iconVariants}
                whileHover={{
                  backgroundColor: platform.color,
                  scale: 1.1,
                }}
                title={platform.name}
              >
                <span className="text-neo-accent group-hover:text-white transition-colors">
                  <platform.icon />
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <span className="font-black text-lg md:text-xl uppercase tracking-tight text-neo-text-inverse">
              {t('listenOnPlatforms')}
            </span>
          </div>

          {/* External link indicator */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-neo-text-inverse/70">
            <ExternalLink className="w-4 h-4" />
            <span>Fanlink</span>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neo-text-inverse/30" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neo-text-inverse/30" />
      </motion.div>
    </motion.a>
  );
};

export default StreamingPlatformsButton;
