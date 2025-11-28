'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Music, Headphones, Play, ExternalLink } from 'lucide-react';

/* ============================================
   TYPES
   ============================================ */

type Platform = 'spotify' | 'soundcloud' | 'youtube' | 'deezer' | 'apple' | 'fanlink' | 'unknown';

interface EmbedPlayerProps {
  /** Lien pour le player embarqué (Spotify ou YouTube) */
  embedLink?: string | null;
  title?: string;
  className?: string;
}

interface ListenButtonProps {
  /** Lien externe (fanlink) pour le bouton "Écouter cet album" */
  listenLink: string;
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
  if (url.includes('fanlink.tv')) return 'fanlink';
  return 'unknown';
}

/* ============================================
   URL CONVERTERS
   ============================================ */

function getSpotifyEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Skip language prefix like 'intl-fr', 'intl-en', etc.
    if (pathParts[0]?.startsWith('intl-')) {
      pathParts = pathParts.slice(1);
    }

    if (pathParts.length >= 2) {
      const type = pathParts[0];
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

function getYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }

    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;

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
  fanlink: {
    name: 'Toutes les plateformes',
    icon: Headphones,
    color: 'text-neon-magenta',
    bgColor: 'bg-neon-magenta/10',
    borderColor: 'border-neon-magenta/30',
    glowColor: 'rgba(255, 0, 110, 0.3)',
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

  if (!embedUrl) return null;

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

function YouTubeEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

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

/* ============================================
   LISTEN BUTTON (Exported separately)
   ============================================ */

export function ListenButton({ listenLink, className }: ListenButtonProps) {
  const platform = detectPlatform(listenLink);
  const config = platformConfig[platform];
  const Icon = config.icon;

  return (
    <motion.a
      href={listenLink}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 px-6 py-4 rounded-xl',
        'backdrop-blur-md border transition-all duration-300',
        config.bgColor,
        config.borderColor,
        'hover:scale-[1.02]',
        className
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
        <p className="text-white font-medium">Écouter cet album</p>
        <p className="text-gray-400 text-sm">Sur vos plateformes préférées</p>
      </div>
      <ExternalLink className={cn('w-5 h-5', config.color)} />
    </motion.a>
  );
}

/* ============================================
   MAIN COMPONENT (Player only)
   ============================================ */

export default function EmbedPlayer({ embedLink, title, className }: EmbedPlayerProps) {
  if (!embedLink) return null;

  const embedPlatform = detectPlatform(embedLink);
  const config = platformConfig[embedPlatform];
  const Icon = config.icon;

  const hasEmbedPlayer = embedPlatform === 'spotify' || embedPlatform === 'youtube';

  if (!hasEmbedPlayer) return null;

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
        {embedPlatform === 'spotify' && <SpotifyEmbed url={embedLink} />}
        {embedPlatform === 'youtube' && <YouTubeEmbed url={embedLink} />}
      </div>
    </motion.div>
  );
}
