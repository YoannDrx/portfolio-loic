"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SectionHeader } from './ui/SectionHeader';

export interface Album {
  id: string;
  title: string;
  img: string | null;
  style: string | null;
  date: string;
  listenLink: string | null;
}

interface NeoAlbumsProps {
  albums: Album[];
}

export const NeoAlbums: React.FC<NeoAlbumsProps> = ({ albums }) => {
  return (
    <section id="albums" className="container mx-auto px-4 md:px-6 py-32">
      <SectionHeader number="01" title="Discography" subtitle="Derniers Albums" />

      <div className="border-t-4 border-neo-black">
        {albums.map((album, index) => (
          <motion.div 
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative border-b-2 border-neo-black bg-white hover:bg-neo-black hover:text-neo-orange transition-colors duration-300 cursor-pointer overflow-hidden"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-6">
                <span className="font-mono text-xl font-bold">0{index + 1}</span>
                {/* Cover placeholder or image */}
                <div 
                  className="w-12 h-12 border-2 border-neo-black group-hover:border-neo-orange bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: album.img ? `url(${album.img})` : undefined }}
                ></div>
                <div>
                   <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{album.title}</h3>
                   <div className="flex gap-4 font-mono text-xs mt-1">
                      <span>{album.style || 'Genre'}</span>
                      <span>—</span>
                      <span>{new Date(album.date).toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8 self-end md:self-auto">
                {/* Duration placeholder as it's not in DB yet */}
                <span className="font-mono text-sm">--:--</span>
                <a 
                  href={album.listenLink || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-neo-black group-hover:border-neo-orange flex items-center justify-center bg-neo-orange text-neo-black group-hover:bg-neo-orange group-hover:text-neo-black transition-transform group-hover:scale-110 shadow-[4px_4px_0px_0px_#000] group-hover:shadow-[4px_4px_0px_0px_#FFF]"
                >
                   <Play size={20} fill="currentColor" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
         <a href="#" className="font-mono font-bold text-sm uppercase underline decoration-2 decoration-neo-orange underline-offset-4 hover:bg-neo-black hover:text-neo-orange px-2 py-1 transition-colors text-neo-black">
           Voir tous les albums sur Soundcloud
         </a>
      </div>
    </section>
  );
};
