'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ExternalLink, Star, X } from 'lucide-react';

interface AwardItem {
  id: number;
  key: string;
  image: string;
  color: 'cyan' | 'magenta' | 'purple';
  link: string;
}

const awardsConfig: AwardItem[] = [
  {
    id: 1,
    key: 'pma2024',
    image: '/img/about/PMA-2024-Metal-nomination.jpg',
    color: 'cyan',
    link: 'https://www.productionmusicawards.com/',
  },
  {
    id: 2,
    key: 'pma2023',
    image: '/img/about/PMA-2023-Rock-nomination.jpg',
    color: 'magenta',
    link: 'https://www.productionmusicawards.com/',
  },
  {
    id: 3,
    key: 'mark',
    image: '/img/about/Marks-Awards.jpg',
    color: 'purple',
    link: 'https://pmamusic.com/events/mark-awards/',
  },
];

const colorStyles = {
  cyan: {
    text: 'text-neon-cyan',
    bg: 'bg-neon-cyan',
    border: 'border-neon-cyan',
    shadow: 'shadow-neon-cyan/50',
  },
  magenta: {
    text: 'text-neon-magenta',
    bg: 'bg-neon-magenta',
    border: 'border-neon-magenta',
    shadow: 'shadow-neon-magenta/50',
  },
  purple: {
    text: 'text-neon-purple',
    bg: 'bg-neon-purple',
    border: 'border-neon-purple',
    shadow: 'shadow-neon-purple/50',
  },
};

export default function Awards() {
  const t = useTranslations('about.awards');
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);

  return (
    <section className="py-20 relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--glass-subtle)] rounded-full border border-[var(--glass-border)] backdrop-blur-md mb-6">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold tracking-wider uppercase text-sm">{t('subtitle')}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter">
          {t('title')}
        </h2>
      </div>

      {/* Awards Showcase */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {awardsConfig.map((award, index) => {
          const style = colorStyles[award.color];
          const title = t(`${award.key}.title`);
          const year = t(`${award.key}.year`);
          const category = t(`${award.key}.category`);

          return (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="group relative perspective-1000"
              onClick={() => setSelectedAward(award)}
            >
              {/* The "Prism" Card */}
              <div className="relative h-[500px] w-full bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl cursor-pointer">
                
                {/* Image Area */}
                <div className="relative h-3/5 w-full overflow-hidden">
                  <Image
                    src={award.image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/60 group-hover:bg-background/20 transition-colors duration-500" />
                  
                  {/* Year Badge - Floating */}
                  <div className={`absolute top-4 right-4 px-4 py-2 bg-background/90 backdrop-blur border ${style.border} rounded-lg shadow-lg`}>
                    <span className={`font-mono font-bold text-xl text-foreground`}>{year}</span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-background via-background/95 to-transparent p-6 flex flex-col justify-end">
                  <div className={`w-12 h-1 ${style.bg} mb-4 rounded-full shadow-[0_0_10px_currentColor]`} />
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                    {title}
                  </h3>
                  
                  <p className={`text-sm font-bold uppercase tracking-wider ${style.text} mb-4`}>
                    {category}
                  </p>

                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest group-hover:text-foreground transition-colors">
                    <span>{t('learnMore')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>

                {/* Shiny Border Effect */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:${style.border} rounded-2xl transition-colors duration-500 pointer-events-none opacity-50`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal (Simplified Glass) */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedAward(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-background border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={selectedAward.image}
                  alt={t(`${selectedAward.key}.title`)}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <button
                  onClick={() => setSelectedAward(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <h3 className="text-3xl font-bold text-foreground mb-2">{t(`${selectedAward.key}.title`)}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--glass-subtle)] ${colorStyles[selectedAward.color].text} mb-6`}>
                  {t(`${selectedAward.key}.category`)}
                </span>

                <p className="text-foreground/85 mb-6 text-lg leading-relaxed">
                  {t(`${selectedAward.key}.description`)}
                </p>

                <div className="space-y-3 mb-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start gap-3">
                      <Star className={`w-4 h-4 mt-1 ${colorStyles[selectedAward.color].text}`} />
                      <span className="text-muted-foreground text-sm">{t(`${selectedAward.key}.detail${num}`)}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={selectedAward.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-obsidian ${colorStyles[selectedAward.color].bg} hover:opacity-90 transition-opacity`}
                >
                  {t('visitWebsite')} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}