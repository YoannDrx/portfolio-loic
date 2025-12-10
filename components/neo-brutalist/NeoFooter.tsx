"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  ArrowUpRight,
  Phone,
  MapPin,
  Music,
  Youtube,
  Share2,
  Disc,
  Headphones,
  Radio,
  Copyright,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

const socialLinks = [
  { name: "Facebook", url: "https://www.facebook.com/loic.leduc.54" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/lo%C3%AFc-ghanem/" },
  {
    name: "SoundBetter",
    url: "https://soundbetter.com/profiles/402365-lo%C3%AFc-ghanem--voyager1",
  },
];

const listenLinks = [
  { name: "Tidal", url: "https://tidal.com/artist/10603532", icon: Disc },
  { name: "Deezer", url: "https://www.deezer.com/fr/artist/5642263", icon: Music },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UCLbxfVx61feUL3uw2me9tSA",
    icon: Youtube,
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/fr/artist/loic-ghanem/464997920",
    icon: Disc,
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/intl-fr/artist/3PPQlrmOzl6QUBSP3gcyLA",
    icon: Headphones,
  },
  { name: "SoundCloud", url: "https://soundcloud.com/loic-ghanem", icon: Radio },
];

const navLinks = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/services", label: "services" },
  { href: "/albums", label: "albums" },
  { href: "/videos", label: "videos" },
  { href: "/contact", label: "contact" },
];

export const NeoFooter = () => {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-neo-text text-neo-text-inverse border-t-4 border-neo-accent relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-neo-accent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-0">
        {/* TOP SECTION: CTA & BRANDING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neo-text-inverse/20">
          {/* Brand / Logo Area */}
          <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-neo-text-inverse/20 flex flex-col justify-between min-h-[300px] relative group">
            <div className="absolute inset-0 bg-neo-accent/0 group-hover:bg-neo-accent/5 transition-colors duration-500" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-neo-accent text-neo-text flex items-center justify-center font-black text-3xl border-2 border-neo-accent shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                LG
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">
                Loïc
                <br />
                Ghanem
              </h2>
              <p className="font-mono text-sm text-neo-text-inverse/60 tracking-wider">
                COMPOSER & PRODUCER
              </p>
            </motion.div>

            <div className="mt-8">
              <p className="font-mono text-xs text-neo-accent uppercase tracking-widest mb-2">
                {t("basedIn")}
              </p>
              <div className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="w-5 h-5 text-neo-accent" />
                <span>{t("location")}</span>
              </div>
            </div>
          </div>

          {/* Large CTA Area */}
          <div className="lg:col-span-8 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neo-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <motion.h2
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] relative z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-transparent stroke-text hover:text-neo-text-inverse transition-colors duration-500">
                {t("ctaTitle1")}
              </span>
              <br />
              <span className="text-neo-accent">{t("ctaTitle2")}</span>
            </motion.h2>

            <div className="mt-12 flex flex-wrap gap-6 relative z-10">
              <a
                href="mailto:loic.ghanem@outlook.com"
                className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-neo-text-inverse text-neo-text font-bold text-lg uppercase tracking-wider hover:bg-neo-accent transition-colors duration-300"
              >
                <span>{t("startProject")}</span>
                <ArrowUpRight className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </a>
              <a
                href="tel:+33614517592"
                className="inline-flex items-center gap-3 px-8 py-4 border border-neo-text-inverse/30 hover:border-neo-accent hover:text-neo-accent font-mono text-sm uppercase tracking-wider transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                <span>+33 6 14 51 75 92</span>
              </a>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-neo-text-inverse/20">
          {/* Navigation Column */}
          <div className="border-b md:border-b-0 md:border-r border-neo-text-inverse/20 p-8">
            <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-neo-accent" />
              {t("navigation")}
            </h3>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between py-2 border-b border-neo-text-inverse/10 hover:border-neo-accent transition-colors"
                >
                  <span className="font-bold text-lg uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                    {tNav(link.label)}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 text-neo-accent transition-opacity">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Column */}
          <div className="border-b md:border-b-0 lg:border-r border-neo-text-inverse/20 p-8">
            <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-neo-accent" />
              {t("social")}
            </h3>
            <div className="flex flex-col gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group p-3 border border-transparent hover:border-neo-text-inverse/20 hover:bg-neo-text-inverse/5 transition-all"
                >
                  <div className="w-10 h-10 bg-neo-text-inverse/10 flex items-center justify-center text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm uppercase tracking-wider">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* LISTEN Column (Span 2) */}
          <div className="md:col-span-2 p-8 bg-neo-text-inverse/5">
            <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-2 h-2 bg-neo-accent animate-pulse" />
              {t("listen")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listenLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 p-4 border border-neo-text-inverse/10 bg-neo-text hover:bg-neo-accent hover:border-neo-accent transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transform translate-x-1/3 -translate-y-1/3 transition-transform">
                      <Icon className="w-24 h-24 text-neo-text-inverse group-hover:text-neo-text" />
                    </div>

                    <div className="relative z-10 w-12 h-12 bg-neo-text-inverse/10 rounded-full flex items-center justify-center group-hover:bg-neo-text group-hover:text-neo-accent transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="relative z-10">
                      <span className="block font-bold text-lg uppercase tracking-tight group-hover:text-neo-text transition-colors">
                        {platform.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 group-hover:text-neo-text group-hover:opacity-80">
                        {t("streamNow")}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Copyright className="w-3 h-3" />
            <span>{t("copyright", { year: currentYear })}</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-neo-accent transition-colors">
              {t("privacyPolicy")}
            </a>
            <a href="#" className="hover:text-neo-accent transition-colors">
              {t("termsOfUse")}
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </footer>
  );
};

export default NeoFooter;
