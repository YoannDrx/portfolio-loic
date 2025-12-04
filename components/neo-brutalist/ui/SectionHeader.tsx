"use client";

import React from 'react';
import { AudioWaveform } from './AudioWaveform';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b-4 border-neo-black pb-6">
    <div>
      <div className="font-mono font-bold text-neo-orange mb-2 flex items-center gap-2">
        <span className="bg-neo-black text-white px-2 py-1">SECT. {number}</span>
        <span>// {subtitle}</span>
      </div>
      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-neo-black">
        {title}
      </h2>
    </div>
    <div className="hidden md:block">
      <AudioWaveform />
    </div>
  </div>
);
