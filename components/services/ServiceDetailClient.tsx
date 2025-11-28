'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Calendar, User, ArrowLeft, Layers, Eye, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Immersive components
import ImmersivePage from '@/components/immersive/ImmersivePage';
import MagneticButton from '@/components/immersive/MagneticButton';

// 3D Scene
import CosmosScene from '@/components/three/scenes/CosmosScene';

// Related services
import RelatedServices from './RelatedServices';

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
  published: boolean;
}

interface ServiceDetailClientProps {
  service: Service;
  allServices: Service[];
  locale: string;
  isPreview?: boolean;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ServiceDetailClient({
  service,
  allServices,
  locale,
  isPreview = false,
}: ServiceDetailClientProps) {
  const t = useTranslations('services.detail');
  const tCommon = useTranslations('common');
  const heroRef = useRef<HTMLDivElement>(null);
  // Use amount: 0 to trigger animation as soon as the element is in viewport
  const isInView = useInView(heroRef, { once: true, amount: 0 });

  return (
    <ImmersivePage
      scene={<CosmosScene />}
      gradient="cyan"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      {/* Preview Banner */}
      {isPreview && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 backdrop-blur-md rounded-full border border-neon-cyan/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Eye className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">
              Mode Prévisualisation - {service.published ? 'Publié' : 'Non publié'}
            </span>
          </motion.div>
        </div>
      )}

      {/* Hero Section - No animation delay, content visible immediately */}
      <section className="relative pt-4 pb-16 lg:pt-8 lg:pb-24">
        <div ref={heroRef} className="container-custom">
          {/* Back Button */}
          <motion.div
            className="mb-6 lg:mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>{tCommon('backToServices')}</span>
            </Link>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Service Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden sticky top-24">
                {/* Cover Image */}
                <Image
                  src={service.largeImg || service.poster || '/img/service-placeholder.jpg'}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />

                {/* Glow overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-neon-cyan/20 via-transparent to-transparent"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Service Number Badge */}
                <div className="absolute top-6 left-6">
                  <motion.div
                    className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg shadow-lg backdrop-blur-sm"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(0, 240, 255, 0.3)',
                        '0 0 30px rgba(0, 240, 255, 0.5)',
                        '0 0 20px rgba(0, 240, 255, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <span className="text-sm font-bold text-white">Service #{service.no}</span>
                  </motion.div>
                </div>

                {/* Border glow */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-50"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,240,255,0.3), transparent, rgba(139,92,246,0.3))',
                  }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>

            {/* Right Column - Service Info */}
            <div className="space-y-8">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1
                  className={cn(
                    'text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4',
                    'bg-gradient-to-r from-white via-neon-cyan to-neon-purple bg-clip-text text-transparent'
                  )}
                >
                  {service.title}
                </h1>

                {/* Service Type Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Layers className="w-4 h-4 text-neon-cyan" />
                  <span className="text-neon-cyan text-sm font-medium uppercase tracking-wider">
                    Service
                  </span>
                </motion.div>
              </motion.div>

              {/* Metadata */}
              <motion.div
                className="space-y-4 py-6 border-y border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Author */}
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                  <span className="text-lg">
                    <span className="text-gray-400">{tCommon('author')}:</span>{' '}
                    <span className="text-white font-semibold">{service.author}</span>
                  </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neon-purple flex-shrink-0" />
                  <span className="text-lg">
                    <span className="text-gray-400">{tCommon('releaseDate')}:</span>{' '}
                    <span className="text-white font-semibold">{service.date}</span>
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">{t('about')}</h2>
                <div className="prose prose-invert prose-lg max-w-none">
                  <div
                    className="text-gray-300 leading-relaxed space-y-4 service-descriptions"
                    dangerouslySetInnerHTML={{
                      __html: locale === 'fr' ? service.descriptionsFr : service.descriptionsEn,
                    }}
                  />
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <MagneticButton
                  href={`/${locale}/contact`}
                  color="cyan"
                  variant="solid"
                  size="lg"
                  glow
                  leftIcon={Mail}
                  rightIcon={ExternalLink}
                >
                  {tCommon('contact')}
                </MagneticButton>

                <MagneticButton
                  href={`/${locale}/services`}
                  color="purple"
                  variant="outline"
                  size="lg"
                >
                  {tCommon('seeAllServices')}
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services Section */}
      <RelatedServices
        services={allServices}
        currentServiceId={service.id}
        locale={locale}
      />
    </ImmersivePage>
  );
}
