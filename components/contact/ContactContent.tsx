'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

// Immersive components
import ImmersivePage, { ImmersiveSection, ImmersiveTitle } from '@/components/immersive/ImmersivePage';
import GlowingStats from '@/components/immersive/GlowingStats';

// 3D Scene
import ContactScene from '@/components/three/scenes/ContactScene';

// Contact components
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import MapBox from '@/components/contact/MapBox';

// UI components
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

/* ============================================
   TYPES
   ============================================ */

interface ContactContentProps {
  locale: string;
}

/* ============================================
   CONTACT INFO CARD
   ============================================ */

function ContactInfoCard() {
  const t = useTranslations('contact');

  return (
    <GlassCard variant="default" className="h-full">
      <GlassCardContent className="p-8 space-y-6">
        <h3 className="text-2xl font-bold text-foreground mb-6">{t('info.title')}</h3>

        {/* Email */}
        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center group-hover:from-neon-cyan/30 group-hover:to-neon-magenta/30 transition-all">
            <Mail className="w-6 h-6 text-neon-cyan" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t('info.email')}</h4>
            <a href="mailto:loic.ghanem@outlook.com" className="text-foreground hover:text-neon-cyan transition-colors break-all">
              loic.ghanem@outlook.com
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-neon-purple/20 flex items-center justify-center group-hover:from-neon-magenta/30 group-hover:to-neon-purple/30 transition-all">
            <Phone className="w-6 h-6 text-neon-magenta" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t('info.phone')}</h4>
            <a href="tel:+33123456789" className="text-foreground hover:text-neon-magenta transition-colors">
              +33 6 00 00 00 00
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-4 group">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center group-hover:from-neon-purple/30 group-hover:to-neon-blue/30 transition-all">
            <MapPin className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">{t('info.location')}</h4>
            <p className="text-foreground">{t('info.locationValue')}</p>
          </div>
        </div>

        {/* Availability Notice */}
        <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
          <p className="text-sm text-muted-foreground">
            {t('info.availability')}
          </p>
        </div>
      </GlassCardContent>
    </GlassCard>
  );
}

/* ============================================
   CTA SECTION
   ============================================ */

function ContactCTA({ locale: _locale }: { locale: string }) {
  const t = useTranslations('contact');

  return (
    <ImmersiveSection className="py-20 lg:py-32">
      <div className="container-custom">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Glowing border effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-lime via-neon-cyan to-neon-magenta rounded-3xl blur-lg opacity-20" />

          <GlassCard variant="subtle" className="relative text-center py-8">
            <GlassCardContent>
              <p className="text-foreground/85 mb-4 font-light">{t('cta.text')}</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-magenta font-semibold transition-colors"
              >
                <span>{t('cta.button')}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </div>
    </ImmersiveSection>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function ContactContent({ locale }: ContactContentProps) {
  const t = useTranslations('contact');

  // Stats configuration
  const stats = [
    {
      value: '24h',
      label: t('stats.responseTime'),
      icon: Clock,
      color: 'lime' as const,
    },
    {
      value: '100%',
      label: t('stats.satisfaction'),
      icon: CheckCircle,
      color: 'cyan' as const,
    },
    {
      value: '50+',
      label: t('stats.projects'),
      icon: MessageSquare,
      color: 'magenta' as const,
    },
  ];

  return (
    <ImmersivePage
      scene={<ContactScene />}
      gradient="lime"
      showOrbs={true}
      showScrollProgress={true}
      sceneVisibility="high"
      parallaxHero={false}
    >
      {/* Hero Section */}
      <ContactHero locale={locale} />

      {/* Contact Form Section */}
      <div id="contact-form">
        <ImmersiveSection className="py-20 lg:py-32">
          <div className="container-custom">
            {/* Section Title */}
            <ImmersiveTitle
              subtitle="CONTACT"
              gradient="lime"
              align="center"
              className="mb-16"
            >
              {t('pageTitle')}
            </ImmersiveTitle>

            {/* Contact Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
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
              {/* Contact Form */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
              >
                <ContactForm />
              </motion.div>

              {/* Contact Info & Map */}
              <motion.div
                className="space-y-8"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <ContactInfoCard />
                <MapBox />
              </motion.div>
            </motion.div>
          </div>
        </ImmersiveSection>
      </div>

      {/* Stats Section */}
      <ImmersiveSection className="py-20 lg:py-32">
        <div className="container-custom">
          <GlowingStats stats={stats} columns={3} />
        </div>
      </ImmersiveSection>

      {/* CTA Section */}
      <ContactCTA locale={locale} />
    </ImmersivePage>
  );
}
