'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Music2, ExternalLink, Guitar, Mic2 } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

interface BandConfig {
  id: number;
  key: string;
  name: string;
  link?: string;
  color: 'cyan' | 'magenta' | 'purple' | 'blue';
  icon: 'guitar' | 'mic' | 'music';
}

const bandsConfig: BandConfig[] = [
  {
    id: 1,
    key: 'voyager1',
    name: 'Voyager1',
    link: 'https://www.youtube.com/watch?v=aPJUTPMEukM',
    color: 'cyan',
    icon: 'music',
  },
  {
    id: 2,
    key: 'earlySeasons',
    name: 'Early Seasons',
    link: 'https://www.youtube.com/watch?v=o8c9h2Vzrhw',
    color: 'magenta',
    icon: 'guitar',
  },
  {
    id: 3,
    key: 'confront',
    name: 'Confront',
    link: 'https://www.youtube.com/watch?v=8m4W1IuVRco',
    color: 'purple',
    icon: 'music',
  },
  {
    id: 4,
    key: 'riseOfTheNorthstar',
    name: 'Rise of the Northstar',
    link: 'https://www.youtube.com/watch?v=NulC3-rQX24',
    color: 'blue',
    icon: 'guitar',
  },
];

const colorClasses = {
  cyan: {
    border: 'border-neon-cyan/30',
    glow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    text: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
  },
  magenta: {
    border: 'border-neon-magenta/30',
    glow: 'hover:shadow-[0_0_30px_rgba(255,0,110,0.3)]',
    text: 'text-neon-magenta',
    bg: 'bg-neon-magenta/10',
  },
  purple: {
    border: 'border-neon-purple/30',
    glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    text: 'text-neon-purple',
    bg: 'bg-neon-purple/10',
  },
  blue: {
    border: 'border-neon-blue/30',
    glow: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]',
    text: 'text-neon-blue',
    bg: 'bg-neon-blue/10',
  },
};

const iconComponents = {
  guitar: Guitar,
  mic: Mic2,
  music: Music2,
};

export default function MusicianExperience() {
  const t = useTranslations('about.musicianExperience');

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-neon-magenta/10 rounded-full border border-neon-magenta/30 mb-6">
          <Music2 className="w-5 h-5 text-neon-magenta" />
          <span className="text-neon-magenta font-semibold">Band Experience</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Bands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {bandsConfig.map((band, index) => {
          const colors = colorClasses[band.color];
          const IconComponent = iconComponents[band.icon];

          // Helper to safely get description if it exists
          // Assuming all bands have a description in the provided JSON structure
          const description = t(`${band.key}.description`);

          return (
            <motion.div
              key={band.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard
                variant="default"
                hover="lift"
                className={`h-full ${colors.border} ${colors.glow} transition-all duration-300`}
              >
                <GlassCardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          {band.name}
                        </h3>
                      </div>
                      <p className={`text-sm font-semibold ${colors.text} mb-1`}>
                        {t(`${band.key}.period`)}
                      </p>
                    </div>
                  </div>

                  {/* Role & Description */}
                  <div className="space-y-2 mb-4">
                    <p className="text-base font-medium text-gray-200">
                      {t(`${band.key}.role`)}
                      {description && (
                        <span className={`ml-2 text-sm ${colors.text}`}>
                          • {description}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400 italic">
                      {t(`${band.key}.genre`)}
                    </p>
                  </div>

                  {/* Listen Link */}
                  {band.link && (
                    <a
                      href={band.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.border} border rounded-lg ${colors.text} hover:bg-opacity-20 transition-all duration-300 text-sm font-semibold`}
                    >
                      <span>{t('listenHere')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
