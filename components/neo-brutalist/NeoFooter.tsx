"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
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
      className="bg-neo-text text-neo-text-inverse border-t-4 border-neo-accent relative overflow-hidden transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
          {/* LEFT COLUMN: CTA & Identity (6 cols) */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-neo-text-inverse/20 flex flex-col justify-between relative">
            {/* Top: Large CTA */}
            <div className="p-8 md:p-12 lg:p-16 flex-grow flex items-center justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black uppercase leading-[0.9] mb-4 transition-all duration-300">
                  {/* Light Mode: Stroke White, Fill Transparent. Hover: Fill White */}
                  {/* Dark Mode: Fill Black. Hover: Stroke Black, Fill Transparent */}
                  <span className="block cta-text transition-colors duration-500 cursor-default">
                    {t("ctaTitle1")}
                  </span>
                  <span className="block text-neo-accent">{t("ctaTitle2")}</span>
                </h2>
              </motion.div>
            </div>

            {/* Bottom: Identity */}
            <div className="p-8 border-t border-neo-text-inverse/20 bg-neo-text-inverse/5 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-16 h-16 bg-neo-accent text-neo-text flex items-center justify-center font-black text-2xl border-2 border-neo-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  LG
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase leading-none mb-1 text-neo-text-inverse">
                    Loïc Ghanem
                  </h3>
                  <p className="font-mono text-xs opacity-60 uppercase tracking-widest mb-2 text-neo-text-inverse">
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

          {/* RIGHT COLUMN: Listen & Social (6 cols) */}
          <div className="lg:col-span-6 flex flex-col md:flex-row">
            {/* Listen Section */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-neo-text-inverse/20">
              <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-neo-accent animate-pulse" />
                {t("listen")}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {listenLinks.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center gap-2 p-4 border border-neo-text-inverse/10 bg-neo-text hover:bg-neo-accent hover:border-neo-accent transition-all duration-300 aspect-square"
                    >
                      <div className="w-8 h-8 bg-neo-text-inverse/10 rounded-full flex items-center justify-center group-hover:bg-neo-text group-hover:text-neo-accent transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] uppercase tracking-wider group-hover:text-neo-text transition-colors text-center">
                        {platform.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social & Contact Section */}
            <div className="flex-1 p-8 flex flex-col justify-between bg-neo-text-inverse/5">
              <div className="space-y-8">
                <div>
                  <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-4">
                    {t("social")}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-neo-accent transition-colors group p-2 border border-transparent hover:border-neo-text-inverse/10 bg-neo-text/0 hover:bg-neo-text"
                      >
                        <div className="w-6 h-6 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                          <Share2 className="w-3 h-3" />
                        </div>
                        <span className="uppercase font-bold tracking-wider text-xs group-hover:text-neo-text-inverse">
                          {social.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs text-neo-accent uppercase tracking-[0.2em] mb-4">
                    Contact
                  </h3>
                  <div className="flex flex-col gap-3">
                    <a
                      href="mailto:loic.ghanem@outlook.com"
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-6 h-6 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                        <Mail className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-bold hover:text-neo-accent transition-colors break-all">
                        loic.ghanem@outlook.com
                      </span>
                    </a>
                    <a href="tel:+33614517592" className="flex items-center gap-3 group">
                      <div className="w-6 h-6 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                        <Phone className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-mono font-bold hover:text-neo-accent transition-colors">
                        +33 6 14 51 75 92
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-neo-text-inverse/20 text-[10px] font-mono opacity-40">
                <div className="flex items-center gap-1 mb-2">
                  <Copyright className="w-3 h-3" />
                  <span>{currentYear} LOÏC GHANEM</span>
                </div>
                <div className="flex flex-col gap-1">
                  <a href="#" className="hover:text-neo-accent transition-colors">
                    {t("privacyPolicy")}
                  </a>
                  <a href="#" className="hover:text-neo-accent transition-colors">
                    {t("termsOfUse")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* CTA TEXT STYLING LOGIC */

        /* DEFAULT (Light Mode - Footer is Black) */
        .cta-text {
          color: transparent;
          -webkit-text-stroke: 1px #ffffff;
        }
        .cta-text:hover {
          color: #ffffff;
        }

        /* DARK MODE (Footer is White) */
        .dark .cta-text {
          color: #000000;
          -webkit-text-stroke: 0px;
        }
        .dark .cta-text:hover {
          color: transparent;
          -webkit-text-stroke: 1px #000000;
        }
      `}</style>
    </footer>
  );
};

export default NeoFooter;
