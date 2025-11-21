'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, Award, Music, Briefcase } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  type: 'milestone' | 'award' | 'project' | 'collaboration';
}

const timelineData: TimelineEvent[] = [
  {
    year: '2025',
    title: 'Terra - Ambient Orchestral Album',
    description: 'Album ambient orchestral pour visuels nature et environnement, publié par Cezame Music Agency sous le label Infinity Scores.',
    type: 'project',
  },
  {
    year: '2024',
    title: 'Metalcore II & Dystopia',
    description: 'Double sortie : Metalcore II avec Aaron Matts et Terence Langlois, et Dystopia - fusion unique de metal cinématique et ambient sous Infinity Scores.',
    type: 'project',
  },
  {
    year: '2023',
    title: 'The Queens Album',
    description: 'Album ambitieux fusionnant punk rock et drill music avec 12 artistes internationaux. Sorti sous MYMA.',
    type: 'milestone',
  },
  {
    year: '2022',
    title: 'Make Me Feel & Bass Music',
    description: 'Deux albums Hip-Hop/RnB et Bass Music avec des collaborations internationales (Quincy Thompson, Novine, Lou.C).',
    type: 'project',
  },
  {
    year: '2021',
    title: 'Placements Sync Majeurs',
    description: 'Sync placements sur NBA Countdown, NHL In the Room, MOTDx BBC, et WWE RAW.',
    type: 'award',
  },
  {
    year: '2020',
    title: 'Année Prolifique',
    description: 'Sortie de 5 albums : Ambient Guitar, Cyberpunk, Hardcore, Fast Metal, et Kick-ass Metal Jacket.',
    type: 'milestone',
  },
  {
    year: '2019',
    title: 'Débuts avec Synthwave',
    description: 'Premier album Synthwave - hommage à l\'électro revival des années 80, publié par Stereoscopic et MYMA.',
    type: 'project',
  },
  {
    year: '2011-2013',
    title: 'Débuts Metal',
    description: 'Collaboration avec Rise of the Northstar, Confront, et Early Seasons - établissement dans la scène metal.',
    type: 'collaboration',
  },
];

const iconMap = {
  milestone: Calendar,
  award: Award,
  project: Music,
  collaboration: Briefcase,
};

const colorMap = {
  milestone: 'neon-cyan',
  award: 'neon-magenta',
  project: 'neon-purple',
  collaboration: 'neon-blue',
};

export default function Timeline() {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-magenta to-neon-purple opacity-30" />

      {/* Timeline Events */}
      <div className="space-y-8">
        {timelineData.map((event, index) => {
          const Icon = iconMap[event.type];
          const color = colorMap[event.type];

          return (
            <div key={index} className="relative pl-20">
              {/* Icon */}
              <div
                className={`absolute left-4 -translate-x-1/2 w-8 h-8 rounded-full bg-${color}/20 border-2 border-${color} flex items-center justify-center backdrop-blur-sm`}
                style={{
                  backgroundColor: `rgba(var(--tw-${color}-rgb, 0, 240, 255), 0.2)`,
                  borderColor: `var(--tw-${color}, #00f0ff)`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: `var(--tw-${color}, #00f0ff)` }} />
              </div>

              {/* Content */}
              <GlassCard variant="subtle" hover className="group">
                <div className="p-6">
                  {/* Year Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${color}/10 border border-${color}/30 mb-3`}
                    style={{
                      backgroundColor: `rgba(var(--tw-${color}-rgb, 0, 240, 255), 0.1)`,
                      borderColor: `rgba(var(--tw-${color}-rgb, 0, 240, 255), 0.3)`,
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: `var(--tw-${color}, #00f0ff)` }}
                    >
                      {event.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient-neon transition-all">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed">{event.description}</p>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
