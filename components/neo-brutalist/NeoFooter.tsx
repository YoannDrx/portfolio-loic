"use client";

import React from 'react';
import { Mail } from 'lucide-react';
import { BrutalistButton } from './ui/BrutalistButton';

export const NeoFooter = () => {
  return (
    <footer id="contact" className="bg-neo-black text-white pt-24 pb-8 border-t-[10px] border-neo-orange">
       <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                              <div>
                                 <h2 className="text-[10vw] lg:text-[6vw] leading-[0.8] font-black uppercase tracking-tighter mb-8">
                                   Let's <br /> <span className="text-neo-orange">Create.</span>
                                 </h2>
                                 <p className="font-mono text-lg max-w-md text-gray-400 mb-8">
                                   Une idée ? Un projet musical ? Transformons votre vision en réalité sonore.
                                 </p>
                                 <div className="flex flex-col gap-2">
                                    <a href="mailto:loic.ghanem@outlook.com" className="text-xl md:text-3xl font-bold hover:text-neo-orange transition-colors flex items-center gap-4">
                                       <Mail /> loic.ghanem@outlook.com
                                    </a>
                                    <div className="font-mono text-gray-500 mt-2">PARIS, FRANCE</div>
                                 </div>
                              </div>
             
                              <div className="bg-[#111] border border-[#333] p-8 md:p-12 relative">
                                 <div className="absolute -top-3 -right-3 w-8 h-8 bg-neo-orange" />
                                 <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-neo-orange" />
                                 
                                 <form className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                       <label className="font-mono text-xs uppercase text-neo-orange">Nom Complet</label>
                                       <input type="text" className="bg-transparent border-b-2 border-[#333] py-2 focus:border-neo-orange focus:outline-none text-lg font-bold font-mono text-white" placeholder="JOHN DOE" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                       <label className="font-mono text-xs uppercase text-neo-orange">Email</label>
                                       <input type="email" className="bg-transparent border-b-2 border-[#333] py-2 focus:border-neo-orange focus:outline-none text-lg font-bold font-mono text-white" placeholder="HELLO@GMAIL.COM" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                       <label className="font-mono text-xs uppercase text-neo-orange">Message</label>
                                       <textarea rows={3} className="bg-transparent border-b-2 border-[#333] py-2 focus:border-neo-orange focus:outline-none text-lg font-bold font-mono resize-none text-white" placeholder="PARLONS DE VOTRE PROJET..." />
                                    </div>
                                    <BrutalistButton variant="primary" className="w-full justify-center mt-8">                      Envoyer le Message
                   </BrutalistButton>
                </form>
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#333] font-mono text-xs uppercase text-gray-500">
             <div className="flex gap-6 mb-4 md:mb-0">
                <a href="#" className="hover:text-neo-orange">Twitter</a>
                <a href="#" className="hover:text-neo-orange">Instagram</a>
                <a href="#" className="hover:text-neo-orange">LinkedIn</a>
                <a href="#" className="hover:text-neo-orange">Soundcloud</a>
             </div>
             <div>
                © 2025 LOÏC GHANEM. TOUS DROITS RÉSERVÉS.
             </div>
          </div>
       </div>
    </footer>
  );
};
