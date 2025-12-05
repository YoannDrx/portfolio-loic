"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Layers,
  Eye,
  Mail,
  Zap,
  Check,
  Play,
  ChevronRight,
  Sparkles,
  Clock,
  Target,
  Headphones,
  MessageSquare,
  Send,
  Music,
  Wand2
} from 'lucide-react';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';
import { BrutalistButton } from '../ui/BrutalistButton';

interface Service {
  id: string;
  no: string;
  title: string;
  text: string;
  largeImg: string;
  largeTitle: string;
  poster: string;
  date: string;
  author: string;
  fullDescription: string;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface NeoServiceDetailProps {
  service: Service;
  allServices: Service[];
  locale: string;
  isPreview?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const } }
};

// Process steps avec icônes
const processSteps = [
  { icon: MessageSquare, key: 'brief' },
  { icon: Wand2, key: 'composition' },
  { icon: Headphones, key: 'production' },
  { icon: Sparkles, key: 'mixing' },
  { icon: Send, key: 'delivery' }
];

// What you get items
const whatYouGetItems = [
  { icon: Music, labelKey: 'originalMusic' },
  { icon: Clock, labelKey: 'fastDelivery' },
  { icon: Target, labelKey: 'unlimitedRevisions' },
  { icon: Zap, labelKey: 'proQuality' }
];

export default function NeoServiceDetail({
  service,
  allServices,
  locale,
  isPreview = false,
}: NeoServiceDetailProps) {
  const t = useTranslations('services');
  const tDetail = useTranslations('services.detail');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<'about' | 'process' | 'examples'>('about');
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // Filter related services (excluding current)
  const relatedServices = allServices
    .filter(s => s.id !== service.id)
    .slice(0, 2);

  const description = locale === 'fr'
    ? (service.descriptionsFr || service.fullDescription)
    : (service.descriptionsEn || service.fullDescription);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10">
        {/* Preview Banner */}
        {isPreview && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase">
                Prévisualisation - {service.published ? 'Publié' : 'Brouillon'}
              </span>
            </div>
          </div>
        )}

        {/* ============================================
            HERO SECTION - Full Width Immersive
        ============================================ */}
        <section className="relative min-h-[80vh] flex items-end overflow-hidden pt-20">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            {service.largeImg ? (
              <Image
                src={service.largeImg}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neo-bg via-neo-surface to-neo-bg-alt" />
            )}
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neo-bg via-neo-bg/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-neo-bg/90 via-transparent to-neo-bg/50" />
          </div>

          {/* Giant Service Number - Background Element */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.05, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          >
            <span className="text-[40vw] font-black leading-none text-neo-text">
              {service.no}
            </span>
          </motion.div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 md:px-6 relative z-10 pb-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-4xl"
            >
              {/* Back Button */}
              <motion.div variants={fadeInUp} className="mb-8">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group bg-neo-bg/80 backdrop-blur-sm px-4 py-2 border-2 border-neo-border"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  {tCommon('backToServices')}
                </Link>
              </motion.div>

              {/* Service Badge */}
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex items-center gap-3">
                  <span className="bg-neo-accent text-neo-text-inverse px-4 py-2 font-mono text-lg font-black">
                    N°{service.no}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-wider opacity-60">
                    // SERVICE
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-[12vw] md:text-[8vw] lg:text-[6vw] font-black uppercase tracking-tighter leading-[0.85] mb-8"
              >
                {service.largeTitle || service.title}
              </motion.h1>

              {/* Tagline */}
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl font-medium max-w-2xl opacity-80 mb-10"
              >
                {service.text}
              </motion.p>

              {/* Quick CTA */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <BrutalistButton variant="primary" size="lg" icon={<Mail size={20} />}>
                    {tDetail('requestQuote')}
                  </BrutalistButton>
                </Link>
                <button
                  onClick={() => setActiveTab('process')}
                  className="group flex items-center gap-2 font-mono text-sm font-bold uppercase border-2 border-neo-border px-6 py-3 hover:bg-neo-text hover:text-neo-text-inverse transition-all"
                >
                  <Play size={16} className="group-hover:scale-110 transition-transform" />
                  {tDetail('process')}
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-0 left-0 right-0 h-2 bg-neo-accent origin-left"
          />
        </section>

        {/* ============================================
            BENTO GRID - Key Info
        ============================================ */}
        <section className="py-16 border-b-4 border-neo-border">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Stat Cards */}
              {[
                { value: '15+', label: t('stats.experience'), icon: Clock },
                { value: '150+', label: t('stats.projects'), icon: Target },
                { value: '98%', label: t('stats.satisfaction'), icon: Sparkles },
                { value: '24h', label: 'Response', icon: Zap }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="group"
                >
                  <NeoCard
                    hover="lift"
                    padding="lg"
                    className="text-center h-full group-hover:bg-neo-accent transition-colors duration-300"
                  >
                    <stat.icon className="w-6 h-6 mx-auto mb-3 text-neo-accent group-hover:text-neo-text-inverse transition-colors" />
                    <p className="text-3xl md:text-4xl font-black text-neo-text group-hover:text-neo-text-inverse transition-colors">
                      {stat.value}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-wider opacity-60 mt-2 group-hover:text-neo-text-inverse group-hover:opacity-80 transition-all">
                      {stat.label}
                    </p>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ============================================
            TABBED CONTENT - Interactive Sections
        ============================================ */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-12">
              {(['about', 'process', 'examples'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-mono text-sm font-bold uppercase border-4 transition-all ${
                    activeTab === tab
                      ? 'bg-neo-text text-neo-text-inverse border-neo-text shadow-[4px_4px_0px_0px_var(--neo-accent)]'
                      : 'border-neo-border hover:border-neo-text hover:shadow-[4px_4px_0px_0px_var(--neo-border)]'
                  }`}
                >
                  {tDetail(tab)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                >
                  {/* Main Description - Takes 3 cols */}
                  <div className="lg:col-span-3">
                    <NeoCard padding="lg" className="h-full">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-neo-accent text-neo-text-inverse px-3 py-1 font-mono text-xs font-bold">
                          01
                        </span>
                        <h2 className="text-2xl font-black uppercase">{tDetail('about')}</h2>
                      </div>
                      <div
                        className="prose prose-lg max-w-none text-neo-text leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </NeoCard>
                  </div>

                  {/* What You Get - Takes 2 cols */}
                  <div className="lg:col-span-2 space-y-4">
                    <NeoCard padding="lg" className="bg-neo-text text-neo-text-inverse">
                      <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Check className="w-5 h-5 text-neo-accent" />
                        {tDetail('whatYouGet')}
                      </h3>
                      <ul className="space-y-4">
                        {[
                          'Musique originale 100% sur mesure',
                          'Livraison rapide',
                          'Révisions illimitées',
                          'Qualité professionnelle',
                          'Droits complets inclus'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                            <span className="w-6 h-6 bg-neo-accent text-neo-text flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                              {i + 1}
                            </span>
                            <span className="font-mono text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </NeoCard>

                    {/* Quick Contact Card */}
                    <NeoCard padding="lg" hover="lift" className="group cursor-pointer" onClick={() => window.location.href = '/contact'}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-xs uppercase opacity-60 mb-1">Ready?</p>
                          <p className="font-black text-lg uppercase">{tDetail('requestQuote')}</p>
                        </div>
                        <ChevronRight className="w-8 h-8 text-neo-accent group-hover:translate-x-2 transition-transform" />
                      </div>
                    </NeoCard>
                  </div>
                </motion.div>
              )}

              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Process Timeline */}
                  <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-neo-border hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      {processSteps.map((step, i) => (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onMouseEnter={() => setHoveredStep(i)}
                          onMouseLeave={() => setHoveredStep(null)}
                          className="relative"
                        >
                          <NeoCard
                            padding="lg"
                            className={`text-center transition-all duration-300 ${
                              hoveredStep === i
                                ? 'bg-neo-accent text-neo-text-inverse border-neo-accent -translate-y-2 shadow-[8px_8px_0px_0px_var(--neo-shadow)]'
                                : ''
                            }`}
                          >
                            {/* Step Number */}
                            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center font-mono text-sm font-black ${
                              hoveredStep === i
                                ? 'bg-neo-text text-neo-accent'
                                : 'bg-neo-accent text-neo-text-inverse'
                            }`}>
                              {i + 1}
                            </div>

                            <step.icon className={`w-10 h-10 mx-auto mb-4 ${
                              hoveredStep === i ? 'text-neo-text-inverse' : 'text-neo-accent'
                            }`} />

                            <h3 className="font-black uppercase text-lg mb-2">
                              {t(`process.${step.key}.title`)}
                            </h3>
                            <p className={`font-mono text-xs ${
                              hoveredStep === i ? 'opacity-80' : 'opacity-60'
                            }`}>
                              {t(`process.${step.key}.description`)}
                            </p>
                          </NeoCard>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Process CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                  >
                    <p className="font-mono text-lg mb-6 opacity-70">
                      {t('cta.description')}
                    </p>
                    <Link href="/contact">
                      <BrutalistButton variant="primary" size="lg" icon={<Mail size={20} />}>
                        {t('cta.discuss')}
                      </BrutalistButton>
                    </Link>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'examples' && (
                <motion.div
                  key="examples"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <NeoCard padding="lg" className="text-center py-16">
                    <Layers className="w-16 h-16 mx-auto mb-6 opacity-20" />
                    <h3 className="text-2xl font-black uppercase mb-4">{tDetail('examples')}</h3>
                    <p className="font-mono opacity-60 max-w-md mx-auto mb-8">
                      Découvrez mes réalisations dans la section albums et vidéos.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Link href="/albums">
                        <BrutalistButton variant="secondary">
                          Voir les albums
                        </BrutalistButton>
                      </Link>
                      <Link href="/videos">
                        <BrutalistButton variant="secondary">
                          Voir les vidéos
                        </BrutalistButton>
                      </Link>
                    </div>
                  </NeoCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ============================================
            RELATED SERVICES - Horizontal Scroll Cards
        ============================================ */}
        {relatedServices.length > 0 && (
          <section className="py-24 bg-neo-surface border-y-4 border-neo-border">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <span className="bg-neo-text text-neo-accent px-3 py-1 font-mono text-xs font-bold">
                    ALSO
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                    {tDetail('relatedServices')}
                  </h2>
                </div>
                <Link href="/services" className="hidden md:block">
                  <BrutalistButton variant="secondary" size="sm">
                    {tCommon('viewAll')}
                  </BrutalistButton>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedServices.map((relatedService, i) => (
                  <Link
                    key={relatedService.id}
                    href={{ pathname: '/services/[id]', params: { id: relatedService.id } }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <NeoCard
                        hover="lift"
                        padding="lg"
                        className="group h-full flex flex-col md:flex-row gap-6 items-start"
                      >
                        {/* Service Number - Large */}
                        <div className="w-20 h-20 bg-neo-text text-neo-accent flex items-center justify-center font-black text-3xl flex-shrink-0 group-hover:bg-neo-accent group-hover:text-neo-text-inverse transition-colors">
                          {relatedService.no}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-neo-accent transition-colors">
                            {relatedService.title}
                          </h3>
                          <p className="font-mono text-sm opacity-60 line-clamp-2 mb-4">
                            {relatedService.text}
                          </p>
                          <span className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-neo-accent group-hover:gap-4 transition-all">
                            {tCommon('learnMore')}
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </NeoCard>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================================
            FINAL CTA - Bold & Engaging
        ============================================ */}
        <section className="py-32 bg-neo-text relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-40 h-40 border-8 border-neo-accent rotate-12" />
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-neo-accent rotate-45" />
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-neo-accent" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <NeoTag variant="accent" size="lg" className="mb-8">
                <Zap className="w-4 h-4 mr-2" />
                {tDetail('pricing')}
              </NeoTag>

              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-neo-text-inverse">
                {tDetail('startingFrom')}
                <span className="block text-neo-accent">Sur Devis</span>
              </h2>

              <p className="font-mono text-xl text-neo-text-inverse/60 max-w-2xl mx-auto mb-12">
                {tDetail('customizable')}
              </p>

              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/contact">
                  <BrutalistButton variant="dark" size="lg" icon={<Mail size={20} />}>
                    {tDetail('requestQuote')}
                  </BrutalistButton>
                </Link>
                <Link href="/services">
                  <BrutalistButton variant="dark" size="lg">
                    {tDetail('backToServices')}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
}
