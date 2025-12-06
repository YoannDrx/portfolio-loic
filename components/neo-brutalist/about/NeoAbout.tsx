"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Music, Headphones, Mic2, Sliders, ArrowRight, Globe, Building2, BookOpen, Instagram, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { BrutalistButton } from '../ui/BrutalistButton';
import { SectionHeader } from '../ui/SectionHeader';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';
import { NeoTimeline } from './NeoTimeline';
import { Link } from '@/i18n/routing';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as const
    }
  }
};

const photoReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
      delay: 0.2
    }
  }
};

export const NeoAbout = ({ locale }: { locale: string }) => {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  const skills = [
    {
      title: t('skills.composition.title'),
      icon: Music,
      items: t.raw('skills.composition.items') as string[]
    },
    {
      title: t('skills.production.title'),
      icon: Headphones,
      items: t.raw('skills.production.items') as string[]
    },
    {
      title: t('skills.vocalProduction.title'),
      icon: Mic2,
      items: t.raw('skills.vocalProduction.items') as string[]
    },
    {
      title: t('skills.postProduction.title'),
      icon: Sliders,
      items: t.raw('skills.postProduction.items') as string[]
    }
  ];

  const stats = [
    { val: '16', label: t('achievements.albums') },
    { val: '34', label: t('achievements.projects') },
    { val: '50+', label: t('achievements.collaborations') },
    { val: '15+', label: t('achievements.years') }
  ];

  const labels = [
    {
      name: 'Infinity Scores',
      publisher: 'Cezame Music Agency',
      since: '2019',
      tracks: '45+',
      type: 'Label',
      links: [
        { icon: ExternalLink, url: 'https://www.cezamemusic.com/infinity-scores-label-141693.html', label: 'Cezame' },
        { icon: Linkedin, url: 'https://www.linkedin.com/company/cezame-music-agency/', label: 'Cezame LinkedIn' },
        { icon: Instagram, url: 'https://www.instagram.com/infinityscores/', label: 'Instagram' },
        { icon: Linkedin, url: 'https://www.linkedin.com/company/infinity-scores/', label: 'LinkedIn' }
      ]
    },
    {
      name: 'Montmorency Music',
      publisher: 'MYMA',
      since: '2020',
      tracks: '28+',
      type: 'Label',
      links: [
        { icon: ExternalLink, url: 'https://www.myma-music.com/', label: 'Website' },
        { icon: Linkedin, url: 'https://www.linkedin.com/company/mymasync/', label: 'LinkedIn' },
        { icon: Instagram, url: 'https://www.instagram.com/myma_music/', label: 'Instagram' },
        { icon: Youtube, url: 'https://www.youtube.com/channel/UCYDtNY3_1G30BVuTK_qbLuQ', label: 'YouTube' }
      ]
    },
    {
      name: 'Justement Music',
      publisher: 'Self-published',
      since: '2018',
      tracks: '60+',
      type: 'Label',
      links: [
        { icon: Youtube, url: 'https://www.youtube.com/playlist?list=PLJlRZETQILeOzFn01l_GqRtPoDWGtGdcg', label: 'YouTube' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-32">

        {/* HERO BIO - Split Layout */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-12 items-center min-h-[70vh]"
          >
            {/* Colonne GAUCHE - Tout le contenu texte (3/5) */}
            <motion.div variants={fadeInUp} className="order-2 lg:order-1 lg:col-span-3">
              {/* Badge */}
              <div className="font-mono font-bold text-neo-accent mb-6 flex items-center gap-2">
                <span className="bg-neo-text text-neo-accent px-2 py-1">BIO.01</span>
                <span className="text-neo-text/60">// {t('title').toUpperCase()}</span>
              </div>

              {/* Titre */}
              <h1 className="text-[12vw] lg:text-[6vw] leading-[0.85] font-black uppercase tracking-tighter mb-8 text-neo-text">
                Loïc{' '}
                <span
                  className="text-transparent block lg:inline"
                  style={{ WebkitTextStroke: '2px var(--neo-text)', color: 'transparent' }}
                >
                  Ghanem
                </span>
              </h1>

              {/* Bio */}
              <div className="text-base md:text-lg font-medium leading-relaxed space-y-4 border-l-4 border-neo-accent pl-6 mb-8">
                <p>{t('bio.paragraph1')}</p>
                <p className="opacity-80">{t('bio.paragraph2')}</p>
                <p className="opacity-80">{t('bio.paragraph3')}</p>
                <p className="opacity-70">{t('bio.paragraph4')}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                  <BrutalistButton variant="primary" size="lg" icon={<Download size={18} />}>
                    {t('cta.downloadCV')}
                  </BrutalistButton>
                </a>
                <Link href="/contact">
                  <BrutalistButton variant="secondary" size="lg" icon={<Mail size={18} />}>
                    {t('cta.contactMe')}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>

            {/* Colonne DROITE - Photo (2/5) */}
            <motion.div
              variants={photoReveal}
              className="relative order-1 lg:order-2 w-full lg:col-span-2"
            >
              <div className="relative max-w-xs lg:max-w-sm mx-auto lg:mx-0">
                {/* Card avec effet hover comme les cartes d'expertise */}
                <div className="group border-2 border-neo-border bg-neo-surface overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(var(--neo-accent-rgb),1)] hover:border-black">
                  <div className="relative w-full" style={{ paddingBottom: '133%' }}>
                    <Image
                      src="/img/slider/loic-studio-front.jpg"
                      alt="Loïc Ghanem"
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />
                    {/* Location badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 bg-neo-accent text-neo-text-inverse p-4 font-mono text-sm font-bold flex items-center gap-3 z-10"
                    >
                      <MapPin className="w-5 h-5" />
                      PARIS, FRANCE
                    </motion.div>
                  </div>
                </div>

                {/* Decorative elements with staggered animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                  className="hidden lg:block absolute -bottom-6 -right-6 w-32 h-32 border-4 border-neo-accent -z-10"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
                  className="hidden lg:block absolute -top-6 -left-6 w-20 h-20 bg-neo-accent -z-10"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* STATS */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-16 mb-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center">
                  <span className="text-6xl md:text-7xl font-black text-neo-accent tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-widest mt-2 opacity-60">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SKILLS GRID */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <SectionHeader number="02" title={t('skills.title')} subtitle={t('skills.subtitle')} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {skills.map((skill, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <NeoCard
                  hover="lift"
                  padding="lg"
                  className="h-full cursor-crosshair group hover:bg-neo-accent"
                >
                  <skill.icon
                    size={40}
                    className="mb-6 text-neo-accent group-hover:text-neo-text transition-colors"
                  />
                  <h3 className="text-2xl font-black uppercase mb-4 text-neo-text group-hover:text-neo-text-inverse transition-colors">
                    {skill.title}
                  </h3>
                  <ul className="font-mono text-sm space-y-2 opacity-80">
                    {skill.items.map((item: string) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 group-hover:text-neo-text-inverse transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-neo-text group-hover:bg-neo-text-inverse" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </NeoCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TIMELINE - Parcours Professionnel */}
        <NeoTimeline />

        {/* LABELS & PUBLISHERS - Enriched */}
        <section className="py-24 bg-neo-surface">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader
              number="04"
              title={t('labelsPublishers.title')}
              subtitle={t('labelsPublishers.subtitle')}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {labels.map((label, i) => (
                <motion.div key={label.name} variants={fadeInUp}>
                  <NeoCard
                    hover="lift"
                    padding="lg"
                    className="h-full group"
                  >
                    {/* Label Initials */}
                    <div className="w-16 h-16 bg-neo-accent flex items-center justify-center mb-6 border-2 border-neo-border">
                      <span className="text-2xl font-black text-neo-text-inverse">
                        {label.name.split(' ').map(w => w[0]).join('')}
                      </span>
                    </div>

                    {/* Label Name */}
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-neo-text">
                      {label.name}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3 font-mono text-sm mb-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-neo-accent" />
                        <span className="opacity-70">{label.publisher}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-neo-accent" />
                        <span className="opacity-70">{label.tracks} tracks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-neo-text text-neo-text-inverse px-2 py-1">
                          Since {label.since}
                        </span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-neo-border">
                      {label.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-neo-text hover:bg-neo-accent flex items-center justify-center transition-colors group/link"
                          title={link.label}
                        >
                          <link.icon className="w-4 h-4 text-neo-accent group-hover/link:text-neo-text-inverse transition-colors" />
                        </a>
                      ))}
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-neo-accent opacity-20 group-hover:opacity-40 transition-opacity" />
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="py-24 bg-neo-text">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <NeoCard
                hover="none"
                variant="inverted"
                padding="lg"
                className="text-center"
              >
                <Globe className="w-16 h-16 mx-auto mb-6 text-neo-accent" />
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-neo-text-inverse">
                  {t('cta.title')}
                </h2>
                <p className="font-mono text-lg mb-8 max-w-2xl mx-auto text-neo-text-inverse/60">
                  {t('cta.description')}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <BrutalistButton variant="dark" size="lg" icon={<Mail size={18} />}>
                      {t('cta.contactMe')}
                    </BrutalistButton>
                  </Link>
                  <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                    <BrutalistButton variant="dark" size="lg" icon={<Download size={18} />}>
                      {t('cta.downloadCV')}
                    </BrutalistButton>
                  </a>
                </div>
              </NeoCard>
            </motion.div>
          </div>
        </section>

      </main>
      <NeoFooter />
    </div>
  );
};

export default NeoAbout;
