"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { BrutalistButton } from "./ui/BrutalistButton";
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
  { name: "Spotify", url: "https://open.spotify.com/intl-fr/artist/3PPQlrmOzl6QUBSP3gcyLA" },
  { name: "Deezer", url: "https://www.deezer.com/fr/artist/5642263/top_track" },
  {
    name: "Apple Music",
    url: "https://music.apple.com/fr/artist/loic-ghanem/464997920/see-all?section=top-songs",
  },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCLbxfVx61feUL3uw2me9tSA" },
  { name: "Tidal", url: "https://tidal.com/artist/10603532/u" },
];

export const NeoFooter = () => {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer
      id="contact"
      className="bg-neo-text text-neo-text-inverse pt-12 pb-6 border-t-4 border-neo-accent"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Grid - 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* LEFT - Branding + Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              <span className="text-neo-bg">{t("letsCreate")}</span>{" "}
              <span className="text-neo-accent">{t("together")}</span>
            </h2>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 bg-neo-accent text-neo-text flex items-center justify-center font-black text-lg border-2 border-neo-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
                LG
              </div>
              <span className="font-bold text-lg text-neo-text-inverse">Loïc Ghanem</span>
            </div>
            <p className="font-mono text-xs text-neo-text-inverse/60 mb-6">{t("tagline")}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <Link href="/">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("home")}
                </BrutalistButton>
              </Link>
              <Link href="/about">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("about")}
                </BrutalistButton>
              </Link>
              <Link href="/services">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("services")}
                </BrutalistButton>
              </Link>
              <Link href="/albums">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("albums")}
                </BrutalistButton>
              </Link>
              <Link href="/videos">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("videos")}
                </BrutalistButton>
              </Link>
              <Link href="/contact">
                <BrutalistButton variant="dark" size="sm">
                  {tNav("contact")}
                </BrutalistButton>
              </Link>
            </div>
          </motion.div>

          {/* RIGHT - Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:text-right"
          >
            <h3 className="font-mono text-xs uppercase tracking-wider opacity-50 mb-4">Contact</h3>
            <a
              href="tel:+33614517592"
              className="block text-lg font-bold hover:text-neo-accent transition-colors mb-2"
            >
              +33 6 14 51 75 92
            </a>
            <a
              href="mailto:loic.ghanem@outlook.com"
              className="block opacity-80 hover:text-neo-accent transition-colors mb-6"
            >
              loic.ghanem@outlook.com
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.2em] opacity-80 hover:opacity-100 hover:text-neo-accent transition-colors mb-4"
            >
              {tNav("contact")}
              <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:justify-end w-full md:w-auto">
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-text-inverse/60">
                  {t("social")}
                </p>
                <div className="flex flex-col gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:opacity-100 hover:text-neo-accent transition-all text-sm flex items-center gap-1"
                    >
                      {social.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-text-inverse/60">
                  {t("listen")}
                </p>
                <div className="flex flex-col gap-2">
                  {listenLinks.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:opacity-100 hover:text-neo-accent transition-all text-sm flex items-center gap-1"
                    >
                      {platform.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neo-text-inverse/20 flex justify-between items-center font-mono text-xs opacity-50">
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
          <span>{t("location")}</span>
        </div>
      </div>
    </footer>
  );
};

export default NeoFooter;
