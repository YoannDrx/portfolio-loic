"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, ExternalLink, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeoCard } from '../ui/NeoCard';
import { NeoTag } from '../ui/NeoTag';

interface NeoContactInfoProps {
  className?: string;
}

const socialLinks = [
  { name: 'SoundCloud', url: 'https://soundcloud.com/loicghanem', icon: '🎵' },
  { name: 'Spotify', url: 'https://open.spotify.com/artist/loicghanem', icon: '🎧' },
  { name: 'Instagram', url: 'https://instagram.com/loicghanem', icon: '📸' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/loicghanem', icon: '💼' },
];

export const NeoContactInfo = ({ className }: NeoContactInfoProps) => {
  const t = useTranslations('contact');

  const infoItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: t('info.phone'),
      value: '+33 6 14 51 75 92',
      href: 'tel:+33614517592',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'loic.ghanem@outlook.com',
      href: 'mailto:loic.ghanem@outlook.com',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t('info.location'),
      value: 'Paris, France',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: t('stats.responseTime'),
      value: '< 24h',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {/* Contact Info Cards */}
      <div className="space-y-4">
        {infoItems.map((item, index) => (
          <NeoCard
            key={index}
            variant="default"
            hover="lift"
            padding="md"
            className="flex items-center gap-4 hover:border-neo-accent transition-colors"
          >
            <div className="w-12 h-12 bg-neo-text text-neo-accent flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs uppercase text-neo-text/60 tracking-wider">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-bold text-neo-text hover:text-neo-accent transition-colors truncate block"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-bold text-neo-text truncate">{item.value}</p>
              )}
            </div>
          </NeoCard>
        ))}
      </div>

      {/* Stats */}
      <NeoCard
        variant="inverted"
        hover="none"
        padding="lg"
        className="group cursor-pointer hover:bg-neo-accent hover:border-neo-accent transition-all duration-300"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <p className="text-4xl font-black text-neo-accent group-hover:text-neo-text transition-colors duration-300">98%</p>
            <p className="font-mono text-xs uppercase text-neo-text-inverse/60 group-hover:text-neo-text/60 mt-1 transition-colors duration-300">
              {t('stats.satisfaction')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-neo-accent group-hover:text-neo-text transition-colors duration-300">150+</p>
            <p className="font-mono text-xs uppercase text-neo-text-inverse/60 group-hover:text-neo-text/60 mt-1 transition-colors duration-300">
              {t('stats.projects')}
            </p>
          </div>
        </div>
      </NeoCard>

      {/* Social Links */}
      <div>
        <h3 className="font-mono text-xs uppercase tracking-wider text-neo-text/60 mb-4">
          {t('info.findMe')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <NeoTag
                variant="outline"
                size="md"
                icon={<span>{social.icon}</span>}
                className="group-hover:bg-neo-accent group-hover:text-neo-text-inverse group-hover:border-neo-accent transition-all"
              >
                {social.name}
                <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
              </NeoTag>
            </a>
          ))}
        </div>
      </div>

      {/* Availability Note */}
      <div className="border-l-4 border-neo-accent pl-4 py-2">
        <p className="text-sm text-neo-text/80">
          {t('info.availability')}
        </p>
      </div>
    </motion.div>
  );
};

export default NeoContactInfo;
