'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Music, Headphones, Play, ExternalLink } from 'lucide-react';

/* ============================================
   TYPES
   ============================================ */

type Platform = 'spotify' | 'soundcloud' | 'youtube' | 'deezer' | 'apple' | 'unknown';

interface EmbedPlayerProps {
  listenLink: string;
  title?: string;
  className?: string;
}

/* ============================================
   PLATFORM DETECTION
   ============================================ */

function detectPlatform(url: string): Platform {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('deezer.com')) return 'deezer';
  if (url.includes('music.apple.com')) return 'apple';
  return 'unknown';
}

/* ============================================
   URL CONVERTERS
   ============================================ */

function getSpotifyEmbedUrl(url: string): string | null {
  try {
    // Convert various Spotify URL formats to embed format
    // https://open.spotify.com/track/xxx -> https://open.spotify.com/embed/track/xxx
    // https://open.spotify.com/album/xxx -> https://open.spotify.com/embed/album/xxx
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    if (pathParts.length >= 2) {
      const type = pathParts[0]; // track, album, playlist, artist
      const id = pathParts[1].split('?')[0];

      if (['track', 'album', 'playlist', 'artist'].includes(type)) {
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

function getSoundCloudEmbedUrl(url: string): string {
  // SoundCloud requires the original URL encoded
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300F0FF&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
}

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Handle youtu.be format
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    // Handle youtube.com format
    if (urlObj.hostname.includes('youtube.com')) {
      // /watch?v=xxx format
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;

      // /embed/xxx format
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'embed' && pathParts[1]) {
        return pathParts[1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

/* ============================================
   PLATFORM CONFIGS
   ============================================ */

const platformConfig: Record<Platform, {
  name: string;
  icon: typeof Music;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  spotify: {
    name: 'Spotify',
    icon: Music,
    color: 'text-[#1DB954]',
    bgColor: 'bg-[#1DB954]/10',
    borderColor: 'border-[#1DB954]/30',
    glowColor: 'rgba(29, 185, 84, 0.3)',
  },
  soundcloud: {
    name: 'SoundCloud',
    icon: Music,
    color: 'text-[#FF5500]',
    bgColor: 'bg-[#FF5500]/10',
    borderColor: 'border-[#FF5500]/30',
    glowColor: 'rgba(255, 85, 0, 0.3)',
  },
  youtube: {
    name: 'YouTube',
    icon: Play,
    color: 'text-[#FF0000]',
    bgColor: 'bg-[#FF0000]/10',
    borderColor: 'border-[#FF0000]/30',
    glowColor: 'rgba(255, 0, 0, 0.3)',
  },
  deezer: {
    name: 'Deezer',
    icon: Headphones,
    color: 'text-[#FEAA2D]',
    bgColor: 'bg-[#FEAA2D]/10',
    borderColor: 'border-[#FEAA2D]/30',
    glowColor: 'rgba(254, 170, 45, 0.3)',
  },
  apple: {
    name: 'Apple Music',
    icon: Music,
    color: 'text-[#FC3C44]',
    bgColor: 'bg-[#FC3C44]/10',
    borderColor: 'border-[#FC3C44]/30',
    glowColor: 'rgba(252, 60, 68, 0.3)',
  },
  unknown: {
    name: 'Écouter',
    icon: Headphones,
    color: 'text-neon-magenta',
    bgColor: 'bg-neon-magenta/10',
    borderColor: 'border-neon-magenta/30',
    glowColor: 'rgba(255, 0, 110, 0.3)',
  },
};

/* ============================================
   EMBED COMPONENTS
   ============================================ */

function SpotifyEmbed({ url }: { url: string }) {
  const embedUrl = getSpotifyEmbedUrl(url);

  if (!embedUrl) {
    return <ExternalLinkButton href={url} platform="spotify" />;
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="352"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
        style={{ border: 'none' }}
      />
    </motion.div>
  );
}

function SoundCloudEmbed({ url }: { url: string }) {
  const embedUrl = getSoundCloudEmbedUrl(url);

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        src={embedUrl}
        width="100%"
        height="166"
        allow="autoplay"
        loading="lazy"
        className="rounded-xl"
        style={{ border: 'none' }}
      />
    </motion.div>
  );
}

function YouTubeEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url);

  if (!videoId) {
    return <ExternalLinkButton href={url} platform="youtube" />;
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden aspect-video"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="rounded-xl"
        style={{ border: 'none' }}
      />
    </motion.div>
  );
}

function ExternalLinkButton({ href, platform }: { href: string; platform: Platform }) {
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 px-6 py-4 rounded-xl',
        'backdrop-blur-md border transition-all duration-300',
        config.bgColor,
        config.borderColor,
        'hover:scale-[1.02]'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        boxShadow: `0 0 30px ${config.glowColor}`,
      }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn('p-2 rounded-lg', config.bgColor)}>
        <Icon className={cn('w-6 h-6', config.color)} />
      </div>
      <div className="flex-1">
        <p className="text-white font-medium">Écouter sur {config.name}</p>
        <p className="text-gray-400 text-sm">Ouvrir dans une nouvelle fenêtre</p>
      </div>
      <ExternalLink className={cn('w-5 h-5', config.color)} />
    </motion.a>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function EmbedPlayer({ listenLink, title, className }: EmbedPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const platform = detectPlatform(listenLink);
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn('relative', className)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={cn(
            'p-2 rounded-lg border backdrop-blur-md',
            config.bgColor,
            config.borderColor
          )}
          animate={{
            boxShadow: [
              `0 0 10px ${config.glowColor}`,
              `0 0 20px ${config.glowColor}`,
              `0 0 10px ${config.glowColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Icon className={cn('w-5 h-5', config.color)} />
        </motion.div>
        <div>
          <p className={cn('font-semibold', config.color)}>{config.name}</p>
          {title && <p className="text-gray-400 text-sm">{title}</p>}
        </div>
      </div>

      {/* Player */}
      <div
        className={cn(
          'rounded-xl border backdrop-blur-md overflow-hidden',
          config.borderColor,
          'bg-obsidian-900/50'
        )}
      >
        {platform === 'spotify' && <SpotifyEmbed url={listenLink} />}
        {platform === 'soundcloud' && <SoundCloudEmbed url={listenLink} />}
        {platform === 'youtube' && <YouTubeEmbed url={listenLink} />}
        {(platform === 'deezer' || platform === 'apple' || platform === 'unknown') && (
          <div className="p-4">
            <ExternalLinkButton href={listenLink} platform={platform} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
