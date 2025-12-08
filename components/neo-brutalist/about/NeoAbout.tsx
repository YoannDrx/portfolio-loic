"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  MapPin,
  Music,
  Headphones,
  Mic2,
  Sliders,
  Globe,
  Building2,
  BookOpen,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  Award,
  Trophy,
  Guitar,
  Play,
  Star,
  Gamepad2,
  Film,
  Piano,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { BrutalistButton } from "../ui/BrutalistButton";
import { SectionHeader } from "../ui/SectionHeader";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoCard } from "../ui/NeoCard";
import { NeoTimeline } from "./NeoTimeline";
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
  date: string;
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
        <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-neo-text truncate">{testimonial.name}</h4>
        <p className="font-mono text-xs text-neo-text/60 truncate">{testimonial.role}</p>
        <p className="font-mono text-xs text-neo-accent">{testimonial.date}</p>
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

  // Duplicate array for infinite loop effect
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const offset = testimonials.length; // Start from middle set

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

  // Calculate the translateX percentage
  // Each card is ~33.33% width on desktop with gap
  const getTranslateX = () => {
    // We show 3 cards at a time, so each step moves by 1 card width (~33.33%)
    return `calc(-${(currentIndex + offset) * 33.333}% - ${(currentIndex + offset) * 8}px)`;
  };

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
              <span className="bg-neo-text text-neo-accent px-2 py-1">05</span>
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

        {/* Carousel - Sliding container */}
        <div className="relative overflow-hidden py-2 -my-2">
          <motion.div
            className="flex gap-6 pt-2"
            animate={{ x: getTranslateX() }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {extendedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
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

export const NeoAbout = ({ locale }: { locale: string }) => {
  const t = useTranslations("about");

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
    { val: "16", label: t("achievements.albums") },
    { val: "34", label: t("achievements.projects") },
    { val: "50+", label: t("achievements.collaborations") },
    { val: "15+", label: t("achievements.years") },
  ];

  const labels = [
    {
      name: "Infinity Scores",
      publisher: "Cezame Music Agency",
      since: "2019",
      tracks: "45+",
      type: "Label",
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
      name: "Montmorency Music",
      publisher: "MYMA",
      since: "2020",
      tracks: "28+",
      type: "Label",
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
    },
    {
      name: "Justement Music",
      publisher: "Self-published",
      since: "2018",
      tracks: "60+",
      type: "Label",
      links: [
        {
          icon: Youtube,
          url: "https://www.youtube.com/playlist?list=PLJlRZETQILeOzFn01l_GqRtPoDWGtGdcg",
          label: "YouTube",
        },
      ],
    },
  ];

  const awards = [
    {
      title: t("awards.pma2024.title"),
      subtitle: t("awards.pma2024.category"),
      description: t("awards.pma2024.description"),
      image: "/img/about/PMA-2024-Metal-nomination.jpg",
      link: "https://www.productionmusicawards.com/",
      year: t("awards.pma2024.year"),
      icon: Trophy,
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
      title: t("awards.mark.title"),
      subtitle: t("awards.mark.category"),
      description: t("awards.mark.description"),
      image: "/img/about/Marks-Awards.jpg",
      link: "https://markawards.com/",
      year: t("awards.mark.year"),
      icon: Award,
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
      date: "2 months ago",
    },
    {
      id: 2,
      name: "Amelia Bushell",
      role: "Vocalist",
      avatar: "/img/testimonials/2.jpg",
      text: "Very fun working with Loïc. He knows exactly what he wants and together we made something awesome! He gave great feedback and was a very nice person. I hope to work together again!",
      date: "4 months ago",
    },
    {
      id: 3,
      name: "Julaiah",
      role: "Topliner, Singer, Writer",
      avatar: "/img/testimonials/3.jpg",
      text: "I had a great experience working with Loic! His production is well-elaborated, current and rich in sound! He is really supportive when working with artists, the communication is great and the whole process is exceptionally professional! Looking forward to working on more projects together!",
      date: "about a year ago",
    },
    {
      id: 4,
      name: "Quincy Thompson",
      role: "Songwriter-Vocalist-Producer",
      avatar: "/img/testimonials/16.jpg",
      text: "Great producer even better collaborator 😎10",
      date: "2 years ago",
    },
    {
      id: 5,
      name: "Britney Jayy",
      role: "Songwriter/Singer/R&B lover",
      avatar: "/img/testimonials/11.jpg",
      text: "AMAZING, patient, and super professional <3",
      date: "2 years ago",
    },
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-32">
        {/* HERO BIO - Split Layout */}
        <section className="container mx-auto px-4 md:px-6 mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-12 items-center min-h-[70vh]"
          >
            {/* Colonne GAUCHE - Tout le contenu texte (3/5) */}
            <motion.div variants={fadeInUp} className="order-2 lg:order-1 lg:col-span-3">
              {/* Badge */}
              <div className="font-mono font-bold text-neo-accent mb-6 flex items-center gap-2">
                <span className="bg-neo-text text-neo-accent px-2 py-1">BIO.01</span>
                <span className="text-neo-text/60">// {t("title").toUpperCase()}</span>
              </div>

              {/* Titre */}
              <h1 className="text-[12vw] lg:text-[6vw] leading-[0.85] font-black uppercase tracking-tighter mb-8 text-neo-text">
                Loïc{" "}
                <span
                  className="text-transparent block lg:inline"
                  style={{ WebkitTextStroke: "2px var(--neo-text)", color: "transparent" }}
                >
                  Ghanem
                </span>
              </h1>

              {/* Bio */}
              <div className="text-base md:text-lg font-medium leading-relaxed space-y-4 border-l-4 border-neo-accent pl-6 mb-8">
                <p>{t("bio.paragraph1")}</p>
                <p className="opacity-80">{t("bio.paragraph2")}</p>
                <p className="opacity-80">{t("bio.paragraph3")}</p>
                <p className="opacity-70">{t("bio.paragraph4")}</p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={`/api/cv/download?locale=${locale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BrutalistButton variant="primary" size="lg" icon={<Download size={18} />}>
                    {t("cta.downloadCV")}
                  </BrutalistButton>
                </a>
                <Link href="/contact">
                  <BrutalistButton variant="secondary" size="lg" icon={<Mail size={18} />}>
                    {t("cta.contactMe")}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>

            {/* Colonne DROITE - Photo (2/5) */}
            <motion.div
              variants={photoReveal}
              className="relative order-1 lg:order-2 w-full lg:col-span-2"
            >
              <div className="relative max-w-xs lg:max-w-sm mx-auto lg:mx-0">
                {/* Card avec effet hover comme les cartes d'expertise */}
                <div className="group border-2 border-neo-border bg-neo-surface overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(var(--neo-accent-rgb),1)] hover:border-black">
                  <div className="relative w-full" style={{ paddingBottom: "133%" }}>
                    <Image
                      src="/img/slider/loic-studio-front.jpg"
                      alt="Loïc Ghanem"
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
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

        {/* STATS */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-16 mb-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {stats.map((stat, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center">
                  <span className="text-6xl md:text-7xl font-black text-neo-accent tracking-tighter">
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
          <SectionHeader number="02" title={t("skills.title")} subtitle={t("skills.subtitle")} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {skills.map((skill, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <NeoCard
                  hover="lift"
                  padding="lg"
                  className="h-full cursor-crosshair group hover:bg-neo-accent"
                >
                  <skill.icon
                    size={40}
                    className="mb-6 text-neo-accent group-hover:text-neo-text transition-colors"
                  />
                  <h3 className="text-2xl font-black uppercase mb-4 text-neo-text group-hover:text-neo-text-inverse transition-colors">
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

        {/* LATEST ACHIEVEMENTS */}
        <section className="py-24 bg-neo-surface">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader number="03" title={t("awards.title")} subtitle={t("awards.subtitle")} />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {awards.map((award, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <NeoCard hover="lift" padding="none" className="h-full group overflow-hidden">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden bg-neo-text/5">
                      <Image
                        src={award.image}
                        alt={award.title}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                      {/* Year badge */}
                      <div className="absolute top-4 left-4 bg-neo-accent text-neo-text-inverse px-3 py-1 font-mono font-bold text-sm">
                        {award.year}
                      </div>
                      {/* Icon overlay */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-neo-text flex items-center justify-center">
                        <award.icon className="w-6 h-6 text-neo-accent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-neo-text">
                        {award.title}
                      </h3>
                      <p className="font-mono text-sm text-neo-accent mb-3">{award.subtitle}</p>
                      <p className="text-sm opacity-70 mb-4 line-clamp-3">{award.description}</p>
                      <a
                        href={award.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-sm font-bold text-neo-text hover:text-neo-accent transition-colors"
                      >
                        {t("awards.learnMore")}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TIMELINE - Parcours Professionnel */}
        <NeoTimeline />

        {/* MUSICIAN EXPERIENCE */}
        <section className="container mx-auto px-4 md:px-6 py-24">
          <SectionHeader
            number="04"
            title={t("musicianExperience.title")}
            subtitle={t("musicianExperience.subtitle")}
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {musicianExperience.map((project, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <NeoCard hover="lift" padding="lg" className="h-full group relative">
                  {/* Current badge */}
                  {project.isCurrent && (
                    <div className="absolute -top-3 -right-3 bg-neo-accent text-neo-text-inverse px-3 py-1 font-mono text-xs font-bold border-2 border-neo-border">
                      {locale === "fr" ? "ACTUEL" : "CURRENT"}
                    </div>
                  )}

                  {/* Period */}
                  <div className="font-mono text-xs text-neo-accent mb-2">{project.period}</div>

                  {/* Project name */}
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-neo-text group-hover:text-neo-accent transition-colors">
                    {project.name}
                  </h3>

                  {/* Role */}
                  <p className="font-mono text-sm text-neo-text/70 mb-1">{project.role}</p>

                  {/* Genre badge */}
                  <div className="inline-block bg-neo-text text-neo-text-inverse px-2 py-1 font-mono text-xs mb-4">
                    {project.genre}
                  </div>

                  {/* Description */}
                  <p className="text-sm opacity-60 mb-4">{project.description}</p>

                  {/* Listen link */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-sm font-bold text-neo-accent hover:text-neo-text transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    {t("musicianExperience.listenHere")}
                  </a>
                </NeoCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* PERSONAL INFO - Instruments & Interests */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-16">
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
                <div className="flex flex-wrap gap-4">
                  {personalInfo.instruments.map((instrument, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-neo-text-inverse/10 border-2 border-neo-text-inverse/20 px-4 py-3"
                    >
                      <instrument.icon className="w-6 h-6 text-neo-accent" />
                      <span className="font-bold text-lg">{instrument.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div variants={fadeInUp}>
                <h3 className="font-mono text-sm text-neo-accent mb-4 uppercase tracking-widest">
                  {locale === "fr" ? "Centres d'intérêt" : "Interests"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {personalInfo.interests.map((interest, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-neo-text-inverse/10 border-2 border-neo-text-inverse/20 px-4 py-3"
                    >
                      <interest.icon className="w-6 h-6 text-neo-accent" />
                      <span className="font-bold text-lg">{interest.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS - SoundBetter Carousel */}
        <TestimonialsCarousel testimonials={testimonials} locale={locale} />

        {/* LABELS & PUBLISHERS - Enriched */}
        <section className="py-24 bg-neo-surface">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader
              number="07"
              title={t("labelsPublishers.title")}
              subtitle={t("labelsPublishers.subtitle")}
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {labels.map((label) => (
                <motion.div key={label.name} variants={fadeInUp}>
                  <NeoCard hover="lift" padding="lg" className="h-full group">
                    {/* Label Initials */}
                    <div className="w-16 h-16 bg-neo-accent flex items-center justify-center mb-6 border-2 border-neo-border">
                      <span className="text-2xl font-black text-neo-text-inverse">
                        {label.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </span>
                    </div>

                    {/* Label Name */}
                    <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-neo-text">
                      {label.name}
                    </h3>

                    {/* Details */}
                    <div className="space-y-3 font-mono text-sm mb-6">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-neo-accent" />
                        <span className="opacity-70">{label.publisher}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-neo-accent" />
                        <span className="opacity-70">{label.tracks} tracks</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-neo-text text-neo-text-inverse px-2 py-1">
                          Since {label.since}
                        </span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-neo-border">
                      {label.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-neo-text hover:bg-neo-accent flex items-center justify-center transition-colors group/link"
                          title={link.label}
                        >
                          <link.icon className="w-4 h-4 text-neo-accent group-hover/link:text-neo-text-inverse transition-colors" />
                        </a>
                      ))}
                    </div>

                    {/* Decorative corner */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-neo-accent opacity-20 group-hover:opacity-40 transition-opacity" />
                  </NeoCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

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
                  <a
                    href={`/api/cv/download?locale=${locale}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BrutalistButton variant="dark" size="lg" icon={<Download size={18} />}>
                      {t("cta.downloadCV")}
                    </BrutalistButton>
                  </a>
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
