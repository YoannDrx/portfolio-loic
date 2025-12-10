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

export const NeoFooter = () => {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-neo-text text-neo-text-inverse border-t-4 border-neo-accent relative overflow-hidden"
    >
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          {/* LEFT COLUMN: CTA & Identity (7 cols) */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-neo-text-inverse/20 flex flex-col justify-between">
            {/* Top: Large CTA */}
            <div className="p-8 md:p-12 lg:p-16 flex-grow flex items-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neo-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                  <span className="text-transparent stroke-text hover:text-neo-text-inverse transition-colors duration-500">
                    {t("ctaTitle1")}
                  </span>
                  <br />
                  <span className="text-neo-accent">{t("ctaTitle2")}</span>
                </h2>
                <a
                  href="mailto:loic.ghanem@outlook.com"
                  className="group/btn inline-flex items-center gap-3 px-6 py-3 bg-neo-text-inverse text-neo-text font-bold text-lg uppercase tracking-wider hover:bg-neo-accent transition-colors duration-300"
                >
                  <span>{t("startProject")}</span>
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              </motion.div>
            </div>

            {/* Bottom: Identity */}
            <div className="p-8 border-t border-neo-text-inverse/20 bg-neo-text-inverse/5">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 bg-neo-accent text-neo-text flex items-center justify-center font-black text-2xl border-2 border-neo-accent shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  LG
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase leading-none mb-1">Loïc Ghanem</h3>
                  <p className="font-mono text-xs opacity-60 uppercase tracking-widest mb-2">
                    Composer & Producer
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-neo-accent">
                    <MapPin className="w-4 h-4" />
                    <span className="uppercase">
                      {t("basedIn")} {t("location")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Listen & Social (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Listen Section (Main part of Right Col) */}
            <div className="flex-grow p-8 flex flex-col">
              <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-neo-accent animate-pulse" />
                {t("listen")}
              </h3>

              <div className="grid grid-cols-2 gap-4 flex-grow content-start">
                {listenLinks.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 border border-neo-text-inverse/10 bg-neo-text hover:bg-neo-accent hover:border-neo-accent transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-neo-text-inverse/10 rounded-full flex items-center justify-center group-hover:bg-neo-text group-hover:text-neo-accent transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-sm uppercase tracking-tight group-hover:text-neo-text transition-colors">
                        {platform.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social & Contact Section */}
            <div className="p-8 border-t border-neo-text-inverse/20 bg-neo-text-inverse/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em]">
                    {t("social")}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-neo-accent transition-colors"
                      >
                        <Share2 className="w-3 h-3 opacity-50" />
                        <span className="uppercase font-bold tracking-wider text-xs">
                          {social.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em]">
                    Contact
                  </h3>
                  <div className="flex flex-col gap-2">
                    <a
                      href="mailto:loic.ghanem@outlook.com"
                      className="text-sm font-mono hover:text-neo-accent transition-colors break-words"
                    >
                      loic.ghanem@outlook.com
                    </a>
                    <a
                      href="tel:+33614517592"
                      className="text-sm font-mono hover:text-neo-accent transition-colors"
                    >
                      +33 6 14 51 75 92
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: COPYRIGHT */}
        <div className="p-6 border-t border-neo-text-inverse/20 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] opacity-40 hover:opacity-100 transition-opacity">
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
