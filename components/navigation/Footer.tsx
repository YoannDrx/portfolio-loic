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
    <footer className="relative bg-glass-strong backdrop-blur-xl backdrop-brightness-50 border-t border-[var(--glass-border)] text-foreground/80 font-inter overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-neon-lime p-[2px] group-hover:scale-110 transition-transform">
                <div className="w-full h-full bg-background rounded-lg flex items-center justify-center transition-colors duration-300">
                  <span className="text-2xl font-black bg-gradient-to-br from-neon-green to-neon-lime bg-clip-text text-transparent">LG</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-foreground transition-all duration-300 font-montserrat tracking-tight">
                  LOÏC<span className="text-primary dark:text-neon-lime">.GHANEM</span>
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest font-mono">{tFooter("tagline")}</div>
              </div>
            </Link>
            <p className="text-foreground/70 leading-relaxed max-w-md mb-8 font-light">{t("about.pageDescription")}</p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-lg bg-[var(--glass-hover)] border border-[var(--glass-border)] flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_15px_var(--accent-glow)] transition-all duration-300"
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
            <h3 className="text-lg font-bold text-foreground font-montserrat tracking-wide mb-6 uppercase">{tFooter("quickLinks")}</h3>
            <ul className="grid grid-cols-2 gap-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-primary dark:hover:text-neon-lime transition-colors duration-300 inline-flex items-center gap-2 group font-medium tracking-wide text-sm"
                  >
                    <span className="w-1 h-1 rounded-full bg-foreground/20 group-hover:bg-primary dark:group-hover:bg-neon-lime group-hover:shadow-[0_0_5px_var(--accent-glow)] transition-all duration-300" />
                    <span className="uppercase">{tNav(link.key.split(".")[1])}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground font-montserrat tracking-wide mb-6 uppercase">{t("contact.pageTitle")}</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="mailto:loic.ghanem@outlook.com"
                  className="text-foreground/70 hover:text-primary transition-colors duration-300 inline-flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded bg-[var(--glass-hover)] flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  loic.ghanem@outlook.com
                </a>
              </li>
              <li className="text-foreground/70 flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-[var(--glass-hover)] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                 </div>
                 <span className="text-sm">Paris, France</span>
              </li>
            </ul>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-primary dark:border-neon-green bg-transparent text-primary dark:text-neon-green font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-primary/10 hover:shadow-[0_0_20px_var(--accent-glow)] group"
            >
              {tFooter("followMe")}
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-[var(--glass-border)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
              {tFooter("copyright", { year: currentYear })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}