'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Briefcase, Award, Lightbulb, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const typeConfig = {
  milestone: {
    dotClass: 'bg-neon-cyan shadow-neon-cyan',
    badgeBg: 'bg-neon-cyan/20',
    badgeBorder: 'border-neon-cyan/50',
    badgeText: 'text-neon-cyan',
    yearGradient: 'from-neon-cyan to-white',
    icon: Lightbulb,
  },
  award: {
    dotClass: 'bg-neon-magenta shadow-neon-magenta',
    badgeBg: 'bg-neon-magenta/20',
    badgeBorder: 'border-neon-magenta/50',
    badgeText: 'text-neon-magenta',
    yearGradient: 'from-neon-magenta to-white',
    icon: Award,
  },
  project: {
    dotClass: 'bg-neon-purple shadow-neon-purple',
    badgeBg: 'bg-neon-purple/20',
    badgeBorder: 'border-neon-purple/50',
    badgeText: 'text-neon-purple',
    yearGradient: 'from-neon-purple to-white',
    icon: Briefcase,
  },
  collaboration: {
    dotClass: 'bg-neon-blue shadow-neon-blue',
    badgeBg: 'bg-neon-blue/20',
    badgeBorder: 'border-neon-blue/50',
    badgeText: 'text-neon-blue',
    yearGradient: 'from-neon-blue to-white',
    icon: Users,
  },
};

export default function Timeline() {
  const t = useTranslations('about.timeline.events');

  return (
    <div className="relative max-w-5xl mx-auto py-8">
      {/* Vertical Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent transform -translate-x-1/2" />

      <div className="space-y-16">
        {eventsConfig.map((event, index) => {
          const config = typeConfig[event.type];
          const Icon = config.icon;
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={event.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "relative flex items-start",
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Spacer for desktop alignment */}
              <div className="flex-1 hidden md:block" />

              {/* Dot - visible through card transparency */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 top-6 z-10">
                <div className={cn(
                  "w-4 h-4 rounded-full shadow-[0_0_20px_currentColor] ring-4 ring-background",
                  config.dotClass
                )} />
              </div>

              {/* Content Card */}
              <div className={cn(
                "flex-1 pl-28 md:pl-0",
                isLeft ? "md:pr-16" : "md:pl-16"
              )}>
                <div className="relative bg-glass-subtle backdrop-blur-sm border border-[var(--glass-border)] rounded-xl p-6 hover:border-[var(--glass-border-strong)] hover:bg-glass transition-all duration-300 group">
                  {/* Type Badge + Year - aligned based on card position */}
                  <div className={cn(
                    "flex flex-col gap-3 mb-4",
                    isLeft ? "md:items-end items-start" : "items-start"
                  )}>
                    {/* Type Badge */}
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                      config.badgeBg,
                      config.badgeBorder
                    )}>
                      <Icon className={cn("w-3.5 h-3.5", config.badgeText)} />
                      <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        config.badgeText
                      )}>
                        {t(`${event.key}.type`)}
                      </span>
                    </div>

                    {/* Year */}
                    <div className={cn(
                      "text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r",
                      config.yearGradient
                    )}>
                      {event.year}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "text-xl font-bold text-foreground mb-3 group-hover:text-gradient-neon transition-all",
                    !isLeft && "md:text-right"
                  )}>
                    {t(`${event.key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className={cn(
                    "text-muted-foreground text-sm leading-relaxed",
                    !isLeft && "md:text-right"
                  )}>
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
