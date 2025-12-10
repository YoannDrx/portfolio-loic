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
  Mail,
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
      <div className="container mx-auto px-0">
        {/* HEADER SECTION: Identity & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-neo-text-inverse/20">
          {/* Logo & Name */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-neo-text-inverse/20 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-neo-accent text-neo-text flex items-center justify-center font-black text-xl border-2 border-neo-accent shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                LG
              </div>
              <div>
                <h2 className="text-xl font-black uppercase leading-none">Loïc Ghanem</h2>
                <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest">
                  Composer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
              <MapPin className="w-4 h-4 text-neo-accent" />
              <span>{t("location")}</span>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="p-8 border-b md:border-b-0 lg:border-r border-neo-text-inverse/20 flex flex-col justify-center gap-2">
            <a
              href="mailto:loic.ghanem@outlook.com"
              className="flex items-center gap-3 group hover:text-neo-accent transition-colors"
            >
              <Mail className="w-5 h-5 text-neo-accent" />
              <span className="font-bold text-sm lg:text-base">loic.ghanem@outlook.com</span>
            </a>
            <a
              href="tel:+33614517592"
              className="flex items-center gap-3 group hover:text-neo-accent transition-colors"
            >
              <Phone className="w-5 h-5 text-neo-accent" />
              <span className="font-mono text-sm opacity-80">+33 6 14 51 75 92</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="p-8 md:col-span-2 flex flex-col justify-center bg-neo-text-inverse/5">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <span className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em]">
                {t("social")}
              </span>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold uppercase hover:text-neo-accent transition-colors"
                  >
                    <Share2 className="w-4 h-4 opacity-50" />
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID: Navigation & Listen */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
          {/* Navigation (3 cols) */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-neo-text-inverse/20 p-8">
            <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-neo-accent" />
              {t("navigation")}
            </h3>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 py-1 hover:text-neo-accent transition-colors"
                >
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-6 group-hover:ml-0 duration-300" />
                  <span className="font-bold text-lg uppercase tracking-tight">
                    {tNav(link.label)}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* LISTEN (9 cols) */}
          <div className="md:col-span-8 lg:col-span-9 p-8 flex flex-col">
            <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-neo-accent animate-pulse" />
              {t("listen")}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 h-full">
              {listenLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center p-4 border border-neo-text-inverse/10 bg-neo-text hover:bg-neo-accent hover:border-neo-accent transition-all duration-300 gap-4"
                  >
                    <div className="w-12 h-12 bg-neo-text-inverse/10 rounded-full flex items-center justify-center group-hover:bg-neo-text group-hover:text-neo-accent transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center z-10">
                      <span className="block font-bold text-sm uppercase tracking-tight group-hover:text-neo-text transition-colors">
                        {platform.name}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="p-8 border-t border-neo-text-inverse/20 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-xs opacity-40 hover:opacity-100 transition-opacity">
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
    </footer>
  );
};

export default NeoFooter;
