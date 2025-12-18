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
import { NeoLogo } from "./NeoLogo";
import { Link } from "@/i18n/routing";
import { useConsent } from "./legal/ConsentProvider";

const legalLinkClass =
  "font-mono text-[10px] uppercase hover:text-neo-accent transition-colors sm:tracking-[0.2em]";

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
  {
    name: "Qobuz",
    url: "https://www.qobuz.com/fr-fr/interpreter/loic-ghanem/678944",
    icon: Headphones,
  },
];

export const NeoFooter = () => {
  const t = useTranslations("footer");
  const tConsent = useTranslations("consent");
  const { openManager } = useConsent();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="bg-neo-text text-neo-text-inverse border-t-4 border-neo-accent relative overflow-hidden transition-colors duration-500"
    >
      <div className="container mx-auto px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT COLUMN: CTA & Identity (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-neo-text-inverse/20 p-8 flex flex-col justify-between gap-8">
            {/* CTA */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-5xl font-sans font-black uppercase leading-[0.9] transition-all duration-300">
                  <span className="block cta-text transition-colors duration-500 cursor-default">
                    {t("ctaTitle1")}
                  </span>
                  <span className="block text-neo-accent">{t("ctaTitle2")}</span>
                </h2>
              </motion.div>
            </div>

            {/* Identity */}
            <div className="flex flex-row items-center gap-4">
              <NeoLogo className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-black uppercase leading-none mb-1 text-neo-text-inverse">
                  Loïc Ghanem
                </h3>
                <p
                  className={`${legalLinkClass} text-neo-text-inverse/70 dark:text-neo-text-inverse/60`}
                >
                  {t("role")}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-neo-accent">
                  <MapPin className="w-3 h-3" />
                  <span className="uppercase">
                    {t("basedIn")} {t("location")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Listen, Social, Contact (7 cols) */}

          <div className="lg:col-span-7 p-8 grid grid-cols-2 gap-8 content-start w-full sm:grid-cols-3 sm:flex sm:flex-row sm:justify-between">
            {/* Listen Column */}

            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h3 className="font-mono text-[10px] text-neo-accent uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neo-accent animate-pulse" />

                {t("listen")}
              </h3>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {listenLinks.map((platform) => {
                  const Icon = platform.icon;

                  return (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold uppercase hover:text-neo-accent transition-colors group"
                    >
                      <div className="w-5 h-5 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm flex-shrink-0">
                        <Icon className="w-3 h-3" />
                      </div>

                      <span className="truncate group-hover:translate-x-1 transition-transform">
                        {platform.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social Column */}

            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-neo-accent uppercase tracking-[0.2em]">
                {t("social")}
              </h3>

              <div className="flex flex-col gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs font-bold uppercase hover:text-neo-accent transition-colors group"
                  >
                    <div className="w-5 h-5 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                      <Share2 className="w-3 h-3" />
                    </div>

                    <span className="group-hover:translate-x-1 transition-transform">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Column */}

            <div className="space-y-4">
              <h3 className="font-mono text-[10px] text-neo-accent uppercase tracking-[0.2em]">
                Contact
              </h3>

              <div className="flex flex-col gap-2">
                <a
                  href="mailto:loic.ghanem@outlook.com"
                  className="flex items-center gap-3 text-xs font-bold hover:text-neo-accent transition-colors group"
                >
                  <div className="w-5 h-5 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                    <Mail className="w-3 h-3" />
                  </div>

                  <span className="truncate group-hover:translate-x-1 transition-transform">
                    Email Me
                  </span>
                </a>

                <a
                  href="tel:+33614517592"
                  className="flex items-center gap-3 text-xs font-bold hover:text-neo-accent transition-colors group"
                >
                  <div className="w-5 h-5 flex items-center justify-center bg-neo-text-inverse/10 text-neo-text-inverse group-hover:bg-neo-accent group-hover:text-neo-text transition-colors rounded-sm">
                    <Phone className="w-3 h-3" />
                  </div>

                  <span className="group-hover:translate-x-1 transition-transform">
                    +33 6 14 51 75 92
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="px-8 py-4 border-t border-neo-text-inverse/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 font-mono text-[10px] opacity-40">
          <div className="flex items-center gap-1">
            <span>{t("copyright", { year: currentYear })}</span>
          </div>
          <div className="flex flex-col gap-2 items-start md:flex-row md:items-center md:gap-6">
            <Link href="/privacy-policy" className={legalLinkClass}>
              {t("privacyPolicy")}
            </Link>
            <Link href="/terms-of-use" className={legalLinkClass}>
              {t("termsOfUse")}
            </Link>
            <button type="button" onClick={openManager} className={legalLinkClass}>
              {tConsent("manageCookies")}
            </button>
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
