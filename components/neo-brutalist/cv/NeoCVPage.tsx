"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Download,
  Mail,
  Globe,
  Linkedin,
  Youtube,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  Languages
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { BrutalistButton } from '../ui/BrutalistButton';
import { NeoTag } from '../ui/NeoTag';
import { SectionHeader } from '../ui/SectionHeader';
import type { CVData, CVSection, CVSkill, CVTranslation } from '@/types/cv';

interface NeoCVPageProps {
  data: CVData;
}

// Helper to get translation by locale
const t = (translations: CVTranslation[], locale: string) => {
  return translations.find(x => x.locale === locale) || translations[0] || {};
};

// Format date
const formatDate = (dateStr: string | null | undefined, locale: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
};

// Get icon for section type
const getSectionIcon = (type: string) => {
  switch (type) {
    case 'experience': return <Briefcase size={24} />;
    case 'awards': return <Award size={24} />;
    case 'education': return <GraduationCap size={24} />;
    default: return <Briefcase size={24} />;
  }
};

export const NeoCVPage: React.FC<NeoCVPageProps> = ({ data }) => {
  const tPage = useTranslations('cv');
  const locale = useLocale();
  const isFr = locale === 'fr';

  const headline = isFr ? data.headlineFr : data.headlineEn;
  const badge = isFr ? data.badgeFr : data.badgeEn;
  const bio = isFr ? data.bioFr : data.bioEn;

  // Filter and sort sections
  const activeSections = (data.sections || [])
    .filter(s => s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const experienceSection = activeSections.find(s => s.type === 'experience');
  const awardsSection = activeSections.find(s => s.type === 'awards');

  // Skills by category
  const technicalSkills = (data.skills || [])
    .filter(s => s.category === 'technical' && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const softwareSkills = (data.skills || [])
    .filter(s => s.category === 'software' && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  const languages = (data.skills || [])
    .filter(s => s.category === 'language' && s.isActive !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-neo-bg">
      {/* Header Section */}
      <section className="relative bg-neo-text text-neo-text-inverse overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neo-accent opacity-20 -rotate-12 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neo-accent opacity-30 rotate-6 -translate-x-10 translate-y-10" />

        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            {/* Photo */}
            {data.showPhoto && data.photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="w-40 h-40 md:w-48 md:h-48 border-4 border-neo-accent relative overflow-hidden shadow-[8px_8px_0px_0px_var(--neo-accent)]">
                  <Image
                    src={data.photo}
                    alt={data.fullName || 'Profile'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {/* Badge */}
                {badge && (
                  <div className="absolute -bottom-4 -right-4 bg-neo-accent text-neo-text px-4 py-2 font-mono text-xs uppercase font-bold border-2 border-neo-text shadow-[4px_4px_0px_0px_var(--neo-text)]">
                    {isFr ? 'Dispo' : 'Available'}
                  </div>
                )}
              </motion.div>
            )}

            {/* Info */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                  {data.fullName}
                </h1>
                {headline && (
                  <div className="inline-block px-4 py-2 bg-neo-accent text-neo-text font-mono text-lg uppercase font-bold -rotate-1 mb-6">
                    {headline}
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {data.email && (
                    <a
                      href={`mailto:${data.email}`}
                      className="flex items-center gap-2 font-mono text-sm hover:text-neo-accent transition-colors"
                    >
                      <Mail size={16} />
                      {data.email}
                    </a>
                  )}
                  {data.website && (
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-sm hover:text-neo-accent transition-colors"
                    >
                      <Globe size={16} />
                      {data.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {data.linkedInUrl && (
                    <a
                      href={data.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-sm hover:text-neo-accent transition-colors"
                    >
                      <Linkedin size={16} />
                      LinkedIn
                    </a>
                  )}
                  {data.location && (
                    <span className="flex items-center gap-2 font-mono text-sm text-neo-text-inverse/70">
                      <MapPin size={16} />
                      {data.location}
                    </span>
                  )}
                </div>

                {/* Social Links */}
                {data.socialLinks && data.socialLinks.length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {data.socialLinks.map(link => (
                      <a
                        key={link.id || link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border-2 border-neo-text-inverse/30 hover:border-neo-accent hover:bg-neo-accent hover:text-neo-text transition-colors"
                        aria-label={link.label || link.platform}
                      >
                        {link.platform === 'YouTube' && <Youtube size={18} />}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Download Button */}
            <div className="md:self-start">
              <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                <BrutalistButton variant="primary" size="lg" icon={<Download size={20} />}>
                  {tPage('download')}
                </BrutalistButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {bio && (
        <section className="container mx-auto px-4 md:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="font-mono text-xs uppercase text-neo-accent mb-4">// {tPage('profile')}</div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed border-l-4 border-neo-accent pl-6 text-neo-text">
              {bio}
            </p>
          </motion.div>
        </section>
      )}

      {/* Experience Section */}
      {experienceSection && experienceSection.items.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t-4 border-neo-border">
          <SectionHeader
            number="01"
            title={t(experienceSection.translations, locale).title || (isFr ? 'Expériences' : 'Experience')}
            subtitle={isFr ? 'Parcours Professionnel' : 'Career Path'}
          />

          <div className="mt-12 space-y-0">
            {experienceSection.items
              .filter(item => item.isActive !== false)
              .sort((a, b) => a.order - b.order)
              .map((item, idx) => {
                const itemT = t(item.translations, locale);
                const isLast = idx === experienceSection.items.length - 1;

                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-8 pb-12 border-l-2 border-neo-border last:border-l-0"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-0 w-4 h-4 bg-neo-accent border-2 border-neo-border -translate-x-[9px]" />

                    {/* Date */}
                    <div className="font-mono text-xs text-neo-text/60 mb-2">
                      {formatDate(item.startDate, locale)} — {item.isCurrent ? (isFr ? 'Présent' : 'Present') : formatDate(item.endDate, locale)}
                    </div>

                    {/* Content */}
                    <div className="bg-neo-surface border-2 border-neo-border p-6 hover:shadow-[6px_6px_0px_0px_var(--neo-accent)] transition-shadow">
                      <h3 className="text-2xl font-black uppercase tracking-tight text-neo-text mb-1">
                        {itemT.title}
                      </h3>
                      {itemT.subtitle && (
                        <div className="font-mono text-neo-accent font-bold mb-2">
                          {itemT.subtitle}
                        </div>
                      )}
                      {itemT.location && (
                        <div className="font-mono text-sm text-neo-text/60 mb-3 flex items-center gap-1">
                          <MapPin size={12} />
                          {itemT.location}
                        </div>
                      )}
                      {itemT.description && (
                        <p className="text-neo-text/80 leading-relaxed">
                          {itemT.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {technicalSkills.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t-4 border-neo-border">
          <SectionHeader
            number="02"
            title={isFr ? 'Compétences' : 'Skills'}
            subtitle={isFr ? 'Expertise Technique' : 'Technical Expertise'}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalSkills.map((skill, idx) => {
              const skillT = t(skill.translations, locale);
              const percent = (skill.level / 5) * 100;

              return (
                <motion.div
                  key={skill.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-neo-surface border-2 border-neo-border p-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold uppercase text-neo-text">{skillT.name}</h4>
                    <span className="font-mono text-xs text-neo-text/60">{skill.level}/5</span>
                  </div>
                  {skill.showAsBar && (
                    <div className="h-3 bg-neo-border/30 border-2 border-neo-border">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className="h-full bg-neo-accent"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Software/Tools Section */}
      {softwareSkills.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t-4 border-neo-border">
          <SectionHeader
            number="03"
            title={isFr ? 'Logiciels' : 'Tools'}
            subtitle={isFr ? 'Outils Maîtrisés' : 'Mastered Tools'}
          />

          <div className="mt-12 flex flex-wrap gap-3">
            {softwareSkills.map((skill, idx) => {
              const skillT = t(skill.translations, locale);
              return (
                <motion.div
                  key={skill.id || idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NeoTag variant="accent" size="lg" className="font-bold">
                    {skillT.name}
                  </NeoTag>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Awards Section */}
      {awardsSection && awardsSection.items.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t-4 border-neo-border">
          <SectionHeader
            number="04"
            title={t(awardsSection.translations, locale).title || (isFr ? 'Récompenses' : 'Awards')}
            subtitle={isFr ? 'Distinctions' : 'Recognition'}
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {awardsSection.items
              .filter(item => item.isActive !== false)
              .sort((a, b) => a.order - b.order)
              .map((item, idx) => {
                const itemT = t(item.translations, locale);

                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-neo-surface border-2 border-neo-border p-6 hover:shadow-[6px_6px_0px_0px_var(--neo-accent)] transition-shadow group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-neo-accent text-neo-text-inverse border-2 border-neo-border">
                        <Award size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black uppercase tracking-tight text-neo-text mb-1">
                          {itemT.title}
                        </h4>
                        {itemT.subtitle && (
                          <div className="font-mono text-sm text-neo-accent font-bold mb-2">
                            {itemT.subtitle}
                          </div>
                        )}
                        {item.startDate && (
                          <div className="font-mono text-xs text-neo-text/60 mb-2">
                            {formatDate(item.startDate, locale)}
                          </div>
                        )}
                        {itemT.description && (
                          <p className="text-sm text-neo-text/80">
                            {itemT.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </section>
      )}

      {/* Languages Section */}
      {languages.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t-4 border-neo-border">
          <SectionHeader
            number="05"
            title={isFr ? 'Langues' : 'Languages'}
            subtitle={isFr ? 'Communication' : 'Communication'}
          />

          <div className="mt-12 flex flex-wrap gap-4">
            {languages.map((lang, idx) => {
              const langT = t(lang.translations, locale);
              return (
                <motion.div
                  key={lang.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-neo-surface border-2 border-neo-border px-6 py-4"
                >
                  <Languages size={20} className="text-neo-accent" />
                  <span className="font-bold uppercase text-neo-text">{langT.name}</span>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="bg-neo-text text-neo-text-inverse py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            {isFr ? 'Intéressé ?' : 'Interested?'}
          </h2>
          <p className="font-mono text-lg mb-8 text-neo-text-inverse/80">
            {isFr ? 'Téléchargez mon CV complet ou contactez-moi directement.' : 'Download my full CV or contact me directly.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
              <BrutalistButton variant="primary" size="lg" icon={<Download size={20} />}>
                {tPage('download')}
              </BrutalistButton>
            </a>
            <a href={`/${locale}/contact`}>
              <BrutalistButton variant="dark" size="lg" icon={<Mail size={20} />}>
                {isFr ? 'Me Contacter' : 'Contact Me'}
              </BrutalistButton>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NeoCVPage;
