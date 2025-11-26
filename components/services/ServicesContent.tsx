'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, Layers, Award, Star, Sparkles } from 'lucide-react';

// Immersive components
import ImmersivePage, { ImmersiveSection, ImmersiveTitle } from '@/components/immersive/ImmersivePage';
import GlowingStats from '@/components/immersive/GlowingStats';

// 3D Scene
import CosmosScene from '@/components/three/scenes/CosmosScene';

// Services components
import ServicesHero from '@/components/services/ServicesHero';
import CosmicServiceCard from '@/components/services/CosmicServiceCard';
import ServiceProcess from '@/components/services/ServiceProcess';
import ServicesCTA from '@/components/services/ServicesCTA';

/* ============================================
   TYPES
   ============================================ */

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

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ServicesContent({ services, locale }: ServicesContentProps) {
  const t = useTranslations('services');
  const [highlightedService, setHighlightedService] = useState<number | null>(null);

  // Stats configuration
  const stats = [
    {
      value: services.length,
      label: t('stats.services'),
      icon: Layers,
      color: 'cyan' as const,
    },
    {
      value: 15,
      suffix: '+',
      label: t('stats.experience'),
      icon: Award,
      color: 'purple' as const,
    },
    {
      value: 50,
      suffix: '+',
      label: t('stats.projects'),
      icon: Sparkles,
      color: 'magenta' as const,
    },
    {
      value: 100,
      suffix: '%',
      label: t('stats.satisfaction'),
      icon: Star,
      color: 'lime' as const,
    },
  ];

  return (
    <ImmersivePage
      scene={<CosmosScene highlightedService={highlightedService ?? undefined} />}
      gradient="cyan"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      {/* Hero Section */}
      <ServicesHero servicesCount={services.length} locale={locale} />

      {/* Services Grid Section */}
      <div id="services-grid">
      <ImmersiveSection className="py-20 lg:py-32">
        <div className="container-custom">
          {/* Section Title */}
          <ImmersiveTitle
            subtitle="EXPERTISE"
            gradient="cyan"
            align="center"
            className="mb-16"
          >
            {t('pageTitle')}
          </ImmersiveTitle>

          {/* Services Grid */}
          {services.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {services.map((service, index) => (
                <CosmicServiceCard
                  key={service.id}
                  service={service}
                  locale={locale}
                  index={index}
                  onHover={setHighlightedService}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">{t('noServices')}</p>
            </motion.div>
          )}
        </div>
      </ImmersiveSection>
      </div>

      {/* Process Timeline Section */}
      <ServiceProcess />

      {/* Stats Section */}
      <ImmersiveSection className="py-20 lg:py-32">
        <div className="container-custom">
          <GlowingStats stats={stats} columns={4} />
        </div>
      </ImmersiveSection>

      {/* CTA Section */}
      <ServicesCTA locale={locale} />
    </ImmersivePage>
  );
}
