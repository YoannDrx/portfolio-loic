'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Music, Headphones, Mic2, Sliders } from 'lucide-react';

const iconMap = {
  Music,
  Headphones,
  Mic2,
  Sliders,
};

interface SkillCardProps {
  iconName: keyof typeof iconMap;
  title: string;
  skills: string[];
  color?: 'cyan' | 'magenta' | 'purple' | 'blue';
}

const colorClasses = {
  cyan: {
    icon: 'text-neon-cyan',
    border: 'border-neon-cyan/30',
    bg: 'bg-neon-cyan/10',
    badge: 'bg-neon-cyan/20 border-neon-cyan/30',
  },
  magenta: {
    icon: 'text-neon-magenta',
    border: 'border-neon-magenta/30',
    bg: 'bg-neon-magenta/10',
    badge: 'bg-neon-magenta/20 border-neon-magenta/30',
  },
  purple: {
    icon: 'text-neon-purple',
    border: 'border-neon-purple/30',
    bg: 'bg-neon-purple/10',
    badge: 'bg-neon-purple/20 border-neon-purple/30',
  },
  blue: {
    icon: 'text-neon-blue',
    border: 'border-neon-blue/30',
    bg: 'bg-neon-blue/10',
    badge: 'bg-neon-blue/20 border-neon-blue/30',
  },
};

export default function SkillCard({ iconName, title, skills, color = 'cyan' }: SkillCardProps) {
  const Icon = iconMap[iconName];
  const classes = colorClasses[color];

  return (
    <GlassCard variant="default" hover className="h-full group">
      <div className="p-6">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${classes.bg} ${classes.border} border mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gradient-neon transition-all">
          {title}
        </h3>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm ${classes.badge} border text-gray-200`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
