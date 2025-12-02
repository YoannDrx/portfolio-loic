'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Music, Headphones, Sliders, Sparkles } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

const useServices = () => {
  const t = useTranslations('services');

  return [
    {
      id: 1,
      icon: Music,
      title: t('composition.title'),
      description: t('composition.description'),
      color: 'cyan' as const,
    },
    {
      id: 2,
      icon: Headphones,
      title: t('production.title'),
      description: t('production.description'),
      color: 'magenta' as const,
    },
    {
      id: 5,
      icon: Sliders,
      title: t('mixing.title'),
      description: t('mixing.description'),
      color: 'purple' as const,
    },
    {
      id: 6,
      icon: Sparkles,
      title: t('mastering.title'),
      description: t('mastering.description'),
      color: 'blue' as const,
    },
  ];
};

const colorClasses = {
  cyan: {
    icon: 'text-neon-cyan',
    border: 'border-neon-cyan/30',
    bg: 'bg-neon-cyan/10',
    hover: 'hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
  magenta: {
    icon: 'text-neon-magenta',
    border: 'border-neon-magenta/30',
    bg: 'bg-neon-magenta/10',
    hover: 'hover:border-neon-magenta/50 hover:shadow-[0_0_20px_rgba(255,0,110,0.3)]',
  },
  purple: {
    icon: 'text-neon-purple',
    border: 'border-neon-purple/30',
    bg: 'bg-neon-purple/10',
    hover: 'hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  },
  blue: {
    icon: 'text-neon-blue',
    border: 'border-neon-blue/30',
    bg: 'bg-neon-blue/10',
    hover: 'hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  },
};

export default function ServicesPreview() {
  const t = useTranslations('services');
  const services = useServices();

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted">
      <div className="container-custom">
        {/* Section Header */}
        <AnimatedSection variant="fadeIn" className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-gradient-neon mb-4">
            {t('pageTitle')}
          </h2>
          <p className="text-xl text-foreground/85 max-w-3xl mx-auto">
            {t('pageDescription')}
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            const classes = colorClasses[service.color];

            return (
              <AnimatedSection
                key={service.id}
                variant="slideUp"
                delay={index * 0.1}
              >
                <GlassCard variant="default" hover="lift" className="h-full group">
                  <GlassCardContent className="p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${classes.bg} ${classes.border} border mb-6 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-8 h-8 ${classes.icon}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-gradient-neon transition-all">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </GlassCardContent>
                </GlassCard>
              </AnimatedSection>
            );
          })}
        </div>

        {/* View All Link */}
        <AnimatedSection variant="fadeIn" delay={0.5} className="text-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-neon-cyan rounded-lg font-semibold text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300"
          >
            <span>{t('seeMore')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
