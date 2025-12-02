'use client';

import { Music, Headphones, Mic2, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillCardProps {
  iconName: 'Music' | 'Headphones' | 'Mic2' | 'Sliders';
  title: string;
  skills: string[];
  color: 'cyan' | 'magenta' | 'purple' | 'blue';
}

const icons = {
  Music,
  Headphones,
  Mic2,
  Sliders,
};

const colorStyles = {
  cyan: {
    border: 'border-neon-cyan',
    text: 'text-neon-cyan',
    gradient: 'from-neon-cyan/20 to-transparent',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.2)]',
    dot: 'bg-neon-cyan',
  },
  magenta: {
    border: 'border-neon-magenta',
    text: 'text-neon-magenta',
    gradient: 'from-neon-magenta/20 to-transparent',
    shadow: 'shadow-[0_0_20px_rgba(255,0,110,0.2)]',
    dot: 'bg-neon-magenta',
  },
  purple: {
    border: 'border-neon-purple',
    text: 'text-neon-purple',
    gradient: 'from-neon-purple/20 to-transparent',
    shadow: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
    dot: 'bg-neon-purple',
  },
  blue: {
    border: 'border-neon-blue',
    text: 'text-neon-blue',
    gradient: 'from-neon-blue/20 to-transparent',
    shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    dot: 'bg-neon-blue',
  },
};

export default function SkillCard({ iconName, title, skills, color }: SkillCardProps) {
  const Icon = icons[iconName];
  const style = colorStyles[color];

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative group h-full"
    >
      {/* Tech Border Container */}
      <div className={`
        relative h-full bg-glass-subtle backdrop-blur-md
        border-l-4 ${style.border}
        overflow-hidden rounded-r-xl
        before:absolute before:inset-0 before:bg-gradient-to-br before:${style.gradient} before:opacity-10 before:group-hover:opacity-20 before:transition-opacity
      `}>
        
        {/* Cyberpunk Scanline */}
        <div className={`
          absolute top-0 left-0 w-full h-[2px] ${style.dot} 
          opacity-0 group-hover:opacity-50 
          animate-[scan_2s_linear_infinite]
          shadow-[0_0_10px_currentColor]
        `} />

        <div className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`
              p-3 rounded-lg bg-[var(--glass-subtle)] border border-[var(--glass-border)] 
              group-hover:border-${color === 'cyan' ? 'neon-cyan' : color === 'magenta' ? 'neon-magenta' : color === 'purple' ? 'neon-purple' : 'neon-blue'}/50 
              transition-colors duration-300
            `}>
              <Icon className={`w-8 h-8 ${style.text}`} />
            </div>
            {/* Tech Dots */}
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-20`} />
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-40`} />
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-80`} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-foreground mb-6 uppercase tracking-wider group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {title}
          </h3>

          {/* Skills List */}
          <ul className="space-y-3">
            {skills.map((skill, index) => (
              <li key={index} className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground/90 transition-colors">
                <span className={`w-1 h-1 rounded-full ${style.dot} shadow-[0_0_5px_currentColor]`} />
                <span className="font-mono text-sm tracking-wide">{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Corner Accent */}
        <div className={`absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl ${style.gradient} opacity-20`} />
      </div>
    </motion.div>
  );
}
