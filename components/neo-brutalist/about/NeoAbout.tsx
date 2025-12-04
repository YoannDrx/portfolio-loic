"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Download, Mail, MapPin, Music, Headphones, Mic2, Sliders, ArrowRight } from 'lucide-react';
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
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

        {/* HERO BIO */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="font-mono font-bold text-neo-accent mb-4 flex items-center gap-2">
              <span className="bg-neo-text text-neo-accent px-2 py-1">BIO.01</span>
              <span className="text-neo-text/60">// {t('title').toUpperCase()}</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-[10vw] leading-[0.85] font-black uppercase tracking-tighter mb-12 text-neo-text break-words"
            >
              Loïc <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '2px var(--neo-text)', color: 'transparent' }}
              >
                Ghanem
              </span>
            </motion.h1>

            {/* Grid inversé : texte à gauche, photo à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Colonne GAUCHE - Texte */}
              <motion.div
                variants={fadeInUp}
                className="text-lg md:text-xl font-medium leading-relaxed space-y-6 border-l-4 border-neo-accent pl-8 order-2 lg:order-1"
              >
                <p>{t('bio.paragraph1')}</p>
                <p>{t('bio.paragraph2')}</p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                    <BrutalistButton variant="primary" icon={<Download size={18} />}>
                      {t('cta.downloadCV')}
                    </BrutalistButton>
                  </a>
                  <Link href="/contact">
                    <BrutalistButton variant="secondary" icon={<Mail size={18} />}>
                      {t('cta.contactMe')}
                    </BrutalistButton>
                  </Link>
                </div>
              </motion.div>

              {/* Colonne DROITE - Photo */}
              <motion.div
                variants={fadeInUp}
                className="relative order-1 lg:order-2"
              >
                <NeoCard hover="lift" padding="sm" className="bg-neo-surface">
                  <div className="aspect-[4/5] bg-neo-bg-alt relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url('/img/slider/loic-studio-front.jpg')" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-neo-accent text-neo-text-inverse p-3 font-mono text-xs font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      PARIS, FRANCE
                    </div>
                  </div>
                </NeoCard>
              </motion.div>
            </div>
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
                  <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-neo-text-inverse transition-colors">
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
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
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
                    <h3 className="font-black uppercase text-xl mb-4 border-b-2 border-neo-border pb-2">
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
