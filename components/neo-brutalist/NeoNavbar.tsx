"use client";

import React, { useState } from 'react';

export const NeoNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-40 bg-neo-bg border-b-2 border-neo-black px-4 py-4 md:px-6 flex justify-between items-center">
      <div className="flex items-center gap-1">
        <div className="w-10 h-10 bg-neo-black text-white flex items-center justify-center font-black text-xl border-2 border-transparent">
          LG
        </div>
        <div className="hidden md:flex flex-col leading-none ml-2 text-neo-black">
          <span className="font-black tracking-tighter text-lg">LOÏC.GHANEM</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Music Composer</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-0 border-2 border-neo-black bg-white">
        {['Accueil', 'À Propos', 'Services', 'Albums', 'Contact'].map((item, i) => (
          <a 
            key={item} 
            href={`#${item.toLowerCase().replace(' ', '-')}`} 
            className={`px-6 py-2 font-mono text-xs font-bold uppercase hover:bg-neo-orange hover:text-white transition-colors text-neo-black ${i !== 4 ? 'border-r-2 border-neo-black' : ''}`}
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4 text-neo-black">
         <span className="font-mono text-xs font-bold border border-neo-black px-2 py-1 rounded bg-white">FR</span>
         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            <div className="space-y-1.5 p-2 bg-neo-black">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
         </button>
      </div>
    </nav>
  );
};
