'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getServicesData } from '@/data/servicesData';
import { GlassCard, GlassCardHeader, GlassCardContent } from '@/components/ui/GlassCard';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { Music2, Headphones, Radio, Mic, Sliders, Disc3, X, User, Calendar } from 'lucide-react';
import type { Service } from '@/types';

const serviceIcons = [Music2, Headphones, Radio, Mic, Sliders, Disc3];

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();
  const servicesData = getServicesData(locale);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian via-obsidian-50 to-obsidian py-20">
      <div className="container-custom">
        {/* Hero Section */}
        <AnimatedSection variant="fadeIn" className="text-center mb-16">
          <AnimatedText
            text={t('pageTitle')}
            className="mb-6 text-6xl md:text-7xl font-black text-gradient-neon"
            type="word"
          />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('pageDescription')}
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <AnimatedSection
                key={service.id}
                variant="slideUp"
                delay={index * 0.1}
              >
                <GlassCard
                  variant="default"
                  hover
                  className="h-full flex flex-col group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedService(service)}
                >
                  {/* Service Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian-50">
                    <Image
                      src={service.poster}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Service Number Badge on Image */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-obsidian/80 backdrop-blur-sm border border-neon-cyan/30 flex items-center justify-center">
                      <span className="text-xl font-black text-neon-cyan group-hover:text-neon-magenta transition-colors">
                        {service.no}
                      </span>
                    </div>

                    {/* Icon on Image */}
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-obsidian/80 backdrop-blur-sm border border-neon-cyan/30 flex items-center justify-center group-hover:border-neon-magenta/30 transition-all duration-300">
                      <Icon className="w-6 h-6 text-neon-cyan group-hover:text-neon-magenta transition-colors" />
                    </div>
                  </div>

                  <GlassCardHeader className="relative">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-gradient-neon transition-all">
                      {service.title}
                    </h3>
                  </GlassCardHeader>

                  <GlassCardContent className="flex-1 flex flex-col pt-0">
                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed mb-6 flex-1">
                      {service.text}
                    </p>

                    {/* CTA Link */}
                    <div className="flex items-center text-neon-cyan group-hover:text-neon-magenta transition-colors font-semibold">
                      <span className="mr-2">{t('seeMore')}</span>
                      <svg
                        className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <AnimatedSection variant="fadeIn" delay={0.8} className="mt-20">
          <GlassCard variant="neon" className="text-center py-12">
            <GlassCardContent>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300"
              >
                <span>{t('cta.button')}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </GlassCardContent>
          </GlassCard>
        </AnimatedSection>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <GlassCard variant="neon" className="border-neon-cyan/30">
                <GlassCardContent className="p-0">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedService(null)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-obsidian/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Image */}
                  <div className="relative aspect-[21/9] w-full overflow-hidden bg-obsidian-50">
                    <Image
                      src={selectedService.largeImg}
                      alt={selectedService.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-80" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        {selectedService.largeTitle}
                      </h2>
                      <div className="flex items-center gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm">{t('writtenBy')} {selectedService.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-neon-magenta" />
                          <span className="text-sm">{selectedService.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-8 md:p-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                      <p className="text-xl text-gray-200 leading-relaxed mb-8 first-letter:text-5xl first-letter:font-black first-letter:text-neon-cyan first-letter:mr-1 first-letter:float-left">
                        {selectedService.fullDescription}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="my-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

                    {/* Additional Details */}
                    <div className="prose prose-invert max-w-none">
                      {selectedService.descriptions}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-12 text-center">
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300"
                      >
                        <span>{t('cta.discuss')}</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
