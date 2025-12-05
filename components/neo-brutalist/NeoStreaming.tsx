"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Headphones, ExternalLink } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';
import { BrutalistButton } from './ui/BrutalistButton';

// SoundCloud icon component
const SoundCloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.1-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.19-1.332c-.01-.057-.044-.094-.09-.094m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.12.12.074 0 .12-.06.12-.12l.24-2.458-.24-2.563c0-.06-.061-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.24-2.544-.24-2.64c-.015-.075-.06-.135-.135-.135m1.065.42c-.09 0-.15.075-.165.165l-.195 2.22.195 2.52c.015.09.075.165.165.165s.165-.075.18-.165l.21-2.52-.21-2.22c-.015-.09-.09-.165-.18-.165m.99-.345c-.105 0-.18.075-.18.18l-.18 2.535.18 2.535c0 .105.075.18.18.18.104 0 .18-.075.195-.18l.195-2.535-.195-2.535c-.015-.105-.09-.18-.195-.18m1.155-.675c-.12 0-.195.09-.21.195l-.165 3.195.165 2.505c.015.12.09.21.21.21.119 0 .21-.09.21-.21l.18-2.505-.18-3.195c0-.105-.09-.195-.21-.195m.93-.135c-.12 0-.21.09-.225.21l-.15 3.315.15 2.49c.015.12.105.21.225.21.12 0 .21-.09.225-.21l.165-2.49-.165-3.315c-.015-.12-.105-.21-.225-.21m1.005-.165c-.135 0-.24.105-.24.24l-.15 3.465.15 2.475c0 .135.105.24.24.24.135 0 .24-.105.255-.24l.165-2.475-.165-3.465c-.015-.135-.12-.24-.255-.24m1.08.135c-.15 0-.255.105-.27.24l-.135 3.33.15 2.46c.015.15.12.255.27.255.15 0 .27-.105.27-.255l.165-2.46-.165-3.33c0-.135-.12-.24-.27-.24m1.02-.36c-.165 0-.285.12-.285.285l-.12 3.705.12 2.43c0 .164.12.284.285.284.164 0 .284-.12.3-.284l.135-2.43-.135-3.705c-.016-.165-.136-.285-.3-.285m1.095.405c-.164 0-.299.12-.299.3l-.12 3.3.12 2.415c0 .18.135.3.3.3.164 0 .299-.12.314-.3l.135-2.415-.135-3.3c-.015-.18-.15-.3-.315-.3m1.125-.81c-.18 0-.314.135-.33.315l-.104 4.11.12 2.385c.014.18.149.315.329.315.18 0 .315-.135.33-.315l.135-2.385-.135-4.11c-.015-.18-.15-.315-.345-.315m1.185.495c-.195 0-.345.15-.345.345l-.105 3.63.12 2.37c0 .195.15.345.345.345.194 0 .344-.15.359-.345l.135-2.37-.135-3.63c-.015-.195-.165-.345-.374-.345m1.065-.195c-.195 0-.36.165-.36.36l-.09 3.825.105 2.34c0 .21.165.36.36.36.195 0 .36-.15.375-.36l.12-2.34-.12-3.825c-.015-.195-.18-.36-.39-.36m2.22 1.47c-.27 0-.48.21-.495.48l-.075 1.875.09 2.31c.015.27.225.48.495.48.27 0 .48-.21.495-.48l.105-2.31-.105-1.875c-.015-.27-.225-.48-.51-.48m1.095-.03c-.285 0-.51.225-.525.51l-.06 1.92.075 2.28c.015.285.24.51.525.51.284 0 .51-.225.525-.51l.09-2.28-.09-1.92c-.015-.285-.24-.51-.54-.51m1.095-.03c-.3 0-.54.24-.54.54l-.06 1.95.075 2.265c.015.3.24.54.54.54.3 0 .54-.24.555-.54l.09-2.265-.09-1.95c-.015-.3-.255-.54-.57-.54m1.11.015c-.315 0-.57.255-.57.57l-.045 1.95.06 2.25c.016.315.256.57.57.57.316 0 .57-.255.586-.57l.075-2.25-.075-1.95c-.015-.315-.27-.57-.6-.57m1.095.105c-.33 0-.585.255-.585.585l-.045 1.86.06 2.22c.015.33.255.585.585.585.33 0 .585-.255.6-.585l.075-2.22-.075-1.86c-.015-.33-.27-.585-.615-.585m1.11.06c-.345 0-.615.27-.615.615v1.8l.06 2.19c.015.345.27.615.615.615.344 0 .614-.27.63-.615l.06-2.19-.06-1.8c-.016-.345-.286-.615-.69-.615m2.94.54c-.135-.015-.27-.045-.405-.045-.405 0-.795.09-1.14.27-.18.09-.285.255-.285.465l-.015.015v6.12c0 .195.135.39.33.435.045.015 5.085.015 5.1.015 1.245 0 2.25-1.005 2.25-2.25 0-1.245-1.005-2.25-2.25-2.25-.345 0-.675.075-.975.225-.24-1.215-1.305-2.13-2.595-2.13"/>
  </svg>
);

// Spotify icon component
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
);

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const }
  }
};

export const NeoStreaming = () => {
  const t = useTranslations('home.streaming');

  return (
    <section className="py-24 bg-neo-bg">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          number="02"
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="space-y-8"
        >
          {/* SoundCloud Player Container */}
          <div className="border-4 border-neo-border bg-neo-surface shadow-[8px_8px_0px_0px_var(--neo-accent)] overflow-hidden">
            {/* Header Bar */}
            <div className="flex items-center justify-between p-4 border-b-4 border-neo-border bg-neo-text">
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-neo-accent" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neo-text-inverse">
                  {t('playerTitle')}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-neo-accent" />
                <div className="w-3 h-3 bg-neo-surface" />
                <div className="w-3 h-3 bg-neo-border" />
              </div>
            </div>

            {/* SoundCloud Iframe */}
            <iframe
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1342377886%3Fsecret_token%3Ds-0WB6x1mRFeB&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"
              className="w-full bg-neo-bg"
            />
          </div>

          {/* Platform Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href="https://soundcloud.com/loic-ghanem"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrutalistButton
                variant="primary"
                size="lg"
                icon={<SoundCloudIcon className="w-5 h-5" />}
              >
                {t('soundcloud')}
              </BrutalistButton>
            </a>
            <a
              href="https://open.spotify.com/intl-fr/artist/3PPQlrmOzl6QUBSP3gcyLA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BrutalistButton
                variant="secondary"
                size="lg"
                icon={<SpotifyIcon className="w-5 h-5" />}
              >
                {t('spotify')}
              </BrutalistButton>
            </a>
          </div>

          {/* Description */}
          <p className="font-mono text-sm opacity-60 max-w-xl">
            {t('description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NeoStreaming;
