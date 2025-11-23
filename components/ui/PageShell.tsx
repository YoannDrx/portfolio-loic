'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageShellProps {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: string;
  scene: React.ReactNode;
  gradient?: 'lime' | 'cyan' | 'magenta' | 'purple';
}

export default function PageShell({
  children,
  title,
  subtitle,
  scene,
  gradient = 'lime',
}: PageShellProps) {
  return (
    <div className="min-h-screen text-white font-inter relative selection:bg-neon-lime selection:text-obsidian pt-20">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {scene}
      </div>

      {/* Overlay Gradient for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-obsidian/80 to-obsidian pointer-events-none" />
      
      {/* Content */}
      <main className="relative z-10 px-6 md:px-20 py-20 max-w-7xl mx-auto min-h-[80vh]">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-20 border-b border-white/10 pb-8"
        >
           {subtitle && (
             <span className={`text-neon-${gradient} font-mono text-sm md:text-base mb-4 tracking-[0.2em] block uppercase`}>
               {subtitle}
             </span>
           )}
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 uppercase">
             {title}
           </h1>
        </motion.div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
