'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AudioVisualizationScene from '@/components/three/AudioVisualizationScene';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassLinkButton } from '@/components/ui/GlassButton';
import { ArrowRight, Play, Music, Mail, Download, Headphones, Sliders, Sparkles, X, Lock, ChevronDown } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { LoginModal } from '@/components/auth/LoginModal';
import SoundCloudPlayer from '@/components/home/SoundCloudPlayer';
import { CyclicScramble } from '@/components/home/GlitchTitle';

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

/* ============================================
   FLOATING ORB COMPONENT
   ============================================ */
const FloatingOrb = ({
  color,
  size,
  initialX,
  initialY,
  duration
}: {
  color: string;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
}) => (
  <motion.div
    className={`absolute rounded-full ${color} blur-[100px] pointer-events-none`}
    style={{ width: size, height: size }}
    initial={{ x: initialX, y: initialY, opacity: 0.3 }}
    animate={{
      x: [initialX, initialX + 100, initialX - 50, initialX],
      y: [initialY, initialY - 80, initialY + 60, initialY],
      opacity: [0.3, 0.5, 0.3, 0.3],
      scale: [1, 1.2, 0.9, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

/* ============================================
   ANIMATED SECTION TITLE
   ============================================ */
const AnimatedSectionTitle = ({
  children,
  subtitle,
  align = 'left'
}: {
  children: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'flex justify-between items-end border-b border-[var(--glass-border)] pb-4'}`}
    >
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-tighter"
          dangerouslySetInnerHTML={{ __html: children as string }}
        />
      </div>
      {subtitle && align === 'left' && (
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-muted-foreground font-mono hidden md:block"
        >
          {subtitle}
        </motion.span>
      )}
      {subtitle && align === 'center' && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neon-purple font-mono tracking-[0.2em] mb-2 block"
        >
          {subtitle}
        </motion.span>
      )}
      {align === 'left' && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-neon-lime via-neon-cyan to-transparent"
          initial={{ width: 0 }}
          animate={isInView ? { width: '100%' } : {}}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
};

/* ============================================
   PARALLAX WRAPPER
   ============================================ */
const ParallaxWrapper = ({
  children,
  offset = 50,
  className = ""
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
};

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function FuturisticHome({ albums, videos, services, initialLoginOpen = false }: FuturisticHomeProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Scroll progress for global effects
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Hero parallax
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.95]);
  const scrollIndicatorOpacity = useTransform(heroScrollProgress, [0, 0.1], [1, 0]);

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
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('login');
      const newUrl = newParams.toString() ? `${pathname}?${newParams.toString()}` : pathname;
      window.history.replaceState(null, '', newUrl);
    }
  };

  const serviceIcons = [Music, Headphones, Sliders, Sparkles];

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  };

  const videoItemVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.33, 1, 0.68, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary selection:text-background font-inter overflow-x-hidden relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-lime via-neon-cyan to-neon-magenta z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Floating Orbs - Parallax Background Elements */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        <FloatingOrb color="bg-neon-lime/20" size={400} initialX={-100} initialY={200} duration={20} />
        <FloatingOrb color="bg-neon-cyan/15" size={300} initialX={800} initialY={400} duration={25} />
        <FloatingOrb color="bg-neon-magenta/10" size={350} initialX={400} initialY={800} duration={22} />
        <FloatingOrb color="bg-neon-purple/15" size={250} initialX={100} initialY={1200} duration={18} />
      </div>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <AudioVisualizationScene />
      </div>

      {/* Overlay Gradient for readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 pt-0 sm:pt-32 pb-20 px-6 md:px-20 max-w-7xl mx-auto">

        {/* ============================================
            HERO SECTION
            ============================================ */}
        <section ref={heroRef} id="about" className="min-h-screen sm:min-h-[90vh] flex flex-col justify-center items-start relative">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative"
          >
            {/* Animated subtitle */}
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-neon-lime font-mono text-sm md:text-base mb-4 tracking-[0.2em]"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ▸
              </motion.span>{' '}
              {t('home.hero.subtitle')}
            </motion.h2>

            {/* Main title with glitch animation */}
            <div className="overflow-hidden mb-8 h-[120px] sm:h-[160px] lg:h-[200px] flex items-center">
              <motion.h1
                initial={{ y: 120, rotateX: -80 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1], delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] font-montserrat text-foreground whitespace-pre-line"
                style={{ transformOrigin: 'bottom' }}
              >
                <CyclicScramble 
                    words={[
                        t('home.hero.cyclicTitles.musicProduction'),
                        t('home.hero.cyclicTitles.filmScoring'),
                        t('home.hero.cyclicTitles.soundDesign'),
                        t('home.hero.cyclicTitles.immersiveAudio')
                    ]} 
                    interval={4000}
                    className="block"
                />
              </motion.h1>
            </div>

            {/* Description with glass effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="group relative max-w-xl mb-10 cursor-default"
            >
              <div className="absolute -inset-3 bg-[var(--glass-subtle)] group-hover:bg-background/90 backdrop-blur-md group-hover:backdrop-blur-xl rounded-xl border border-[var(--glass-border)] group-hover:border-[var(--glass-border-strong)] transition-all duration-500 ease-out" />
              <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-neon-lime/5 group-hover:from-neon-lime/10 via-transparent to-transparent transition-all duration-500" />
              <p className="relative text-muted-foreground group-hover:text-foreground/90 max-w-xl text-lg md:text-xl font-light border-l-2 border-neon-lime pl-6 py-2 transition-colors duration-300">
                {t('home.hero.description')}
              </p>
            </motion.div>

            {/* CTA Buttons with stagger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link href="/albums">
                  <NeonButton>
                    {t('home.hero.listenShowreel')} <Play className="inline ml-2 w-4 h-4" />
                  </NeonButton>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <a href={`/api/cv/download?locale=${locale}`} target="_blank" rel="noopener noreferrer">
                  <GlassLinkButton color="lime">
                    {t('home.hero.downloadResume')} <Download className="w-4 h-4" />
                  </GlassLinkButton>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Scroll indicator - Fixed on mobile, absolute on desktop, fades on scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{ opacity: scrollIndicatorOpacity }}
            className="fixed sm:absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Scroll</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-neon-lime" />
            </motion.div>
          </motion.div>
        </section>

        {/* ============================================
            ALBUMS SECTION
            ============================================ */}
        <section id="work" className="py-32 relative">
          <ParallaxWrapper offset={30}>
            <AnimatedSectionTitle subtitle={t('home.sections.albumsSubtitle')}>
              {t.raw('home.sections.albums')}
            </AnimatedSectionTitle>
          </ParallaxWrapper>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {albums.map((album, index) => {
              const isLime = index % 2 === 0;
              const glowColor = isLime ? 'lime' : 'cyan';
              const textColorClass = isLime ? 'text-neon-lime' : 'text-neon-cyan';
              const borderColorClass = isLime ? 'border-neon-lime/30' : 'border-neon-cyan/30';
              const glowShadowClass = isLime
                ? 'group-hover:shadow-[0_0_30px_rgba(213,255,10,0.4)]'
                : 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]';

              return (
                <motion.a
                  href={album.listenLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={album.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    rotateY: index % 2 === 0 ? 2 : -2,
                    rotateX: -2,
                    z: 50
                  }}
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                  className="block"
                >
                  <GlassCard hover="glow" glowColor={glowColor} className="aspect-square flex flex-col justify-end group cursor-pointer relative overflow-hidden">
                    {/* Album Art Background */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={album.img}
                        alt={album.title}
                        fill
                        className="object-cover rounded-2xl opacity-70 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
                      <div className={`absolute inset-0 ${isLime ? 'bg-neon-lime/5' : 'bg-neon-cyan/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    </div>

                    {/* Play button overlay - center */}
                    <motion.div
                      className="absolute inset-0 z-10 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`w-20 h-20 rounded-full bg-[var(--glass-active)] backdrop-blur-xl flex items-center justify-center border ${borderColorClass} ${glowShadowClass}`}
                      >
                        <Play className={`w-8 h-8 ${textColorClass} fill-current ml-1`} />
                      </motion.div>
                    </motion.div>

                    {/* Text content container with glass effect */}
                    <div className="absolute inset-x-0 bottom-0 z-20 transform transition-transform duration-500 ease-out group-hover:-translate-y-1">
                      <div className="absolute inset-0 bg-background/70 group-hover:bg-background/90 backdrop-blur-md group-hover:backdrop-blur-xl transition-all duration-500" />

                      <div className="relative p-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-[var(--glass-active)] backdrop-blur-md border border-[var(--glass-border-strong)] uppercase tracking-wider ${textColorClass}`}>
                            {album.style}
                          </span>
                          <span className="text-muted-foreground font-mono text-sm">{album.date}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-1 text-foreground group-hover:text-foreground transition-colors">{album.title}</h3>

                        <div className={`flex items-center gap-2 mt-4 text-foreground/60 ${isLime ? 'group-hover:text-neon-lime' : 'group-hover:text-neon-cyan'} transition-colors duration-300`}>
                          <Music className={`w-4 h-4 ${textColorClass}`} />
                          <span className="text-sm font-bold tracking-widest uppercase">
                            {t('home.sections.listenNow')}
                          </span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.a>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link href="/albums">
              <GlassLinkButton color="lime">{t('home.sections.viewAllAlbums')}</GlassLinkButton>
            </Link>
          </motion.div>
        </section>

        {/* SoundCloud Player Section */}
        <ParallaxWrapper offset={20}>
          <SoundCloudPlayer />
        </ParallaxWrapper>

        {/* ============================================
            VIDEOS SECTION
            ============================================ */}
        <section id="videos" className="py-32 relative">
          <ParallaxWrapper offset={30}>
            <AnimatedSectionTitle subtitle={t('home.sections.videosSubtitle')}>
              {t.raw('home.sections.videos')}
            </AnimatedSectionTitle>
          </ParallaxWrapper>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{ perspective: 1000 }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                variants={videoItemVariants}
                whileHover={{
                  scale: 1.05,
                  rotateY: index === 1 ? 0 : index === 0 ? 5 : -5,
                  z: 30
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <GlassCard
                  hover="glow"
                  glowColor="magenta"
                  className="group cursor-pointer overflow-hidden p-0 h-64 relative"
                  onClick={() => setSelectedVideo(video.videoId)}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        boxShadow: ['0 0 20px rgba(255,0,110,0.3)', '0 0 40px rgba(255,0,110,0.5)', '0 0 20px rgba(255,0,110,0.3)']
                      }}
                      transition={{
                        boxShadow: { duration: 2, repeat: Infinity },
                        scale: { type: "spring", stiffness: 300 }
                      }}
                      className="w-16 h-16 rounded-full bg-[var(--glass-active)] backdrop-blur-md flex items-center justify-center border border-neon-magenta/30"
                    >
                      <Play className="w-6 h-6 text-neon-magenta fill-neon-magenta" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <motion.p
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs font-bold text-neon-magenta uppercase tracking-wider mb-1"
                    >
                      {video.type}
                    </motion.p>
                    <h3 className="text-lg font-bold truncate">{video.title}</h3>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link href="/videos">
              <GlassLinkButton color="magenta">{t('home.sections.viewAllVideos')}</GlassLinkButton>
            </Link>
          </motion.div>
        </section>

        {/* ============================================
            SERVICES SECTION
            ============================================ */}
        <section id="services" className="py-32 relative">
          {/* Animated background orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none"
          />

          <ParallaxWrapper offset={40}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-neon-purple font-mono tracking-[0.2em] mb-2 block"
              >
                {t('home.sections.servicesSubtitle')}
              </motion.span>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 80 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter"
                  dangerouslySetInnerHTML={{ __html: t.raw('home.sections.services') }}
                />
              </div>
            </motion.div>
          </ParallaxWrapper>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.03,
                    rotateY: index === 1 ? 0 : index === 0 ? 3 : -3,
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <GlassCard hover="glow" glowColor="purple" className="text-center p-8 group relative overflow-hidden h-full">
                    {/* Floating background icon */}
                    <motion.div
                      animate={{
                        rotate: [-12, -8, -12],
                        y: [0, -10, 0],
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
                    >
                      <Icon className="w-24 h-24 text-neon-purple" />
                    </motion.div>

                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--glass-subtle)] flex items-center justify-center text-neon-purple shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-[var(--glass-border)]"
                      >
                        <Icon className="w-8 h-8" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-4 font-montserrat tracking-tight">{service.title}</h3>
                      <p className="text-foreground/85 text-base leading-relaxed">{service.text}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link href="/services">
              <GlassLinkButton color="purple">{t('home.sections.viewAllServices')}</GlassLinkButton>
            </Link>
          </motion.div>
        </section>

        {/* ============================================
            CONTACT SECTION
            ============================================ */}
        <section id="contact" className="py-32 mb-20 relative">
          {/* Animated glow behind card */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-neon-lime/20 via-neon-cyan/10 to-neon-magenta/20 blur-[100px] rounded-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          >
            <GlassCard hover="glow" glowColor="lime" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-lime/5 via-transparent to-neon-cyan/5 pointer-events-none" />

              {/* Animated border glow */}
              <motion.div
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(213,255,10,0.3), transparent)',
                  backgroundSize: '200% 100%',
                }}
              />

              <div className="p-12 md:p-20 text-center relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="overflow-hidden mb-8">
                    <motion.h2
                      initial={{ y: 100 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                      className="text-4xl md:text-7xl font-bold tracking-tighter"
                      dangerouslySetInnerHTML={{ __html: t.raw('home.sections.contact') }}
                    />
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl text-foreground/85 mb-10 max-w-2xl mx-auto font-light"
                  >
                    {t('home.sections.contactText')}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href="/contact">
                      <NeonButton color="lime" className="mx-auto">
                        <Mail className="inline mr-3 w-5 h-5" /> {t('home.sections.getInTouch')}
                      </NeonButton>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </GlassCard>
          </motion.div>
        </section>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-[0_0_50px_rgba(255,0,110,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={handleLoginClose} />

      {/* Admin Login Trigger (Discreet) - Hidden on mobile, visible on desktop */}
      <button
        onClick={() => setIsLoginOpen(true)}
        className="hidden sm:block fixed bottom-4 right-4 z-50 p-2 text-white/10 hover:text-neon-lime transition-colors duration-300"
        aria-label="Admin Login"
      >
        <Lock className="w-4 h-4" />
      </button>
    </div>
  );
}