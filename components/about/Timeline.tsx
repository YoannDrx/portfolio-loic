'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type EventType = 'milestone' | 'award' | 'project' | 'collaboration';

interface TimelineEventConfig {
  key: string;
  year: string;
  type: EventType;
}

const eventsConfig: TimelineEventConfig[] = [
  { key: 'terra', year: '2025', type: 'project' },
  { key: 'metalcore', year: '2024', type: 'project' },
  { key: 'queens', year: '2023', type: 'milestone' },
  { key: 'bassMusic', year: '2022', type: 'project' },
  { key: 'sync', year: '2021', type: 'award' },
  { key: 'prolific', year: '2020', type: 'milestone' },
  { key: 'synthwave', year: '2019', type: 'project' },
  { key: 'metal', year: '2011-2013', type: 'collaboration' },
];

const colorMap = {
  cyan: {
    bg: 'bg-neon-cyan',
    text: 'text-neon-cyan',
    border: 'border-neon-cyan',
    gradient: 'from-neon-cyan',
    shadow: 'shadow-neon-cyan/50',
  },
  magenta: {
    bg: 'bg-neon-magenta',
    text: 'text-neon-magenta',
    border: 'border-neon-magenta',
    gradient: 'from-neon-magenta',
    shadow: 'shadow-neon-magenta/50',
  },
  purple: {
    bg: 'bg-neon-purple',
    text: 'text-neon-purple',
    border: 'border-neon-purple',
    gradient: 'from-neon-purple',
    shadow: 'shadow-neon-purple/50',
  },
  blue: {
    bg: 'bg-neon-blue',
    text: 'text-neon-blue',
    border: 'border-neon-blue',
    gradient: 'from-neon-blue',
    shadow: 'shadow-neon-blue/50',
  },
};

const typeColors: Record<EventType, keyof typeof colorMap> = {
  milestone: 'cyan',
  award: 'magenta',
  project: 'purple',
  collaboration: 'blue',
};

export default function Timeline() {
  const t = useTranslations('about.timeline.events');

  return (
    <div className="relative py-10 pl-8 md:pl-0">
      {/* Central Audio Wave Line (Desktop) */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
      
      {/* Mobile Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 md:hidden" />

      <div className="space-y-16">
        {eventsConfig.map((event, index) => {
          const colorKey = typeColors[event.type];
          const colors = colorMap[colorKey];
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col md:flex-row items-start md:items-center w-full",
                isLeft ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Spacer for desktop alignment */}
              <div className="flex-1 hidden md:block" />

              {/* Center Node */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 top-6 w-4 h-4 z-10 flex items-center justify-center">
                <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ring-4 ring-obsidian", colors.bg)} />
              </div>

              {/* Content Wrapper */}
              <div className={cn(
                "flex-1 w-full pl-12 md:pl-0",
                isLeft ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"
              )}>
                <div className={cn(
                  "relative p-6 bg-obsidian-100/50 border border-white/5 backdrop-blur-sm rounded-xl transition-all duration-300 group hover:border-white/20 hover:bg-obsidian-100/80",
                  // Connecting line logic
                  "before:absolute before:top-8 before:h-[1px] before:w-8 before:bg-white/20 md:before:w-16",
                  isLeft ? "md:before:left-full md:before:-mr-16 before:-left-8 before:w-8" : "md:before:right-full md:before:-ml-16 before:-left-8 before:w-8"
                )}>
                  
                  <div className={cn("flex flex-col gap-2 mb-3", isLeft ? "md:items-end" : "md:items-start")}>
                    <span className={cn(
                      "text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r opacity-30 group-hover:opacity-100 transition-opacity duration-500",
                      colors.gradient,
                      "to-white"
                    )}>
                      {event.year}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded border bg-opacity-10",
                      colors.text,
                      colors.border,
                      colors.bg
                    )}>
                      {t(`${event.key}.type`)}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-lime transition-colors">
                    {t(`${event.key}.title`)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-light">
                    {t(`${event.key}.description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
