"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { NeoNavbar } from '../NeoNavbar';
import { NeoFooter } from '../NeoFooter';
import { NeoHeroSection } from '../ui/NeoHeroSection';
import { NeoContactForm } from './NeoContactForm';
import { NeoContactInfo } from './NeoContactInfo';
import { BrutalistButton } from '../ui/BrutalistButton';
import { Link } from '@/i18n/routing';

export const NeoContact = () => {
  const t = useTranslations('contact');

  return (
    <div className="min-h-screen bg-neo-bg selection:bg-neo-text selection:text-neo-accent">
      <NeoNavbar />

      <main className="pt-20">
        {/* Hero Section */}
        <NeoHeroSection
          badgeNumber="06"
          badge={t('hero.badge')}
          title={t('hero.title')}
          description={t('hero.description')}
          align="center"
        />

        {/* Contact Content */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Form - Takes 3 columns */}
              <div className="lg:col-span-3">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3"
                >
                  <span className="font-mono text-sm bg-neo-text text-neo-accent px-2 py-1">
                    01
                  </span>
                  {t('getInTouch')}
                </motion.h2>
                <NeoContactForm />
              </div>

              {/* Info - Takes 2 columns */}
              <div className="lg:col-span-2">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-3"
                >
                  <span className="font-mono text-sm bg-neo-text text-neo-accent px-2 py-1">
                    02
                  </span>
                  Infos
                </motion.h2>
                <NeoContactInfo />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neo-text">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-neo-text-inverse text-lg mb-6"
            >
              {t('cta.text')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/services">
                <BrutalistButton
                  variant="dark"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                >
                  {t('cta.button')}
                </BrutalistButton>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoContact;
