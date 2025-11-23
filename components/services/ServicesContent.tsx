'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { ServiceCard } from '@/components/services/ServiceCard';
import { FileText, Layers, Star, Clock } from 'lucide-react';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import ServicesScene from '@/components/three/scenes/ServicesScene';
import PageShell from '@/components/ui/PageShell';

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

interface ServicesContentProps {
  services: Service[];
  locale: string;
}

export default function ServicesContent({ services, locale }: ServicesContentProps) {
  const t = useTranslations('services');

  return (
    <PageShell
      title={t('pageTitle')}
      subtitle="Expertise"
      scene={<ServicesScene />}
      gradient="cyan"
    >
        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.id}
                variant="slideUp"
                delay={0.1 * (index % 6)}
              >
                <ServiceCard service={service} locale={locale} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection variant="fadeIn" className="text-center py-20 mb-20">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              {t('noServices')}
            </p>
          </AnimatedSection>
        )}

        {/* Stats Section */}
        <AnimatedSection variant="fadeIn" delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-cyan/10 text-neon-cyan mb-6">
                    <Layers className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  {services.length}
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('totalServices')}</div>
              </GlassCardContent>
            </GlassCard>
            
            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-magenta/10 text-neon-magenta mb-6">
                    <Star className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  100%
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('satisfaction')}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" className="text-center h-full">
              <GlassCardContent className="p-8 flex flex-col items-center justify-center h-full">
                <div className="p-4 rounded-full bg-neon-purple/10 text-neon-purple mb-6">
                    <Clock className="w-8 h-8" />
                </div>
                <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                  24/7
                </div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t('availability')}</div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </AnimatedSection>
    </PageShell>
  );
}
