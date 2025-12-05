"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { BrutalistButton } from './ui/BrutalistButton';
import { NeoInput } from './ui/NeoInput';
import { NeoTextarea } from './ui/NeoTextarea';
import { Link } from '@/i18n/routing';

const socialLinks = [
  { name: 'Twitter', url: 'https://twitter.com/loicghanem' },
  { name: 'Instagram', url: 'https://instagram.com/loicghanem' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/loicghanem' },
  { name: 'SoundCloud', url: 'https://soundcloud.com/loicghanem' },
];

export const NeoFooter = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tContact = useTranslations('contact.form');

  return (
    <footer id="contact" className="bg-neo-text text-neo-text-inverse pt-24 pb-8 border-t-[10px] border-neo-accent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Left Column - CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[10vw] lg:text-[6vw] leading-[0.8] font-black uppercase tracking-tighter mb-8 text-neo-text-inverse">
              {t('letsCreate')} <br /> <span className="text-neo-accent">{t('together')}</span>
            </h2>
            <p className="font-mono text-lg max-w-md opacity-60 mb-8">
              {t('tagline')}
            </p>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:loic.ghanem@outlook.com"
                className="text-xl md:text-2xl font-bold hover:text-neo-accent transition-colors flex items-center gap-4"
              >
                <Mail className="w-6 h-6" />
                loic.ghanem@outlook.com
              </a>
              <div className="font-mono text-sm opacity-50 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('location')}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12">
              <h3 className="font-mono text-xs uppercase tracking-wider opacity-50 mb-4">
                {t('quickLinks')}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/services">
                  <BrutalistButton variant="dark" size="sm">
                    {tNav('services')}
                  </BrutalistButton>
                </Link>
                <Link href="/albums">
                  <BrutalistButton variant="dark" size="sm">
                    {tNav('albums')}
                  </BrutalistButton>
                </Link>
                <Link href="/videos">
                  <BrutalistButton variant="dark" size="sm">
                    {tNav('videos')}
                  </BrutalistButton>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-neo-text/50 border-2 border-neo-text-inverse p-8 md:p-12 relative"
          >
            {/* Corner Decorations */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-accent" />
            <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-neo-accent" />

            <form className="space-y-6">
              <NeoInput
                label={tContact('name')}
                name="name"
                placeholder={tContact('namePlaceholder').toUpperCase()}
                variant="underline"
                className="bg-transparent text-neo-text-inverse placeholder:text-neo-text-inverse/30 border-neo-text-inverse/30 focus:border-neo-accent"
              />
              <NeoInput
                label={tContact('email')}
                name="email"
                type="email"
                placeholder={tContact('emailPlaceholder').toUpperCase()}
                variant="underline"
                className="bg-transparent text-neo-text-inverse placeholder:text-neo-text-inverse/30 border-neo-text-inverse/30 focus:border-neo-accent"
              />
              <NeoTextarea
                label={tContact('message')}
                name="message"
                rows={3}
                placeholder={tContact('messagePlaceholder').toUpperCase()}
                variant="underline"
                className="bg-transparent text-neo-text-inverse placeholder:text-neo-text-inverse/30 border-neo-text-inverse/30 focus:border-neo-accent"
              />
              <BrutalistButton
                type="submit"
                variant="primary"
                className="w-full justify-center mt-8"
              >
                {tContact('submit')}
              </BrutalistButton>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-neo-text-inverse/20 font-mono text-xs uppercase">
          {/* Social Links */}
          <div className="flex gap-6 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-50 hover:opacity-100 hover:text-neo-accent transition-all flex items-center gap-1"
              >
                {social.name}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="opacity-50">
            {t('copyright', { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NeoFooter;
