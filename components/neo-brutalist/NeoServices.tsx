"use client";

import React from 'react';
import { Disc, Mic2, Sliders, Music4, Radio } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

export interface Service {
  id: string;
  title: string;
  text: string;
}

interface NeoServicesProps {
  services: Service[];
}

const getIconForService = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('compo')) return <Music4 size={32} />;
  if (lowerTitle.includes('produc')) return <Disc size={32} />;
  if (lowerTitle.includes('mix')) return <Sliders size={32} className="rotate-90" />;
  if (lowerTitle.includes('master')) return <Radio size={32} />;
  if (lowerTitle.includes('vocal')) return <Mic2 size={32} />;
  return <Disc size={32} />;
};

export const NeoServices: React.FC<NeoServicesProps> = ({ services }) => {
  return (
    <section id="services" className="container mx-auto px-4 md:px-6 py-32">
      <SectionHeader number="03" title="Expertise" subtitle="Services Sonores" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {services.map((service, i) => (
           <div key={service.id} className="border-2 border-neo-border p-8 hover:bg-neo-text hover:text-neo-text-inverse transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(var(--neo-accent-rgb),1)] bg-neo-surface group">
              <div className="flex justify-between items-start mb-8">
                 <div className="p-3 bg-neo-bg border-2 border-neo-border text-neo-text group-hover:bg-neo-surface">
                    {getIconForService(service.title)}
                 </div>
                 <span className="font-mono font-bold text-2xl text-neo-accent">/{i + 1}</span>
              </div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tight text-neo-text group-hover:text-neo-text-inverse">{service.title}</h3>
              <div
                className="font-mono text-sm leading-relaxed text-neo-text/80 group-hover:text-neo-text-inverse/80"
                dangerouslySetInnerHTML={{ __html: service.text }}
              />
           </div>
         ))}
      </div>
    </section>
  );
};
