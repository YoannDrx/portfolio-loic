'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { GlassCard } from '@/components/ui/GlassCard';
import { Calendar, User, FileText, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: string;
    no: string;
    title: string;
    largeImg: string;
    author: string;
    date: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link href={`/services/${service.id}`}>
      <GlassCard
        variant="default"
        hover
        className="group h-full flex flex-col overflow-hidden cursor-pointer"
      >
        {/* Service Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-obsidian-200">
          <Image
            src={service.largeImg}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Service Number Badge */}
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full">
              <span className="text-xs font-bold text-white">#{service.no}</span>
            </div>
          </div>

          {/* View Details Badge */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/20 backdrop-blur-sm rounded-full border border-neon-cyan/30">
              <span className="text-xs font-semibold text-neon-cyan">Voir détails</span>
              <ArrowRight className="w-3 h-3 text-neon-cyan" />
            </div>
          </div>
        </div>

        {/* Service Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gradient-neon transition-all line-clamp-2">
            {service.title}
          </h3>

          {/* Meta Info */}
          <div className="space-y-2 mt-auto">
            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4 text-neon-cyan flex-shrink-0" />
              <span className="line-clamp-1">{service.author}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4 text-neon-magenta flex-shrink-0" />
              <span>{service.date}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
