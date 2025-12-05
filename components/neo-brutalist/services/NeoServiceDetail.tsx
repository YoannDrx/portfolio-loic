"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Calendar, User, ArrowLeft, Layers, Eye, Mail } from 'lucide-react';
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function NeoServiceDetail({
  service,
  allServices,
  locale,
  isPreview = false,
}: NeoServiceDetailProps) {
  const _t = useTranslations('services.detail');
  const tCommon = useTranslations('common');

  // Filter related services (excluding current)
  const relatedServices = allServices
    .filter(s => s.id !== service.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-32 pb-24">
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

        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {tCommon('backToServices')}
            </Link>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
          >
            {/* Left Column - Service Image */}
            <motion.div variants={fadeInUp}>
              <NeoCard hover="lift" padding="sm" className="bg-neo-surface sticky top-32">
                <div className="aspect-video relative overflow-hidden">
                  {service.largeImg ? (
                    <Image
                      src={service.largeImg}
                      alt={service.title}
                      fill
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neo-bg-alt flex items-center justify-center">
                      <Layers className="w-20 h-20 opacity-20" />
                    </div>
                  )}
                </div>
                {/* Service Number Badge */}
                <div className="absolute top-4 left-4 bg-neo-accent text-neo-text-inverse px-3 py-1 font-mono text-sm font-bold">
                  N°{service.no}
                </div>
              </NeoCard>
            </motion.div>

            {/* Right Column - Service Info */}
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Service Number Tag */}
              <NeoTag variant="accent" size="lg">
                <Layers className="w-4 h-4 mr-2 inline" />
                Service N°{service.no}
              </NeoTag>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                {service.largeTitle || service.title}
              </h1>

              {/* Short Description */}
              <p className="text-xl font-medium opacity-70 border-l-4 border-neo-accent pl-6">
                {service.text}
              </p>

              {/* Metadata */}
              <div className="space-y-4 py-6 border-y-2 border-neo-border">
                <div className="flex items-center gap-3 font-mono">
                  <User className="w-5 h-5 text-neo-accent" />
                  <span className="opacity-60">Auteur:</span>
                  <span className="font-bold">{service.author}</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <Calendar className="w-5 h-5 text-neo-accent" />
                  <span className="opacity-60">Date:</span>
                  <span className="font-bold">{service.date}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <BrutalistButton variant="primary" size="lg" icon={<Mail size={18} />}>
                    {tCommon('contact')}
                  </BrutalistButton>
                </Link>
                <Link href="/services">
                  <BrutalistButton variant="secondary" size="lg">
                    Tous les services
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Full Description Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <NeoCard padding="lg" className="max-w-4xl">
              <h2 className="text-2xl font-black uppercase mb-6 pb-4 border-b-2 border-neo-border">
                Description complète
              </h2>
              <div
                className="prose prose-lg max-w-none text-neo-text font-mono leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: locale === 'fr'
                    ? (service.descriptionsFr || service.fullDescription)
                    : (service.descriptionsEn || service.fullDescription),
                }}
              />
            </NeoCard>
          </motion.section>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                  RELATED
                </span>
                <h2 className="text-3xl font-black uppercase tracking-tight">
                  Autres services
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedServices.map((relatedService) => (
                  <Link key={relatedService.id} href={{ pathname: '/services/[id]', params: { id: relatedService.id } }}>
                    <NeoCard hover="lift" padding="md" className="group h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-neo-accent text-neo-text-inverse px-2 py-1 font-mono text-xs font-bold">
                          N°{relatedService.no}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black uppercase mb-2 group-hover:text-neo-accent transition-colors">
                        {relatedService.title}
                      </h3>
                      <p className="font-mono text-sm opacity-60 line-clamp-2">
                        {relatedService.text}
                      </p>
                    </NeoCard>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <NeoCard variant="inverted" padding="lg" className="text-center">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                Besoin de ce service ?
              </h2>
              <p className="font-mono text-lg opacity-60 max-w-2xl mx-auto mb-8">
                Contactez-moi pour discuter de votre projet et obtenir un devis personnalisé.
              </p>
              <Link href="/contact">
                <BrutalistButton variant="dark" size="lg" icon={<Mail size={18} />}>
                  {tCommon('contact')}
                </BrutalistButton>
              </Link>
            </NeoCard>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
