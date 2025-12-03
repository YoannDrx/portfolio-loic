'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Award, Users, Building2, Sparkles, Download, MapPin, Mail, Languages,
  Music, Headphones, Mic2, Sliders
} from 'lucide-react';

import ImmersivePage, { ImmersiveSection, ImmersiveTitle } from '@/components/immersive/ImmersivePage';
import GlowingStats from '@/components/immersive/GlowingStats';
import MagneticButton from '@/components/immersive/MagneticButton';
import AboutScene from '@/components/three/scenes/AboutScene';
import Timeline from '@/components/about/Timeline';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

/* ============================================
   TYPES
   ============================================ */

interface AboutPageClientProps {
  locale: string;
}

/* ============================================
   HEADER SECTION - SPLIT LAYOUT
   ============================================ */

function HeaderSection() {
  const t = useTranslations('about');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-4 sm:py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Text Content in Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            {/* Glass Card Container - Only visible on mobile/tablet */}
            <div className="relative rounded-2xl lg:rounded-none overflow-hidden bg-obsidian-900/60 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border border-emerald-400/20 lg:border-transparent">
              {/* Subtle gradient overlay - hidden on desktop */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-teal-400/5 pointer-events-none lg:hidden" />

              {/* Content */}
              <div className="relative p-5 lg:p-0">
                {/* Subtitle + Title grouped together */}
                <div className="mb-3 sm:mb-4">
                  <motion.span
                    className="inline-block text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-emerald-400 mb-0.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Compositeur & Producteur Musical
                  </motion.span>

                  {/* Title */}
                  <motion.h1
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="bg-gradient-to-r from-white via-emerald-400 to-white bg-clip-text text-transparent">
                      {t('title')}
                    </span>
                  </motion.h1>
                </div>

                {/* Intro text */}
                <motion.p
                  className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <span className="text-white font-semibold">{t('intro')}</span>{' '}
                  {t('bio.paragraph1')}
                </motion.p>

                {/* Quick stats inline */}
                <motion.div
                  className="flex flex-wrap gap-3 sm:gap-5 mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-sm sm:text-lg font-black text-obsidian-950">
                      16
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{t('achievements.albums')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-sm sm:text-lg font-black text-obsidian-950">
                      34
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{t('achievements.projects')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center text-sm sm:text-lg font-black text-obsidian-950">
                      15+
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">{t('achievements.years')}</span>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-wrap gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <MagneticButton href="/contact" color="emerald" variant="solid" size="md" glow>
                    {t('cta.contactMe')}
                  </MagneticButton>
                  <MagneticButton href="/albums" color="teal" variant="outline" size="md">
                    {t('cta.viewAlbums')}
                  </MagneticButton>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Image (Hidden on mobile for cleaner layout) */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-3xl blur-2xl" />

            {/* Image container */}
            <div className="relative rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-2xl">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/img/slider/loic-studio-front.jpg"
                  alt="Loïc Ghanem in studio"
                  fill
                  className="object-cover"
                  style={{ objectPosition: '50% 35%' }}
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-teal-400/10" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute bottom-6 left-6 right-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="bg-obsidian-900/80 backdrop-blur-sm border border-[var(--glass-border)] rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-400/20 border border-emerald-400/30">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('contactInfo.address')}</p>
                      <p className="text-foreground font-semibold">{t('contactInfo.location')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   BIO SECTION
   ============================================ */

function BioSection() {
  const t = useTranslations('about');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <ImmersiveSection className="py-12 sm:py-20">
      <div ref={ref} className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Bio */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard variant="neon" className="h-full">
              <GlassCardContent className="p-5 sm:p-8 md:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="w-10 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                  À propos
                </h2>
                <div className="space-y-4 sm:space-y-5 text-foreground/85 text-base sm:text-lg leading-relaxed">
                  <p>{t('bio.paragraph2')}</p>
                  <p>{t('bio.paragraph3')}</p>
                  <p className="text-emerald-400 font-medium border-l-4 border-emerald-400/50 pl-5 italic">
                    {t('bio.paragraph4')}
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <GlassCard variant="default" className="border-emerald-400/30">
              <GlassCardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-5">{t('contactInfo.title')}</h3>
                <div className="space-y-4">
                  <ContactInfoItem
                    icon={Mail}
                    label={t('contactInfo.email')}
                    value="loic.ghanem@outlook.com"
                    color="teal"
                    href="mailto:loic.ghanem@outlook.com"
                  />
                  <ContactInfoItem
                    icon={Languages}
                    label={t('contactInfo.languages')}
                    value={t('contactInfo.languageList')}
                    color="cyan"
                  />
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Labels & Publishers */}
            <GlassCard variant="subtle" className="border-teal-400/20">
              <GlassCardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">{t('labelsPublishers.title')}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-emerald-400 mb-2">{t('labelsPublishers.labels')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Infinity Scores (Cezame)</li>
                      <li>Montmorency Music (MYMA)</li>
                      <li>Justement Music</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-teal-400 mb-2">{t('labelsPublishers.publishers')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Cezame Music Agency</li>
                      <li>Montmorency Music Agency</li>
                    </ul>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </ImmersiveSection>
  );
}

/* ============================================
   HELPER COMPONENTS
   ============================================ */

interface ContactInfoItemProps {
  icon: typeof MapPin;
  label: string;
  value: string;
  color: 'emerald' | 'teal' | 'lime' | 'cyan';
  href?: string;
}

function ContactInfoItem({ icon: Icon, label, value, color, href }: ContactInfoItemProps) {
  const colorClasses = {
    emerald: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400',
    teal: 'bg-teal-400/10 border-teal-400/30 text-teal-400',
    lime: 'bg-neon-lime/10 border-neon-lime/30 text-neon-lime',
    cyan: 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan',
  };

  const Content = (
    <div className="flex items-start gap-3">
      <div className={cn('p-2 rounded-lg border flex-shrink-0', colorClasses[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className={cn('font-medium text-sm break-words', href ? 'text-foreground hover:text-emerald-400 transition-colors' : 'text-foreground')}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{Content}</a>;
  }

  return Content;
}

/* ============================================
   SKILLS SECTION
   ============================================ */

function SkillsSection() {
  const t = useTranslations('about');

  const skills = [
    {
      icon: Music,
      title: t('skills.composition.title'),
      skills: ['Metal', 'Hip-Hop', 'Ambient', 'Electronic', 'Orchestral'],
      color: 'emerald' as const,
    },
    {
      icon: Headphones,
      title: t('skills.production.title'),
      skills: ['Mixing', 'Mastering', 'Sound Design', 'Arrangement'],
      color: 'teal' as const,
    },
    {
      icon: Mic2,
      title: t('skills.vocalProduction.title'),
      skills: ['Direction', 'Recording', 'Editing', 'Processing'],
      color: 'cyan' as const,
    },
    {
      icon: Sliders,
      title: t('skills.postProduction.title'),
      skills: ['Film Scoring', 'TV Music', 'Ads', 'Game Audio'],
      color: 'lime' as const,
    },
  ];

  return (
    <ImmersiveSection>
      <div className="max-w-6xl mx-auto px-4">
        <ImmersiveTitle subtitle="Expertise" gradient="teal">
          {t('skills.title')}
        </ImmersiveTitle>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
          {skills.map((skill, index) => (
            <SkillCard key={skill.title} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </ImmersiveSection>
  );
}

interface SkillCardProps {
  skill: {
    icon: typeof Music;
    title: string;
    skills: string[];
    color: 'emerald' | 'teal' | 'cyan' | 'lime';
  };
  index: number;
}

function SkillCard({ skill, index }: SkillCardProps) {
  const Icon = skill.icon;

  const colorConfig = {
    emerald: {
      icon: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      border: 'border-emerald-400/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,193,139,0.3)]',
    },
    teal: {
      icon: 'text-teal-400',
      bg: 'bg-teal-400/10',
      border: 'border-teal-400/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,153,152,0.3)]',
    },
    cyan: {
      icon: 'text-neon-cyan',
      bg: 'bg-neon-cyan/10',
      border: 'border-neon-cyan/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    },
    lime: {
      icon: 'text-neon-lime',
      bg: 'bg-neon-lime/10',
      border: 'border-neon-lime/30',
      glow: 'group-hover:shadow-[0_0_30px_rgba(213,255,10,0.3)]',
    },
  };

  const config = colorConfig[skill.color];

  return (
    <motion.div
      className={cn(
        'group relative p-4 sm:p-6 rounded-xl sm:rounded-2xl',
        'bg-obsidian-900/50 backdrop-blur-sm border',
        'transition-all duration-500',
        config.border,
        config.glow
      )}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      style={{ transformPerspective: 1000 }}
    >
      {/* Icon */}
      <motion.div
        className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-5', config.bg)}
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', config.icon)} />
      </motion.div>

      {/* Title */}
      <h3 className="text-sm sm:text-lg font-bold text-foreground mb-2 sm:mb-3">{skill.title}</h3>

      {/* Skills list */}
      <ul className="space-y-1 sm:space-y-1.5">
        {skill.skills.map((item, i) => (
          <motion.li
            key={item}
            className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + i * 0.05 }}
          >
            <span className={cn('w-1.5 h-1.5 rounded-full', config.bg, config.icon)} />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ============================================
   TIMELINE SECTION
   ============================================ */

function TimelineSection() {
  const t = useTranslations('about');

  return (
    <ImmersiveSection className="py-12 sm:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <ImmersiveTitle subtitle="Parcours" gradient="emerald">
          {t('timeline.title')}
        </ImmersiveTitle>

        <div className="mt-12">
          <Timeline />
        </div>
      </div>
    </ImmersiveSection>
  );
}

/* ============================================
   STATS SECTION
   ============================================ */

function StatsSection() {
  const t = useTranslations('about');

  const stats = [
    { value: 16, label: t('achievements.albums'), icon: Award, color: 'emerald' as const },
    { value: 34, label: t('achievements.projects'), icon: Sparkles, color: 'teal' as const },
    { value: 50, suffix: '+', label: 'Collaborations', icon: Users, color: 'cyan' as const },
    { value: 15, suffix: '+', label: t('achievements.years'), icon: Building2, color: 'lime' as const },
  ];

  return (
    <ImmersiveSection className="py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <GlowingStats stats={stats} columns={4} />
      </div>
    </ImmersiveSection>
  );
}

/* ============================================
   CTA SECTION
   ============================================ */

function CTASection({ locale }: { locale: string }) {
  const t = useTranslations('about');

  return (
    <ImmersiveSection className="py-12 sm:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-3xl blur-lg opacity-20" />

          <GlassCard variant="neon" className="relative">
            <GlassCardContent className="p-6 sm:p-10 md:p-14 text-center">
              <motion.h2
                className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter mb-4 sm:mb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  {t('cta.title')}
                </span>
              </motion.h2>

              <motion.p
                className="text-base sm:text-lg text-foreground/85 mb-6 sm:mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                {t('cta.description')}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <MagneticButton href="/contact" color="emerald" variant="solid" size="lg" glow>
                  {t('cta.contactMe')}
                </MagneticButton>
                <MagneticButton href="/albums" color="teal" variant="outline" size="lg">
                  {t('cta.viewAlbums')}
                </MagneticButton>
                <MagneticButton
                  href={`/api/cv/download?locale=${locale}`}
                  external
                  color="cyan"
                  variant="outline"
                  size="lg"
                  leftIcon={Download}
                >
                  {t('cta.downloadCV')}
                </MagneticButton>
              </motion.div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </ImmersiveSection>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  return (
    <ImmersivePage
      scene={<AboutScene />}
      gradient="emerald"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      <HeaderSection />
      <BioSection />
      <SkillsSection />
      <TimelineSection />
      <StatsSection />
      <CTASection locale={locale} />
    </ImmersivePage>
  );
}
