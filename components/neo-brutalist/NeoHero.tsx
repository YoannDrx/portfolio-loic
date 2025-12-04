"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Download, ArrowDown } from 'lucide-react';
import { BrutalistButton } from './ui/BrutalistButton';

export const NeoHero = () => {
  return (
    <section className="container mx-auto px-4 md:px-6 mb-24 min-h-[calc(100vh-8rem)] flex flex-col justify-center relative">
      <div className="relative">
         {/* Decorative labels */}
         <div className="absolute -top-12 left-0 font-mono text-xs font-bold text-neo-accent flex items-center gap-2">
            <div className="w-2 h-2 bg-neo-accent animate-pulse"></div>
            BASED IN PARIS
         </div>

         <motion.h1
           className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter uppercase break-words mb-8 text-neo-text"
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
         >
           Music <br />
           <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--neo-text)', color: 'transparent' }}>Producer</span> <br />
           & Composer
         </motion.h1>

         <motion.div 
           className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-4xl"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
         >
           <p className="font-mono text-sm md:text-base font-medium max-w-md border-l-4 border-neo-accent pl-6 bg-neo-surface p-4 shadow-neo text-neo-text">
             Compositeur primé. Je crée des univers sonores immersifs pour le cinéma, la publicité et les jeux vidéo.
           </p>
           
           <div className="flex gap-4">
             <BrutalistButton variant="primary" icon={<Play size={16} />}>
               Showreel
             </BrutalistButton>
             <BrutalistButton variant="secondary" icon={<Download size={16} />}>
               CV (PDF)
             </BrutalistButton>
           </div>
         </motion.div>
      </div>

      <div className="absolute bottom-10 right-4 md:right-10 flex flex-col items-center gap-2 text-neo-text">
         <span className="font-mono text-[10px] uppercase rotate-90 origin-right translate-x-4 mb-8">Scroll Down</span>
         <motion.div 
           animate={{ y: [0, 10, 0] }}
           transition={{ repeat: Infinity, duration: 2 }}
         >
           <ArrowDown size={32} />
         </motion.div>
      </div>
    </section>
  );
};
