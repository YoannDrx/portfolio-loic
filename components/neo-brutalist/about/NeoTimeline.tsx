"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Briefcase, Award, Lightbulb, Users } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';

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
    bgClass: 'bg-neo-accent',
    borderClass: 'border-neo-accent',
    tagVariant: 'inverted' as const,
    icon: Lightbulb,
  },
  award: {
    bgClass: 'bg-neo-accent',
    borderClass: 'border-neo-accent',
    tagVariant: 'accent' as const,
    icon: Award,
  },
  project: {
    bgClass: 'bg-neo-accent',
    borderClass: 'border-neo-accent',
    tagVariant: 'default' as const,
    icon: Briefcase,
  },
  collaboration: {
    bgClass: 'bg-neo-text',
    borderClass: 'border-neo-text',
    tagVariant: 'outline' as const,
    icon: Users,
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const }
  }
};

export const NeoTimeline = () => {
  const t = useTranslations('about.timeline');

  return (
    <section className="py-24 bg-neo-bg">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          number="03"
          title={t('title')}
          subtitle={t('subtitle')}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative"
        >
          {/* Vertical Line - Central on desktop, left on mobile */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-neo-border md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {eventsConfig.map((event, index) => {
              const config = typeConfig[event.type];
              const Icon = config.icon;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.key}
                  variants={fadeInUp}
                  className={`relative flex items-start ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Spacer for desktop alignment */}
                  <div className="flex-1 hidden md:block" />

                  {/* Square Dot - Neo-brutalist style */}
                  <div className="absolute left-4 md:left-1/2 top-6 transform -translate-x-1/2 z-10">
                    <div className={`w-4 h-4 ${config.bgClass} border-2 border-neo-border`} />
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 pl-12 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <NeoCard
                      hover="lift"
                      padding="lg"
                      className="relative group"
                    >
                      {/* Year - Large display - inside card, toward timeline side */}
                      <div className={`absolute top-0 ${
                        isLeft
                          ? 'right-4 md:right-6'
                          : 'left-4 md:left-6'
                      }`}>
                        <span
                          className="text-5xl md:text-6xl font-black tracking-tighter"
                          style={{
                            WebkitTextStroke: '2px var(--neo-border)',
                            color: 'transparent'
                          }}
                        >
                          {event.year}
                        </span>
                      </div>

                      {/* Type Badge - aligned opposite to the year */}
                      <div className={`flex items-center gap-2 mb-4 pt-8 ${
                        isLeft ? '' : 'md:justify-end'
                      }`}>
                        <NeoTag variant={config.tagVariant} size="sm">
                          <Icon className="w-3 h-3 mr-1" />
                          {t(`events.${event.key}.type`)}
                        </NeoTag>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight mb-3 text-neo-text ${
                        !isLeft ? 'md:text-right' : ''
                      }`}>
                        {t(`events.${event.key}.title`)}
                      </h3>

                      {/* Description */}
                      <p className={`font-mono text-sm opacity-70 leading-relaxed ${
                        !isLeft ? 'md:text-right' : ''
                      }`}>
                        {t(`events.${event.key}.description`)}
                      </p>

                      {/* Decorative corner */}
                      <div className={`absolute bottom-0 ${isLeft ? 'right-0' : 'left-0'} w-8 h-8 ${config.bgClass} opacity-20`} />
                    </NeoCard>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End marker */}
          <div className="absolute left-4 md:left-1/2 -bottom-4 transform -translate-x-1/2">
            <div className="w-6 h-6 bg-neo-accent border-2 border-neo-border rotate-45" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NeoTimeline;
