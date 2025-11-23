'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { ArrowRight, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ServiceCardProps {
  service: {
    id: string;
    no: string;
    title: string;
    largeImg: string;
    author: string;
    date: string;
    descriptionsFr?: string;
    descriptionsEn?: string;
    text?: string;
  };
  locale?: string;
}

export function ServiceCard({ service, locale }: ServiceCardProps) {
  const t = useTranslations('services');
  
  // Get description based on locale or fallback to text
  const description = locale === 'fr' 
    ? (service.descriptionsFr || service.text) 
    : (service.descriptionsEn || service.text);

  // Strip HTML tags for preview if needed, or just take a substring
  const previewText = description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...';

  return (
    <Link href={`/services/${service.id}`} className="block h-full">
      <GlassCard
        variant="default"
        hover
        className="group h-full flex flex-col overflow-hidden cursor-pointer border-white/5 hover:border-neon-cyan/30"
      >
        <GlassCardContent className="p-0 h-full flex flex-col">
          {/* Service Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-obsidian-200">
            <Image
              src={service.largeImg}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />

            {/* Service Number Badge */}
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-1 bg-obsidian/80 backdrop-blur-md border border-neon-cyan/50 rounded text-neon-cyan font-mono text-xs font-bold tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                NO.{service.no}
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-obsidian/50 to-transparent">
            {/* Title */}
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient-neon transition-all line-clamp-2 font-montserrat uppercase tracking-wide">
              {service.title}
            </h3>
            
            {/* Preview Text */}
            <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
              {previewText}
            </p>

            {/* Meta Info */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-widest">
                <Layers className="w-3 h-3 text-neon-purple" />
                <span>Service</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-bold text-neon-cyan group-hover:translate-x-1 transition-transform">
                <span className="uppercase tracking-wider text-xs">{t('seeMore')}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </GlassCardContent>
      </GlassCard>
    </Link>
  );
}