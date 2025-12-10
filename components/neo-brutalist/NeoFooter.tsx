"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Music,
  Youtube,
  Share2,
  Disc,
  Headphones,
  Radio,
  Copyright,
  Mail,
  ArrowUpRight,
} from "lucide-react";

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
      className="bg-neo-bg text-neo-text-inverse border-t border-neo-text-inverse/10"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* COL 1: IDENTITY */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neo-accent text-neo-text flex items-center justify-center font-black text-lg border border-neo-accent">
                LG
              </div>
              <div className="leading-tight">
                <h3 className="font-bold uppercase tracking-wider text-neo-text-inverse">
                  Loïc Ghanem
                </h3>
                <p className="font-mono text-[10px] text-neo-text-inverse/60 uppercase">
                  Composer & Producer
                </p>
              </div>
            </div>
            <a
              href="mailto:loic.ghanem@outlook.com"
              className="inline-flex items-center gap-2 text-sm text-neo-text-inverse/60 hover:text-neo-accent transition-colors group"
            >
              <Mail className="w-4 h-4" />
              <span>loic.ghanem@outlook.com</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* COL 2: LISTEN */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] text-neo-accent uppercase tracking-[0.2em]">
              {t("listen")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {listenLinks.map((platform) => {
                const Icon = platform.icon;
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-neo-text-inverse/10 bg-neo-text-inverse/5 hover:bg-neo-accent hover:border-neo-accent hover:text-neo-text flex items-center justify-center transition-all duration-300 group"
                    title={platform.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* COL 3: SOCIALS & COPYRIGHT */}
          <div className="md:text-right space-y-4 flex flex-col items-start md:items-end">
            <h4 className="font-mono text-[10px] text-neo-accent uppercase tracking-[0.2em]">
              {t("social")}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono uppercase tracking-wider text-neo-text-inverse/60 hover:text-neo-accent transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
            <div className="pt-4 mt-auto">
              <p className="font-mono text-[10px] text-neo-text-inverse/40 flex items-center gap-1 md:justify-end">
                <Copyright className="w-3 h-3" />
                <span>{currentYear} LOÏC GHANEM.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NeoFooter;
