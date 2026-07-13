"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Music,
  Headphones,
  Mic2,
  Sliders,
  Globe,
  BadgeCheck,
  Users,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Award,
  Trophy,
  Guitar,
  Star,
  Gamepad2,
  Film,
  Piano,
  ChevronLeft,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { BrutalistButton } from "../ui/BrutalistButton";
import { ImageModal } from "../ui/ImageModal";
import { SectionHeader } from "../ui/SectionHeader";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoCard } from "../ui/NeoCard";
import { NeoTag } from "../ui/NeoTag";
import { GridBackground } from "../ui/GridBackground";
import { ImmersivePageAtmosphere } from "../ui/ImmersivePageAtmosphere";
import { SectionTransition } from "../ui/SectionTransition";
import { YouTubeExperienceDialog } from "./YouTubeExperienceDialog";
import { Link } from "@/i18n/routing";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  },
};

const photoReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
      delay: 0.2,
    },
  },
};

// Testimonials Carousel Component
interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  text: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-neo-bg border-2 border-neo-border p-6 md:p-8 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--neo-accent)]">
    {/* Quote & Stars */}
    <div className="flex items-start justify-between mb-4">
      <div className="text-5xl md:text-6xl font-serif text-neo-accent/30 leading-none -mt-2">
        &ldquo;
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, starIdx) => (
          <Star key={starIdx} className="w-4 h-4 fill-neo-accent text-neo-accent" />
        ))}
      </div>
    </div>

    {/* Text */}
    <p className="text-sm md:text-base text-neo-text/80 mb-6 italic leading-relaxed line-clamp-4">
      {testimonial.text}
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-4 border-t-2 border-neo-border">
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-neo-accent flex-shrink-0">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-neo-text truncate">{testimonial.name}</h4>
        <p className="font-mono text-xs text-neo-text/60 truncate">{testimonial.role}</p>
        <p className="font-mono text-xs text-neo-accent">SoundBetter</p>
      </div>
    </div>
  </div>
);

const TestimonialsCarousel = ({
  testimonials,
  locale,
}: {
  testimonials: Testimonial[];
  locale: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleTestimonials = Array.from(
    { length: Math.min(3, testimonials.length) },
    (_, index) => testimonials[(currentIndex + index) % testimonials.length]
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Auto-scroll lent (6 secondes)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="py-24 bg-neo-surface overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="font-mono font-bold text-neo-accent mb-4 flex items-center gap-2">
              <span className="bg-neo-text text-neo-text-inverse px-2 py-1">SECT. 02.4</span>
              <span className="text-neo-text/60">
                // {locale === "fr" ? "AVIS CLIENTS" : "CLIENT REVIEWS"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neo-text">
              {locale === "fr" ? "Témoignages" : "Testimonials"}
            </h2>
            <p className="font-mono text-sm text-neo-text/60 mt-2 max-w-md">
              {locale === "fr"
                ? "Retours de mes collaborateurs sur SoundBetter"
                : "Feedback from my collaborators on SoundBetter"}
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-neo-text text-neo-text-inverse flex items-center justify-center border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-neo-text text-neo-text-inverse flex items-center justify-center border-2 border-neo-border hover:bg-neo-accent hover:text-neo-text transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden py-2 -my-2">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
            className="grid gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={index === 1 ? "hidden md:block" : index === 2 ? "hidden lg:block" : ""}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 border-2 border-neo-border transition-all duration-300 ${
                index === currentIndex ? "w-10 bg-neo-accent" : "w-3 bg-neo-bg hover:bg-neo-text/20"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA SoundBetter - Orange accent button */}
        <div className="text-center mt-12">
          <a
            href="https://soundbetter.com/profiles/402365-lo%C3%AFc-ghanem--voyager1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-neo-accent text-neo-text-inverse px-8 py-4 font-bold uppercase tracking-wide border-2 border-neo-border hover:bg-neo-text hover:text-neo-accent transition-colors shadow-[4px_4px_0px_0px_var(--neo-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            <Star className="w-5 h-5" />
            {locale === "fr"
              ? "Voir tous les avis sur SoundBetter"
              : "View All Reviews on SoundBetter"}
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export const NeoAbout = ({ locale, albumCount }: { locale: string; albumCount: number }) => {
  const t = useTranslations("about");
  const [imageModal, setImageModal] = useState<{ src: string; title: string } | null>(null);
  const [descriptionModal, setDescriptionModal] = useState<{
    name: string;
    description: string;
    logo: string;
  } | null>(null);

  // Handle Escape key and body scroll lock for description modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDescriptionModal(null);
    };

    if (descriptionModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [descriptionModal]);

  const skills = [
    {
      title: t("skills.composition.title"),
      icon: Music,
      items: t.raw("skills.composition.items") as string[],
    },
    {
      title: t("skills.production.title"),
      icon: Headphones,
      items: t.raw("skills.production.items") as string[],
    },
    {
      title: t("skills.artistProduction.title"),
      icon: Users,
      items: t.raw("skills.artistProduction.items") as string[],
    },
    {
      title: t("skills.vocalProduction.title"),
      icon: Mic2,
      items: t.raw("skills.vocalProduction.items") as string[],
    },
    {
      title: t("skills.postProduction.title"),
      icon: Sliders,
      items: t.raw("skills.postProduction.items") as string[],
    },
  ];

  const stats = [
    { val: String(albumCount), label: t("achievements.albums") },
    { val: "8", label: t("achievements.labels") },
    { val: "4", label: t("achievements.publishers") },
    { val: String(new Date().getFullYear() - 2011), label: t("achievements.years") },
  ];

  type LocalizedText = { fr: string; en: string };
  const localeKey: keyof LocalizedText = locale === "fr" ? "fr" : "en";

  const labelPartners: Array<{
    name: string;
    logo: string;
    description?: LocalizedText;
    metrics?: LocalizedText[];
    period?: LocalizedText;
    links: Array<{ icon: LucideIcon; url: string; label: string }>;
    isMymaLabel?: boolean;
  }> = [
    // === LABELS MYMA ===
    {
      name: "Montmorency Music Agency",
      logo: "/img/about/partners/myma.jpeg",
      description: {
        fr: "1er acteur indépendant français d'illustration musicale, MYMA est une agence experte de la synchronisation au service des professionnels de l'audiovisuel, et depuis près de 65 ans exclusivement dédiée à la musique. Notre direction artistique reflète notre identité au travers de 3 labels (Justement Music, Montmorency Records, Stereoscopic). Avec + de 650.000 titres, 60 nouveaux albums chaque mois et une offre composée des plus emblématiques librairies musicales (KPM Music, Music House, Patchwork, 9 Lives Music...), notre catalogue est unique par son authenticité et son éclectisme. 100% centré service, notre cellule de supervision musicale vous accompagne pour tous vos briefs. Sync out of the box!",
        en: "France's leading independent music library, MYMA is an expert sync agency serving audiovisual professionals, exclusively dedicated to music for nearly 65 years. Our artistic direction reflects our identity through 3 labels (Justement Music, Montmorency Records, Stereoscopic). With 650,000+ tracks, 60 new albums monthly and the most iconic music libraries (KPM Music, Music House, Patchwork, 9 Lives Music...), our catalog is unique in its authenticity and eclecticism. 100% service-focused, our music supervision team supports all your briefs. Sync out of the box!",
      },
      metrics: [
        { fr: "≈ 14 albums produits", en: "≈ 14 albums produced" },
        { fr: "≈ 8 singles produits", en: "≈ 8 singles produced" },
      ],
      period: { fr: "juil. 2018 - aujourd'hui", en: "Jul 2018 - today" },
      links: [
        { icon: ExternalLink, url: "https://www.myma-music.com/", label: "Website" },
        { icon: Linkedin, url: "https://www.linkedin.com/company/mymasync/", label: "LinkedIn" },
        { icon: Instagram, url: "https://www.instagram.com/myma_music/", label: "Instagram" },
        {
          icon: Youtube,
          url: "https://www.youtube.com/channel/UCYDtNY3_1G30BVuTK_qbLuQ",
          label: "YouTube",
        },
      ],
      isMymaLabel: true,
    },
    {
      name: "Justement Music",
      logo: "/img/about/partners/justement-music.jpg",
      description: {
        fr: "Indépendant, Français et Haut de gamme, Justement Music est un label réputé pour sa qualité, son originalité, son éclectisme et pour ses pépites rétros comme actuelles au service de la synchro. Présent dans plus de 70 pays, il mêle innovation et héritage. Alors tendez l'oreille !",
        en: "Independent, French and Premium, Justement Music is a label renowned for its quality, originality, eclecticism and for its retro and contemporary gems serving sync. Present in over 70 countries, it blends innovation and heritage. So lend an ear!",
      },
      period: { fr: "2018 - aujourd'hui", en: "2018 - today" },
      links: [
        {
          icon: ExternalLink,
          url: "https://www.myma-music.com/labels/justement-music",
          label: "Website",
        },
        {
          icon: Youtube,
          url: "https://www.youtube.com/playlist?list=PLJlRZETQILeOzFn01l_GqRtPoDWGtGdcg",
          label: "YouTube",
        },
      ],
      isMymaLabel: true,
    },
    {
      name: "Stereoscopic",
      logo: "/img/about/partners/stereoscopic.png",
      description: {
        fr: "Unique, frais et percutant, Stereoscopic se décline en 6 thèmes reconnaissables immédiatement grâce à ses pochettes identitaires : électronique/urbain, néoclassique/orchestral, pop/rock/folk, néo-vintage, musiques du monde et Songs. Le label est nourri du talent de compositeurs renommés et de musiciens live et studio de grande classe.",
        en: "Unique, fresh and impactful, Stereoscopic comes in 6 instantly recognizable themes through its signature artwork: electronic/urban, neoclassical/orchestral, pop/rock/folk, neo-vintage, world music and Songs. The label is fueled by the talent of renowned composers and top-tier live and studio musicians.",
      },
      period: { fr: "2019 - aujourd'hui", en: "2019 - today" },
      links: [
        {
          icon: ExternalLink,
          url: "https://www.myma-music.com/labels/stereoscopic",
          label: "Website",
        },
      ],
      isMymaLabel: true,
    },
    {
      name: "Superama Records",
      logo: "/img/about/partners/superama-records.jpg",
      description: {
        fr: "Label de musiques électroniques et Hip Hop, allant de l'Hyperpop déjantée à l'Hybrid Orchestra, en passant par des influences World ou vintage. Fortement inspirées par les briefs clients exigeants, nos productions restent néanmoins sync friendly et élégantes, alliant finesse et émotion.",
        en: "Electronic and Hip Hop music label, ranging from wild Hyperpop to Hybrid Orchestra, through World or vintage influences. Strongly inspired by demanding client briefs, our productions remain sync friendly and elegant, combining finesse and emotion.",
      },
      period: { fr: "2026 - aujourd'hui", en: "2026 - today" },
      links: [
        {
          icon: ExternalLink,
          url: "https://www.myma-music.com/labels/superama-records",
          label: "Website",
        },
      ],
      isMymaLabel: true,
    },
    // === AUTRES LABELS ===
    {
      name: "Infinity Scores",
      logo: "/img/about/partners/infinity-scores.jpeg",
      description: {
        fr: "Porté par le compositeur Gabriel Saban, fort de plus de 15 ans d'expérience dans la musique à l'image, Infinity Scores repousse les frontières du son cinématique avec des compositions immersives et innovantes. Entre sound design contemporain et mélodies soigneusement ciselées, le label donne vie à des paysages sonores puissants, à la fois sensibles et percutants. Chaque album est conçu comme une boîte à outils premium, offrant aux monteurs une palette sonore infiniment créative, infiniment cinématique.",
        en: "Led by composer Gabriel Saban, with over 15 years of experience in music for media, Infinity Scores pushes the boundaries of cinematic sound with immersive and innovative compositions. Between contemporary sound design and carefully crafted melodies, the label brings powerful soundscapes to life, both sensitive and impactful. Each album is designed as a premium toolkit, offering editors an infinitely creative, infinitely cinematic sound palette.",
      },
      metrics: [{ fr: "≈ 2 albums produits", en: "≈ 2 albums produced" }],
      period: { fr: "avr. 2024 - aujourd'hui", en: "Apr 2024 - today" },
      links: [
        {
          icon: ExternalLink,
          url: "https://www.cezamemusic.com/infinity-scores-label-141693.html",
          label: "Cezame",
        },
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/company/cezame-music-agency/",
          label: "Cezame LinkedIn",
        },
        { icon: Instagram, url: "https://www.instagram.com/infinityscores/", label: "Instagram" },
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/company/infinity-scores/",
          label: "LinkedIn",
        },
      ],
    },
    {
      name: "SuperPitch",
      logo: "/img/about/partners/superpitch.jpeg",
      description: {
        fr: 'SuperPitch est une Music House indépendante avec une direction artistique solide et audacieuse portée par les fondateurs primés Thomas & Grégoire Couzinier. SuperPitch se concentre sur un artisanat de haute qualité et une vision créative forte pour chaque album, EP ou Artist Series. Nous encourageons les compositions transversales entre "musique commerciale" et "production music". Habitués à produire une vaste gamme de musiques originales pour la publicité et le cinéma, nous savons exactement ce dont les réalisateurs ont besoin. Le catalogue comprend aussi SuperPitch Drama (cues organiques et dramatiques), SuperPitch Entertainment (musique 100% feelgood), SuperPitch EP (réactivité et tendances) et SuperPitch Artist Series (albums artistiques ambitieux). Récompenses : Mark Awards/PMA 2015-2016, Library Music Award 2015, Production Music Award London 2016.',
        en: 'SuperPitch is an independent Music House with a solid and edgy artistic direction by award-winning founders Thomas & Grégoire Couzinier. SuperPitch focuses on high-quality craft and a strong creative vision for each album, EP or Artist Series, encouraging cross-boundary compositions between "commercial music" and "production music". Used to producing original music for commercials and feature films, we know what filmmakers and art directors need. The catalog also includes SuperPitch Drama (organic and dramatic cues), SuperPitch Entertainment (100% feelgood music), SuperPitch EP (quick reactions and trends) and SuperPitch Artist Series (full-length artistic albums). Awards: Mark Awards/PMA 2015-2016, Library Music Award 2015, Production Music Award London 2016.',
      },
      metrics: [
        { fr: "≈ 2 albums produits", en: "≈ 2 albums produced" },
        { fr: "≈ 3 singles produits", en: "≈ 3 singles produced" },
        {
          fr: "Tous les titres sont chez BMG Production Music",
          en: "All songs on BMG Production Music",
        },
      ],
      period: { fr: "nov. 2019 - janv. 2022", en: "Nov 2019 - Jan 2022" },
      links: [
        {
          icon: ExternalLink,
          url: "https://bmgproductionmusic.com/en-fr/search/tracks?searchTerm=LOIC%20GHANEM&typed=loic&typed=ghanem",
          label: "BMG Catalog",
        },
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/company/superpitch/",
          label: "LinkedIn",
        },
      ],
    },
    {
      name: "GUM",
      logo: "/img/about/partners/gum.jpeg",
      description: {
        fr: "Gum est une maison de supervision musicale et de production sonore spécialisée dans la relation entre musique, son et image pour la publicité, le cinéma, la TV et le digital. Proposant une esthétique pop moderne, Gum Tapes s'est rapidement imposée en France et à l'international depuis 2017. Cette collection iconique explore tous les genres musicaux : du trailer orchestral à la musique du monde, en passant par des sons vintage ou électro. Un mélange de contemporain et de classique, d'efficacité et d'émotion.",
        en: "Gum is a music supervision and sound production house specializing in the relationship between music, sound and picture for commercials, feature film, TV and the digital world. Offering a modern pop aesthetic, Gum Tapes has quickly established itself in France and internationally since 2017. This iconic collection explores all musical genres: from orchestral trailers to world music, through vintage sounds or electro. A blend of contemporary and classic, efficiency and emotion.",
      },
      metrics: [
        { fr: "≈ 1 album produit", en: "≈ 1 album produced" },
        { fr: "≈ 17 singles produits", en: "≈ 17 singles produced" },
      ],
      period: { fr: "nov. 2017 - nov. 2019", en: "Nov 2017 - Nov 2019" },
      links: [
        {
          icon: ExternalLink,
          url: "https://www.gum.paris/",
          label: "Website",
        },
        {
          icon: ExternalLink,
          url: "https://www.kaptainmusic.com/search?artists=%5B%5B%22639ca27d08f94f103957570b%22%2C%22Loic%20Ghanem%22%5D%5D",
          label: "Kaptain Music",
        },
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/company/greenunitedmusic/",
          label: "LinkedIn",
        },
      ],
    },
    {
      name: "Universal Music Publishing Group",
      logo: "/img/about/partners/universal.jpeg",
      description: {
        fr: "Universal Music Publishing Group (UMPG), division éditoriale mondiale d'Universal Music Group, représente un catalogue de chansons de classe mondiale couvrant tous les genres. Basé à Los Angeles avec 48 bureaux dans 41 pays, UMPG représente les auteurs-compositeurs les plus importants au monde : ABBA, Adele, Billie Eilish, Coldplay, Drake, Eminem, Kendrick Lamar, Taylor Swift, The Weeknd et bien d'autres. UMPG est également leader mondial en musique Classique & Cinéma, Gospel et Production Music, fournissant services créatifs et licences sync pour Universal Pictures, Warner Bros., Paramount, Disney, Amazon, HBO, Netflix et de nombreux autres studios.",
        en: "Universal Music Publishing Group (UMPG), the global publishing division of Universal Music Group, represents a world-class catalogue of songs inclusive of every genre. Headquartered in Los Angeles with 48 offices in 41 countries, UMPG represents some of the world's most important songwriters: ABBA, Adele, Billie Eilish, Coldplay, Drake, Eminem, Kendrick Lamar, Taylor Swift, The Weeknd and many more. UMPG is also a global leader in Classical & Screen, Gospel and Production Music, providing creative, sync licensing and administration services for Universal Pictures, Warner Bros., Paramount, Disney, Amazon, HBO, Netflix and many other studios.",
      },
      metrics: [
        { fr: "≈ 5 singles produits", en: "≈ 5 singles produced" },
        {
          fr: "Titres au catalogue Universal Music Publishing",
          en: "Songs on Universal Music Publishing catalog",
        },
      ],
      period: { fr: "oct. 2019 - janv. 2023", en: "Oct 2019 - Jan 2023" },
      links: [
        {
          icon: Linkedin,
          url: "https://www.linkedin.com/company/universal-music-publishing-group/",
          label: "LinkedIn",
        },
      ],
    },
  ];

  const awards = [
    {
      title: t("awards.mark.title"),
      subtitle: t("awards.mark.category"),
      description: t("awards.mark.description"),
      image: "/img/about/Marks-Awards.jpg",
      link: "https://markawards.com/",
      year: t("awards.mark.year"),
      icon: Trophy,
    },
    {
      title: t("awards.pma2024.title"),
      subtitle: t("awards.pma2024.category"),
      description: t("awards.pma2024.description"),
      image: "/img/about/PMA-2024-Metal-nomination.jpg",
      link: "https://www.productionmusicawards.com/",
      year: t("awards.pma2024.year"),
      icon: Award,
    },
    {
      title: t("awards.pma2023.title"),
      subtitle: t("awards.pma2023.category"),
      description: t("awards.pma2023.description"),
      image: "/img/about/PMA-2023-Rock-nomination.jpg",
      link: "https://www.productionmusicawards.com/",
      year: t("awards.pma2023.year"),
      icon: Award,
    },
    {
      title: t("awards.sacem2025.title"),
      subtitle: t("awards.sacem2025.category"),
      description: t("awards.sacem2025.description"),
      image: "/img/about/partners/sacem.jpeg",
      link: "https://www.sacem.fr/",
      year: t("awards.sacem2025.year"),
      icon: BadgeCheck,
    },
  ];

  const musicianExperience = [
    {
      name: "Voyager1",
      period: t("musicianExperience.voyager1.period"),
      role: t("musicianExperience.voyager1.role"),
      genre: t("musicianExperience.voyager1.genre"),
      description: t("musicianExperience.voyager1.description"),
      link: "https://www.youtube.com/watch?v=aPJUTPMEukM",
      isCurrent: true,
    },
    {
      name: "Early Seasons",
      period: t("musicianExperience.earlySeasons.period"),
      role: t("musicianExperience.earlySeasons.role"),
      genre: t("musicianExperience.earlySeasons.genre"),
      description: t("musicianExperience.earlySeasons.description"),
      link: "https://www.youtube.com/watch?v=o8c9h2Vzrhw",
      isCurrent: false,
    },
    {
      name: "Confront",
      period: t("musicianExperience.confront.period"),
      role: t("musicianExperience.confront.role"),
      genre: t("musicianExperience.confront.genre"),
      description: t("musicianExperience.confront.description"),
      link: "https://www.youtube.com/watch?v=8m4W1IuVRco",
      isCurrent: false,
    },
    {
      name: "Rise of the Northstar",
      period: t("musicianExperience.riseOfTheNorthstar.period"),
      role: t("musicianExperience.riseOfTheNorthstar.role"),
      genre: t("musicianExperience.riseOfTheNorthstar.genre"),
      description: t("musicianExperience.riseOfTheNorthstar.description"),
      link: "https://www.youtube.com/watch?v=NulC3-rQX24",
      isCurrent: false,
    },
  ];

  const personalInfo = {
    instruments: [
      { name: "Piano", icon: Piano },
      { name: "Guitar", icon: Guitar },
      { name: "Banjo", icon: Guitar },
      { name: "Ukulele", icon: Guitar },
    ],
    interests: [
      { name: locale === "fr" ? "Musique" : "Music", icon: Music },
      { name: locale === "fr" ? "Cinéma" : "Cinema", icon: Film },
      { name: locale === "fr" ? "Jeux Vidéo" : "Video Games", icon: Gamepad2 },
    ],
  };

  const testimonials = [
    {
      id: 1,
      name: "Wild Fox",
      role: "Topliner, Singer, Writer",
      avatar: "/img/testimonials/1.jpg",
      text: "Loïc is very easy and nice to work with! talented producer/songwriter. Hope to work with him again on other projects!",
    },
    {
      id: 2,
      name: "Amelia Bushell",
      role: "Vocalist",
      avatar: "/img/testimonials/2.jpg",
      text: "Very fun working with Loïc. He knows exactly what he wants and together we made something awesome! He gave great feedback and was a very nice person. I hope to work together again!",
    },
    {
      id: 3,
      name: "Julaiah",
      role: "Topliner, Singer, Writer",
      avatar: "/img/testimonials/3.jpg",
      text: "I had a great experience working with Loic! His production is well-elaborated, current and rich in sound! He is really supportive when working with artists, the communication is great and the whole process is exceptionally professional! Looking forward to working on more projects together!",
    },
    {
      id: 4,
      name: "Quincy Thompson",
      role: "Songwriter-Vocalist-Producer",
      avatar: "/img/testimonials/16.jpg",
      text: "Great producer even better collaborator 😎10",
    },
    {
      id: 5,
      name: "Britney Jayy",
      role: "Songwriter/Singer/R&B lover",
      avatar: "/img/testimonials/11.jpg",
      text: "AMAZING, patient, and super professional <3",
    },
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <GridBackground withAccentGlow />
      <ImmersivePageAtmosphere />
      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
        {/* HERO BIO - Split Layout */}
        <section className="relative container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[calc(100svh-5rem)] py-8 md:py-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full"
          >
            {/* Colonne GAUCHE - Tout le contenu texte (3/5) */}
            <motion.div variants={fadeInUp} className="lg:col-span-7">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center gap-3"
              >
                <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                  02
                </span>
                <NeoTag>{t("title")}</NeoTag>
              </motion.div>

              {/* Titre */}
              <h1 className="text-[14vw] md:text-[9vw] lg:text-[6.5vw] leading-[0.72] font-black uppercase tracking-[-0.08em] mb-8 text-neo-text">
                Loïc{" "}
                <span
                  className="text-transparent block lg:inline"
                  style={{ WebkitTextStroke: "2px var(--neo-text)", color: "transparent" }}
                >
                  Ghanem
                </span>
              </h1>

              {/* Bio */}
              <div className="mb-8 max-w-3xl border-l-4 border-neo-accent pl-6">
                <p className="text-lg md:text-xl lg:text-2xl font-bold leading-snug">
                  {t("bio.paragraph1")}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <BrutalistButton variant="primary" size="lg" icon={<Mail size={18} />}>
                    {t("cta.contactMe")}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>

            {/* Colonne DROITE - Photo (2/5) */}
            <motion.div
              variants={photoReveal}
              className="relative w-full lg:col-span-5 lg:self-stretch lg:flex lg:items-center"
            >
              <div className="relative w-full max-w-xs lg:max-w-md mx-auto lg:mx-0">
                {/* Card avec effet hover comme les cartes d'expertise */}
                <div className="group border-4 border-neo-border bg-neo-surface overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:shadow-[14px_14px_0px_0px_rgba(var(--neo-accent-rgb),1)]">
                  <div className="relative w-full h-[58vh] min-h-[28rem] max-h-[48rem] lg:h-[70vh]">
                    <Image
                      src="/img/slider/loic-studio-front.jpg"
                      alt="Loïc Ghanem"
                      fill
                      className="object-cover grayscale-[0.35] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />
                    {/* Location badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="absolute bottom-0 left-0 right-0 bg-neo-accent text-neo-text-inverse p-4 font-mono text-sm font-bold flex items-center gap-3 z-10"
                    >
                      <MapPin className="w-5 h-5" />
                      PARIS, FRANCE
                    </motion.div>
                  </div>
                </div>

                {/* Decorative elements with staggered animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                  className="hidden lg:block absolute -bottom-6 -right-6 w-32 h-32 border-4 border-neo-accent -z-10"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
                  className="hidden lg:block absolute -top-6 -left-6 w-20 h-20 bg-neo-accent -z-10"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-4 md:px-6 py-20 md:py-28"
        >
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-neo-accent">
                02 — {locale === "fr" ? "Mon travail" : "My work"}
              </span>
              <h2 className="mt-4 text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.86]">
                {locale === "fr" ? "Créer du son qui raconte" : "Creating sound that tells stories"}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <p className="border-t-4 border-neo-accent pt-5 text-lg leading-relaxed md:col-span-2 md:text-2xl md:font-semibold">
                {t("bio.paragraph2")}
              </p>
              <p className="border-2 border-neo-border bg-neo-surface p-6 text-base leading-relaxed shadow-[6px_6px_0px_0px_var(--neo-shadow)]">
                {t("bio.paragraph3")}
              </p>
              <p className="border-2 border-neo-border bg-neo-text p-6 text-base leading-relaxed text-neo-text-inverse shadow-[6px_6px_0px_0px_var(--neo-accent)]">
                {t("bio.paragraph4")}
              </p>
            </div>
          </div>
        </motion.section>

        <SectionTransition />

        {/* STATS */}
        <section className="bg-neo-text text-neo-text-inverse py-12 md:py-16 mb-24 md:mb-32 overflow-hidden">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="flex flex-col items-center"
                >
                  <span className="text-6xl md:text-8xl font-black text-neo-accent tracking-[-0.08em] transition-transform duration-300 hover:scale-110">
                    {stat.val}
                  </span>
                  <span className="font-mono text-sm uppercase tracking-widest mt-2 opacity-60">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SKILLS GRID */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <SectionHeader number="02.1" title={t("skills.title")} subtitle={t("skills.subtitle")} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
          >
            {skills.map((skill, i) => (
              <motion.div
                key={skill.title}
                variants={fadeInUp}
                className={i < 2 ? "lg:col-span-6" : "lg:col-span-4"}
              >
                <NeoCard
                  hover="lift"
                  padding="lg"
                  className="relative h-full min-h-72 cursor-crosshair group overflow-hidden border-4 hover:bg-neo-text hover:shadow-[10px_10px_0px_0px_var(--neo-accent)]"
                >
                  <span className="absolute -bottom-8 -right-2 font-mono text-9xl font-black text-neo-text/[0.04] group-hover:text-neo-text-inverse/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <skill.icon
                    size={40}
                    className="mb-10 text-neo-accent transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
                  />
                  <h3 className="relative text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-5 text-neo-text group-hover:text-neo-text-inverse transition-colors">
                    {skill.title}
                  </h3>
                  <ul className="font-mono text-sm space-y-2 opacity-80">
                    {skill.items.map((item: string) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 group-hover:text-neo-text-inverse transition-colors"
                      >
                        <span className="w-1.5 h-1.5 bg-neo-text group-hover:bg-neo-text-inverse" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </NeoCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <SectionTransition />

        {/* LATEST ACHIEVEMENTS */}
        <section className="py-24 md:py-32 bg-neo-surface">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader
              number="02.2"
              title={t("awards.title")}
              subtitle={t("awards.subtitle")}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-7"
            >
              {awards.map((award, index) => (
                <motion.div
                  key={`${award.title}-${award.year}`}
                  variants={fadeInUp}
                  className="lg:col-span-6"
                >
                  <NeoCard
                    hover="lift"
                    padding="none"
                    className="h-full group overflow-hidden flex flex-col relative border-4 transition-all duration-500 hover:bg-neo-text hover:shadow-[12px_12px_0px_0px_var(--neo-accent)]"
                  >
                    <span className="pointer-events-none absolute -right-3 -top-8 z-0 font-mono text-[8rem] font-black leading-none text-neo-text/[0.04] transition-colors group-hover:text-neo-text-inverse/[0.06]">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-neo-accent text-neo-on-accent border-2 border-neo-border px-3 py-1 font-mono font-bold text-sm shadow-[3px_3px_0px_0px_var(--neo-shadow)] rotate-3 inline-block">
                        {award.year}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setImageModal({
                          src: award.image,
                          title: `${award.title} — ${award.year}`,
                        })
                      }
                      className="relative h-80 md:h-96 overflow-hidden bg-white w-full text-left border-b-4 border-neo-border focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neo-accent"
                      aria-label={locale === "fr" ? "Agrandir l'image" : "Enlarge image"}
                    >
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        className="object-contain p-5 md:p-8 transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </button>

                    <div className="relative z-10 p-6 flex flex-col flex-1">
                      <h3
                        className={`${index === 0 ? "text-3xl md:text-4xl" : "text-xl"} flex items-center gap-2 font-black uppercase tracking-tighter leading-none mb-3 text-neo-text transition-colors group-hover:text-neo-text-inverse`}
                      >
                        <award.icon className="w-5 h-5 text-neo-accent" />
                        {award.title}
                      </h3>
                      <p className="font-mono text-sm text-neo-accent mb-3">{award.subtitle}</p>
                      <p className="text-sm text-neo-text/70 transition-colors group-hover:text-neo-text-inverse/80 line-clamp-4">
                        {award.description}
                      </p>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <ImageModal
          isOpen={imageModal !== null}
          onClose={() => setImageModal(null)}
          src={imageModal?.src ?? ""}
          alt={imageModal?.title ?? (locale === "fr" ? "Image" : "Image")}
          title={imageModal?.title}
        />

        <SectionTransition />

        {/* MUSICIAN EXPERIENCE */}
        <section className="bg-neo-bg py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader
              number="02.3"
              title={t("musicianExperience.title")}
              subtitle={t("musicianExperience.subtitle")}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-7"
            >
              {musicianExperience.map((project, index) => (
                <motion.article
                  key={project.name}
                  variants={fadeInUp}
                  className="group relative min-h-80 overflow-hidden border-4 border-neo-border bg-neo-surface p-6 md:p-8 shadow-[8px_8px_0px_0px_var(--neo-shadow)] transition-all duration-500 hover:-translate-y-2 hover:bg-neo-text hover:shadow-[12px_12px_0px_0px_var(--neo-accent)]"
                >
                  <span className="absolute -bottom-12 right-0 font-mono text-[10rem] font-black leading-none text-neo-text/[0.04] transition-colors group-hover:text-neo-text-inverse/[0.06]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b-2 border-neo-border pb-4 group-hover:border-neo-text-inverse/25">
                      <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-neo-accent">
                        {project.period}
                      </span>
                      <span className="bg-neo-text px-3 py-1 font-mono text-xs text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-on-accent">
                        {project.genre}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.88] mb-3 text-neo-text transition-colors group-hover:text-neo-text-inverse">
                      {project.name}
                    </h3>
                    <p className="font-mono text-sm text-neo-text/65 mb-5 transition-colors group-hover:text-neo-text-inverse/70">
                      {project.role}
                    </p>
                    <p className="max-w-xl text-sm leading-relaxed text-neo-text/70 mb-8 transition-colors group-hover:text-neo-text-inverse/80">
                      {project.description}
                    </p>
                    <YouTubeExperienceDialog
                      project={{ name: project.name, link: project.link }}
                      triggerLabel={t("musicianExperience.listenHere")}
                    />
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <SectionTransition inverted />

        {/* PERSONAL INFO - Instruments & Interests */}
        <section className="bg-neo-text text-neo-text-inverse py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {/* Instruments */}
              <motion.div variants={fadeInUp}>
                <h3 className="font-mono text-sm text-neo-accent mb-4 uppercase tracking-widest">
                  {locale === "fr" ? "Instruments" : "Instruments"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalInfo.instruments.map((instrument) => (
                    <motion.div
                      key={instrument.name}
                      whileHover={{ y: -4, rotate: -1 }}
                      className="group flex min-h-24 items-center gap-4 bg-neo-text-inverse/5 border-2 border-neo-text-inverse/25 px-5 py-4 transition-colors hover:bg-neo-accent hover:text-neo-on-accent"
                    >
                      <instrument.icon className="w-8 h-8 text-neo-accent group-hover:text-neo-on-accent" />
                      <span className="font-bold text-lg">{instrument.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div variants={fadeInUp}>
                <h3 className="font-mono text-sm text-neo-accent mb-4 uppercase tracking-widest">
                  {locale === "fr" ? "Centres d'intérêt" : "Interests"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {personalInfo.interests.map((interest) => (
                    <motion.div
                      key={interest.name}
                      whileHover={{ y: -4, rotate: 1 }}
                      className="group flex min-h-24 items-center gap-4 bg-neo-text-inverse/5 border-2 border-neo-text-inverse/25 px-5 py-4 transition-colors hover:bg-neo-accent hover:text-neo-on-accent"
                    >
                      <interest.icon className="w-8 h-8 text-neo-accent group-hover:text-neo-on-accent" />
                      <span className="font-bold text-lg">{interest.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS - SoundBetter Carousel */}
        <TestimonialsCarousel testimonials={testimonials} locale={locale} />

        <SectionTransition />

        {/* LABELS & PUBLISHERS - Enriched */}
        <section className="py-24 md:py-32 bg-neo-surface">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader
              number="02.5"
              title={t("labelsPublishers.title")}
              subtitle={t("labelsPublishers.subtitle")}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-9"
            >
              {labelPartners.map((partner) => (
                <motion.div key={partner.name} variants={fadeInUp}>
                  <NeoCard
                    hover="lift"
                    padding="none"
                    className="h-full group flex flex-col overflow-hidden border-4 transition-all duration-500 hover:bg-neo-text hover:shadow-[12px_12px_0px_0px_var(--neo-accent)]"
                  >
                    <div className="relative h-56 md:h-64 bg-white p-6 border-b-4 border-neo-border overflow-hidden">
                      {partner.isMymaLabel && (
                        <span className="absolute top-4 right-4 z-10 bg-neo-accent text-neo-on-accent border-2 border-neo-border text-[10px] font-mono font-bold px-3 py-1.5 uppercase tracking-wider shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
                          {locale === "fr" ? "Label MYMA" : "MYMA label"}
                        </span>
                      )}

                      <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain p-5 md:p-7"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-6 text-neo-text transition-colors group-hover:text-white md:p-8">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-current mb-3 text-center transition-colors">
                        {partner.name}
                      </h3>

                      {partner.period && (
                        <span className="inline-block bg-neo-text text-neo-text-inverse text-[10px] font-mono font-bold px-3 py-1.5 mb-4 self-center group-hover:bg-neo-accent group-hover:text-neo-on-accent">
                          {partner.period[localeKey]}
                        </span>
                      )}

                      {partner.description && (
                        <div className="mb-5">
                          <p className="text-sm text-current/70 leading-relaxed text-center line-clamp-3 transition-colors group-hover:text-white/80">
                            {partner.description[localeKey]}
                          </p>
                          {partner.description[localeKey].length > 120 && (
                            <button
                              onClick={() =>
                                setDescriptionModal({
                                  name: partner.name,
                                  description: partner.description![localeKey],
                                  logo: partner.logo,
                                })
                              }
                              className="mt-3 w-full text-center text-[10px] font-mono font-bold text-neo-accent transition-colors uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent"
                            >
                              {locale === "fr" ? "Voir plus →" : "Read more →"}
                            </button>
                          )}
                        </div>
                      )}

                      {partner.metrics && partner.metrics.length > 0 && (
                        <ul className="text-xs font-mono text-current/60 space-y-2 mb-5 transition-colors group-hover:text-white/70">
                          {partner.metrics.slice(0, 2).map((metric) => (
                            <li key={metric[localeKey]} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-neo-accent flex-shrink-0" />
                              <span className="truncate">{metric[localeKey]}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex-1" />

                      {partner.links.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 pt-5 border-t border-neo-border/30 group-hover:border-white/25">
                          {partner.links.map((link) => (
                            <a
                              key={`${partner.name}-${link.label}`}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-neo-text hover:bg-neo-accent border-2 border-transparent group-hover:border-neo-text-inverse/25 flex items-center justify-center transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-accent"
                              title={link.label}
                            >
                              <link.icon className="w-4 h-4 text-neo-bg group-hover/link:text-neo-text-inverse transition-colors" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Description Modal */}
        <AnimatePresence>
          {descriptionModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
              onClick={() => setDescriptionModal(null)}
            >
              <div className="absolute inset-0 bg-neo-text/90 backdrop-blur-sm" />

              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-lg bg-neo-bg border-4 border-neo-border shadow-[8px_8px_0px_0px_var(--neo-accent)]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-neo-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border-2 border-neo-border p-1 flex items-center justify-center">
                      <Image
                        src={descriptionModal.logo}
                        alt={descriptionModal.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-neo-text">
                      {descriptionModal.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setDescriptionModal(null)}
                    className="p-2 border-2 border-neo-border hover:bg-neo-text hover:text-neo-text-inverse hover:border-neo-text transition-colors"
                    aria-label={locale === "fr" ? "Fermer" : "Close"}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <p className="text-sm text-neo-text/80 leading-relaxed">
                    {descriptionModal.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <SectionTransition inverted />

        {/* CONTACT CTA */}
        <section className="py-24 bg-neo-text">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <NeoCard hover="none" variant="inverted" padding="lg" className="text-center">
                <Globe className="w-16 h-16 mx-auto mb-6 text-neo-accent" />
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-neo-text-inverse">
                  {t("cta.title")}
                </h2>
                <p className="font-mono text-lg mb-8 max-w-2xl mx-auto text-neo-text-inverse/60">
                  {t("cta.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/contact">
                    <BrutalistButton variant="dark" size="lg" icon={<Mail size={18} />}>
                      {t("cta.contactMe")}
                    </BrutalistButton>
                  </Link>
                </div>
              </NeoCard>
            </motion.div>
          </div>
        </section>
      </main>
      <NeoFooter />
    </div>
  );
};

export default NeoAbout;
