"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Facebook, Linkedin, Youtube, Cloud, Star, Mail } from "lucide-react";

const footerLinks = {
  navigation: [
    { href: "/" as const, key: "nav.home" },
    { href: "/about" as const, key: "nav.about" },
    { href: "/services" as const, key: "nav.services" },
    { href: "/albums" as const, key: "nav.albums" },
    { href: "/videos" as const, key: "nav.videos" },
    { href: "/contact" as const, key: "nav.contact" },
  ],
  social: [
    { href: "https://www.facebook.com/loic.leduc.54", icon: Facebook, label: "Facebook" },
    { href: "https://www.youtube.com/@LoicGhanem", icon: Youtube, label: "YouTube" },
    { href: "https://soundcloud.com/loic-ghanem", icon: Cloud, label: "SoundCloud" },
    { href: "https://www.linkedin.com/in/lo%C3%AFc-ghanem/", icon: Linkedin, label: "LinkedIn" },
    { href: "https://soundbetter.com/profiles/402365-lo%C3%AFc-ghanem--voyager1", icon: Star, label: "SoundBetter" },
  ],
};

export default function Footer() {
  const t = useTranslations();
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white dark:from-obsidian-50 dark:to-obsidian border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent pointer-events-none dark:opacity-100 opacity-30 transition-opacity duration-300" />

      <div className="container-custom relative">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta p-[2px] group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-white dark:bg-obsidian rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-2xl font-black text-gradient-neon">LG</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-gradient-neon transition-all duration-300">Loïc Ghanem</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{tFooter("tagline")}</div>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mb-6 transition-colors duration-300">{t("about.pageDescription")}</p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-neon-cyan/20 hover:border-neon-cyan/30 hover:text-neon-cyan transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{tFooter("quickLinks")}</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-neon-cyan transition-all duration-300" />
                    {tNav(link.key.split(".")[1])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{t("contact.pageTitle")}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:loic.ghanem@outlook.com"
                  className="text-gray-600 dark:text-gray-400 hover:text-neon-cyan transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  loic.ghanem@outlook.com
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <span className="block text-sm">Paris, France</span>
              </li>
            </ul>

            {/* Newsletter CTA */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 border border-neon-cyan/20 dark:border-neon-cyan/20 transition-colors duration-300">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">{tFooter("followMe")}</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-neon-cyan hover:text-neon-magenta transition-colors duration-300"
              >
                {t("contact.pageTitle")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{tFooter("copyright", { year: currentYear })}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
