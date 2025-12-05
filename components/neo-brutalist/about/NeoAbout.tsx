"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Music, Headphones, Mic2, Sliders, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { BrutalistButton } from '../ui/BrutalistButton';
import { SectionHeader } from '../ui/SectionHeader';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';
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
    { val: '50+', label: 'Collaborations' },
    { val: '15+', label: t('achievements.years') }
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]"
          >
            {/* Colonne GAUCHE - Tout le contenu texte */}
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
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
              <div className="text-lg md:text-xl font-medium leading-relaxed space-y-6 border-l-4 border-neo-accent pl-6 mb-8">
                <p>{t('bio.paragraph1')}</p>
                <p className="opacity-80">{t('bio.paragraph2')}</p>
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

            {/* Colonne DROITE - Photo */}
            <motion.div
              variants={photoReveal}
              className="relative order-1 lg:order-2 w-full"
            >
              <div className="relative max-w-sm lg:max-w-md mx-auto lg:mx-0">
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
          <SectionHeader number="02" title={t('skills.title')} subtitle="Compétences Techniques" />

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

        {/* CONTACT INFO */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <NeoCard
              hover="none"
              padding="lg"
              className="shadow-[12px_12px_0px_0px_var(--neo-accent)]"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <NeoTag variant="default" className="mb-4">
                    {t('contactInfo.title')}
                  </NeoTag>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6 text-neo-text">
                    Travaillons <br /> Ensemble
                  </h2>
                  <p className="font-mono text-lg mb-8 max-w-md opacity-70">
                    {t('bio.paragraph4')}
                  </p>
                  <div className="space-y-4 font-mono font-bold">
                    <a
                      href="mailto:loic.ghanem@outlook.com"
                      className="flex items-center gap-4 p-4 border-2 border-neo-border hover:bg-neo-bg-alt transition-colors"
                    >
                      <Mail className="text-neo-accent" />
                      loic.ghanem@outlook.com
                    </a>
                    <div className="flex items-center gap-4 p-4 border-2 border-neo-border">
                      <MapPin className="text-neo-accent" />
                      Paris, France
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link href="/contact">
                      <BrutalistButton variant="primary" icon={<ArrowRight size={18} />}>
                        {tCommon('contact')}
                      </BrutalistButton>
                    </Link>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="border-2 border-neo-border p-6 bg-neo-bg-alt">
                    <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-neo-border pb-2 text-neo-text">
                      Labels & Publishers
                    </h3>
                    <ul className="space-y-3 font-mono text-sm">
                      {[
                        { name: 'Infinity Scores', pub: 'Cezame' },
                        { name: 'Montmorency Music', pub: 'MYMA' },
                        { name: 'Justement Music', pub: '--' },
                      ].map((label) => (
                        <li key={label.name} className="flex justify-between">
                          <span>{label.name}</span>
                          <span className="opacity-50">{label.pub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </NeoCard>
          </motion.div>
        </section>

      </main>
      <NeoFooter />
    </div>
  );
};

export default NeoAbout;
