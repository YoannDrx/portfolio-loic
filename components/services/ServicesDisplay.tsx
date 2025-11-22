'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection, AnimatedText } from '@/components/ui/AnimatedSection';
import { ServiceCard } from '@/components/services/ServiceCard';
import { FileText } from 'lucide-react';

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
}

interface ServicesDisplayProps {
  services: Service[];
  locale: string;
}

export function ServicesDisplay({ services, locale }: ServicesDisplayProps) {
  const t = useTranslations('services');

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
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.id}
                variant="slideUp"
                delay={0.1 * (index % 6)}
              >
                <ServiceCard service={service} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              {t('noServices')}
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4} className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                {services.length}
              </div>
              <div className="text-gray-400">{t('totalServices')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                100%
              </div>
              <div className="text-gray-400">{t('satisfaction')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-4xl font-black text-gradient-neon mb-2">
                24/7
              </div>
              <div className="text-gray-400">{t('availability')}</div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
