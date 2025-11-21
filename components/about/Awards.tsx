'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award as AwardIcon, X, ExternalLink } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

interface AwardItem {
  id: number;
  year: string;
  title: string;
  category: string;
  work?: string;
  album?: string;
  image: string;
  color: 'cyan' | 'magenta' | 'purple';
  description: string;
  details: string[];
  link: string;
}

function getAwardsData(locale: string): AwardItem[] {
  const isFr = locale === 'fr';

  return [
  {
    id: 1,
    year: '2024',
    title: 'Production Music Awards',
    category: isFr ? 'Double Nomination - Metal' : 'Double Nomination - Metal',
    work: isFr
      ? '"Sparkle in the Dark" & "Revenge" feat. Aaron Matts'
      : '"Sparkle in the Dark" & "Revenge" feat. Aaron Matts',
    album: isFr ? 'Albums : Dystopia & Metalcore2' : 'Albums: Dystopia & Metalcore2',
    image: '/img/about/PMA-2024-Metal-nomination.jpg',
    color: 'cyan',
    description: isFr
      ? 'Honoré d\'une double nomination dans la toute nouvelle catégorie Metal aux Production Music Awards 2024.'
      : 'Honored with a double nomination in the brand-new Metal category at the Production Music Awards 2024.',
    details: isFr ? [
      '"Sparkle in the Dark" de l\'album Dystopia, sorti par Infinity Scores et publié par Cezame Agency',
      '"Revenge" feat. Aaron Matts de l\'album Metalcore2, sorti par Justement Music et publié par MYMA',
      'Cette reconnaissance aux PMA 2024 met en lumière mon exploration continue de la musique metal et mes collaborations avec des vocalistes de premier plan.',
    ] : [
      '"Sparkle in the Dark" from the album Dystopia, released by Infinity Scores and published by Cezame Agency',
      '"Revenge" feat. Aaron Matts from the album Metalcore2, released by Justement Music and published by MYMA',
      'This recognition at the PMA 2024 highlights my continued exploration of metal music and my collaborations with top vocalists.',
    ],
    link: 'https://www.productionmusicawards.com/',
  },
  {
    id: 2,
    year: '2023',
    title: 'Production Music Awards',
    category: isFr ? 'Nomination - Rock' : 'Nomination - Rock',
    image: '/img/about/PMA-2023-Rock-nomination.jpg',
    color: 'magenta',
    description: isFr
      ? 'Une célébration des meilleurs et des plus brillants dans le domaine de la musique de production.'
      : 'A celebration of the best and brightest in the field of production music.',
    details: isFr ? [
      'Les Production Music Awards sont un témoignage d\'excellence créative et d\'innovation.',
      'Faire partie de cet événement a été non seulement un honneur mais aussi une opportunité de se connecter avec certains des individus les plus talentueux de l\'industrie.',
      'Les prix mettent en valeur une large gamme de genres musicaux, honorant les compositeurs et producteurs dont le travail élève les médias à travers le monde.',
    ] : [
      'The Production Music Awards are a testament to creative excellence and innovation.',
      'Being a part of this event was not only an honor but also an opportunity to connect with some of the most talented individuals in the industry.',
      'The awards showcase a wide range of musical genres, honoring composers and producers whose work elevates media across the globe.',
    ],
    link: 'https://www.productionmusicawards.com/',
  },
  {
    id: 3,
    year: '2023',
    title: 'Mark Awards',
    category: isFr ? 'Reconnaissance' : 'Recognition',
    image: '/img/about/Marks-Awards.jpg',
    color: 'purple',
    description: isFr
      ? 'Reconnaissance des réalisations exceptionnelles dans le domaine de la musique de production.'
      : 'Recognizing the outstanding achievements in the field of production music.',
    details: isFr ? [
      'Les Mark Awards établissent une norme élevée en matière de créativité et d\'excellence.',
      'Participer aux Mark Awards a été une expérience exaltante, rassemblant une communauté de professionnels de la musique passionnés et dévoués.',
      'Ces prix sont le reflet fidèle du travail acharné et du dévouement qui entrent dans la musique de production, célébrant l\'incroyable talent et la créativité qui font avancer notre industrie.',
    ] : [
      'The Mark Awards set a high standard for creativity and excellence.',
      'Participating in the Mark Awards was an exhilarating experience, bringing together a community of passionate and dedicated music professionals.',
      'These awards are a true reflection of the hard work and dedication that goes into production music, celebrating the incredible talent and creativity that drives our industry forward.',
    ],
    link: 'https://pmamusic.com/events/mark-awards/',
  },
];
}

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
};

export default function Awards() {
  const t = useTranslations('about.awards');
  const locale = useLocale();
  const awards = getAwardsData(locale);
  const [selectedAward, setSelectedAward] = useState<AwardItem | null>(null);

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/30 mb-6">
          <Trophy className="w-5 h-5 text-neon-cyan" />
          <span className="text-neon-cyan font-semibold">Latest Achievements</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          {t('title')}
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award, index) => {
          const colors = colorClasses[award.color];
          return (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard
                variant="default"
                hover
                className={`h-full ${colors.border} ${colors.glow} transition-all duration-300 cursor-pointer`}
                onClick={() => setSelectedAward(award)}
              >
                <GlassCardContent className="p-0">
                  {/* Award Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-50">
                    <Image
                      src={award.image}
                      alt={`${award.title} ${award.year}`}
                      fill
                      className="object-contain transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-40 pointer-events-none" />

                    {/* Year Badge */}
                    <div className={`absolute top-4 right-4 px-4 py-2 ${colors.bg} backdrop-blur-sm rounded-full border ${colors.border}`}>
                      <span className={`text-sm font-bold ${colors.text}`}>{award.year}</span>
                    </div>
                  </div>

                  {/* Award Info */}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${colors.bg} ${colors.border} border flex-shrink-0`}>
                        <AwardIcon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          {award.title}
                        </h3>
                        <p className={`text-sm font-semibold ${colors.text} mb-2`}>
                          {award.category}
                        </p>
                      </div>
                    </div>

                    {award.work && (
                      <div className="space-y-1 mb-4">
                        <p className="text-sm text-gray-300">
                          {award.work}
                        </p>
                        {award.album && (
                          <p className="text-xs text-gray-400 italic">
                            {award.album}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Learn More Button */}
                    <button
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${colors.text} hover:gap-3 transition-all`}
                    >
                      <span>{t('learnMore')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAward(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard
                variant="neon"
                className={`${colorClasses[selectedAward.color].border} ${colorClasses[selectedAward.color].glow}`}
              >
                <GlassCardContent className="p-0">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedAward(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-obsidian/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian-50">
                    <Image
                      src={selectedAward.image}
                      alt={`${selectedAward.title} ${selectedAward.year}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-lg ${colorClasses[selectedAward.color].bg} ${colorClasses[selectedAward.color].border} border`}>
                        <AwardIcon className={`w-6 h-6 ${colorClasses[selectedAward.color].text}`} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white mb-2">
                          {selectedAward.title} {selectedAward.year}
                        </h3>
                        <p className={`text-lg font-semibold ${colorClasses[selectedAward.color].text}`}>
                          {selectedAward.category}
                        </p>
                      </div>
                    </div>

                    <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                      {selectedAward.description}
                    </p>

                    <div className="space-y-4 mb-8">
                      {selectedAward.details.map((detail, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${colorClasses[selectedAward.color].bg} mt-2 flex-shrink-0`} />
                          <p className="text-gray-300 leading-relaxed">{detail}</p>
                        </div>
                      ))}
                    </div>

                    <a
                      href={selectedAward.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-${selectedAward.color === 'cyan' ? 'neon-cyan' : selectedAward.color === 'magenta' ? 'neon-magenta' : 'neon-purple'} to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300`}
                    >
                      <span>{t('visitWebsite')}</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
