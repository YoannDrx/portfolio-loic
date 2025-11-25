'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AudioVisualizationScene from '@/components/three/AudioVisualizationScene';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassLinkButton } from '@/components/ui/GlassButton';
import { ArrowRight, Play, Music, Film, Mail, Download, Headphones, Sliders, Sparkles, X, Lock } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import SoundCloudPlayer from '@/components/home/SoundCloudPlayer';

interface Album {
  id: string;
  title: string;
  img: string;
  style: string;
  date: string;
  listenLink: string;
}

interface Video {
  id: string;
  title: string;
  videoId: string;
  type: string;
}

interface Service {
  id: string;
  title: string;
  text: string;
}

interface FuturisticHomeProps {
  albums: Album[];
  videos: Video[];
  services: Service[];
  initialLoginOpen?: boolean;
}

export default function FuturisticHome({ albums, videos, services, initialLoginOpen = false }: FuturisticHomeProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Login Modal State
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(initialLoginOpen);

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setIsLoginOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    setIsLoginOpen(initialLoginOpen);
  }, [initialLoginOpen]);

  const handleLoginClose = () => {
    setIsLoginOpen(false);
    if (pathname.includes('/login')) {
      router.push('/');
    } else {
      // Remove ?login=true from URL cleanly using native history API
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('login');
      const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };
  
  const serviceIcons = [Music, Headphones, Sliders, Sparkles];

  return (
    <div className="min-h-screen text-white selection:bg-neon-lime selection:text-obsidian font-inter overflow-x-hidden relative">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <AudioVisualizationScene />
      </div>

      {/* Overlay Gradient for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-obsidian/50 to-obsidian pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section id="about" className="min-h-[80vh] flex flex-col justify-center items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-neon-lime font-mono text-sm md:text-base mb-4 tracking-[0.2em]">{t('home.hero.subtitle')}</h2>
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500"
              dangerouslySetInnerHTML={{ __html: t.raw('home.hero.title') }}
            />
            <div className="group relative max-w-xl mb-10 cursor-default">
              {/* Glass effect par défaut, plus foncé au hover */}
              <div className="absolute -inset-3 bg-white/5 group-hover:bg-obsidian/90 backdrop-blur-md group-hover:backdrop-blur-xl rounded-xl border border-white/10 group-hover:border-white/20 transition-all duration-500 ease-out" />
              {/* Glow subtil */}
              <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-neon-lime/5 group-hover:from-neon-lime/10 via-transparent to-transparent transition-all duration-500" />
              <p className="relative text-gray-400 group-hover:text-gray-200 max-w-xl text-lg md:text-xl font-light border-l-2 border-neon-lime pl-6 py-2 transition-colors duration-300">
                {t('home.hero.description')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/albums">
                <NeonButton>
                  {t('home.hero.listenShowreel')} <Play className="inline ml-2 w-4 h-4" />
                </NeonButton>
              </Link>
              <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                <GlassLinkButton color="lime">
                  {t('home.hero.downloadResume')} <Download className="w-4 h-4" />
                </GlassLinkButton>
              </a>
            </div>
          </motion.div>
        </section>

        {/* Albums Section */}
        <section id="work" className="py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-16 border-b border-white/10 pb-4"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold tracking-tighter"
              dangerouslySetInnerHTML={{ __html: t.raw('home.sections.albums') }}
            />
            <span className="text-gray-500 font-mono hidden md:block">{t('home.sections.albumsSubtitle')}</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {albums.map((album, index) => (
              <a href={album.listenLink} target="_blank" rel="noopener noreferrer" key={album.id}>
                <GlassCard hover="glow" glowColor={index % 2 === 0 ? 'lime' : 'cyan'} className="aspect-square flex flex-col justify-end group cursor-pointer relative">
                  {/* Album Art Background */}
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={album.img} 
                      alt={album.title} 
                      fill 
                      className="object-contain rounded-2xl opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
                  </div>
                   
                   {/* Text content container with gradient fade */}
                   <div className="absolute inset-x-0 bottom-0 z-10 p-6 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent/0 transform transition-transform duration-500 group-hover:-translate-y-2">
                     <div className="flex justify-between items-center mb-2">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold bg-black/50 backdrop-blur-md border border-white/20 uppercase tracking-wider text-neon-${index % 2 === 0 ? 'lime' : 'cyan'}`}>
                         {album.style}
                       </span>
                       <span className="text-gray-300 font-mono text-sm">{album.date}</span>
                     </div>
                     <h3 className="text-3xl font-bold mb-2">{album.title}</h3>
                     <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-300">
                        <div className="pt-4 flex items-center text-sm font-bold tracking-widest uppercase text-white/70 group-hover:text-white">
                          Listen Now <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                     </div>
                   </div>
                </GlassCard>
              </a>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/albums">
               <GlassLinkButton color="lime">{t('home.sections.viewAllAlbums')}</GlassLinkButton>
             </Link>
          </div>
        </section>

        {/* SoundCloud Player Section */}
        <SoundCloudPlayer />

        {/* Videos Section */}
        <section id="videos" className="py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-16 border-b border-white/10 pb-4"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold tracking-tighter"
              dangerouslySetInnerHTML={{ __html: t.raw('home.sections.videos') }}
            />
            <span className="text-gray-500 font-mono hidden md:block">{t('home.sections.videosSubtitle')}</span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
               <GlassCard key={video.id} hover="glow" glowColor="magenta" className="group cursor-pointer overflow-hidden p-0 h-64 relative" onClick={() => setSelectedVideo(video.videoId)}>
                  <Image 
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`} 
                    alt={video.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                     <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white" />
                     </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                     <p className="text-xs font-bold text-neon-magenta uppercase tracking-wider mb-1">{video.type}</p>
                     <h3 className="text-lg font-bold truncate">{video.title}</h3>
                  </div>
               </GlassCard>
            ))}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/videos">
               <GlassLinkButton color="magenta">{t('home.sections.viewAllVideos')}</GlassLinkButton>
             </Link>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
             <span className="text-neon-purple font-mono tracking-[0.2em] mb-2 block">{t('home.sections.servicesSubtitle')}</span>
             <h2 
               className="text-4xl md:text-6xl font-bold tracking-tighter"
               dangerouslySetInnerHTML={{ __html: t.raw('home.sections.services') }}
             />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <GlassCard key={service.id} hover="glow" glowColor="purple" className="text-center p-8 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Icon className="w-24 h-24 text-neon-purple -rotate-12" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/10">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 font-montserrat tracking-tight">{service.title}</h3>
                    <p className="text-gray-300 text-base leading-relaxed">{service.text}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
             <Link href="/services">
               <GlassLinkButton color="purple">{t('home.sections.viewAllServices')}</GlassLinkButton>
             </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 mb-20">
           <GlassCard hover="glow" glowColor="lime" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-lime/5 via-transparent to-transparent pointer-events-none" />

              <motion.div
                 initial={{ scale: 0.9, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 1 }}
                 viewport={{ once: true }}
                 className="p-12 md:p-20 text-center"
              >
                <h2
                  className="text-4xl md:text-7xl font-bold tracking-tighter mb-8"
                  dangerouslySetInnerHTML={{ __html: t.raw('home.sections.contact') }}
                />
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                  {t('home.sections.contactText')}
                </p>
                <Link href="/contact">
                  <NeonButton color="lime" className="mx-auto">
                    <Mail className="inline mr-3 w-5 h-5" /> {t('home.sections.getInTouch')}
                  </NeonButton>
                </Link>
              </motion.div>
           </GlassCard>
        </section>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:text-neon-magenta transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe 
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                className="w-full h-full" 
                allow="autoplay; encrypted-media" 
                allowFullScreen 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={handleLoginClose} />

      {/* Admin Login Trigger (Discreet) */}
      <button
        onClick={() => setIsLoginOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-2 text-white/10 hover:text-neon-lime transition-colors duration-300"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4" />
      </button>
    </div>
  );
}