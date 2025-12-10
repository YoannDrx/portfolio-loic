"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle2, Lock, Mail, Phone, Scale, ScrollText, ShieldCheck } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoHeroSection } from "../ui/NeoHeroSection";
import { NeoTag } from "../ui/NeoTag";

type LegalPageType = "privacy" | "terms";

interface LegalSection {
  title: string;
  description?: string;
  bullets?: string[];
}

interface ContactChannel {
  label: string;
  value: string;
  href?: string;
}

interface Highlight {
  title: string;
  description: string;
}

export const NeoLegalPage: React.FC<{ type: LegalPageType }> = ({ type }) => {
  const t = useTranslations(`legal.${type}`);
  const common = useTranslations("legal.common");

  const hero = t.raw("hero") as { badge?: string; title: string; description?: string };
  const summary = (t.raw("summary") as string[]) || [];
  const sections = (t.raw("sections") as LegalSection[]) || [];
  const highlights = (t.raw("highlights") as Highlight[]) || [];
  const contactChannels = (t.raw("contactChannels") as ContactChannel[]) || [];
  const lastUpdated = t("lastUpdated");

  const highlightIcons = [type === "privacy" ? ShieldCheck : ScrollText, Lock, Scale];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent">
      <NeoNavbar />

      <main className="pt-20">
        <NeoHeroSection
          badgeNumber={type === "privacy" ? "07" : "08"}
          badge={hero?.badge}
          title={hero?.title || ""}
          description={hero?.description}
          variant="dark"
          align="left"
          titleClassName="text-neo-text-inverse"
        >
          <div className="flex flex-wrap items-center gap-3">
            <NeoTag variant="accent">
              {common("lastUpdatedLabel")}: {lastUpdated}
            </NeoTag>
            <NeoTag>{t("pageTitle")}</NeoTag>
          </div>
        </NeoHeroSection>

        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col gap-4 mb-8">
            <p className="font-mono text-xs uppercase text-neo-accent tracking-[0.25em]">
              {common("summaryTitle")}
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              {t("pageTitle")}
            </h2>
            <p className="text-neo-text/70 max-w-4xl">{t("pageDescription")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summary.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-3 items-start border-2 border-neo-border bg-neo-surface p-4 shadow-[4px_4px_0px_0px_var(--neo-border)]"
              >
                <CheckCircle2 className="w-5 h-5 text-neo-accent mt-1" />
                <p className="text-sm leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {highlights.length > 0 && (
          <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-12">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col gap-3 mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-neo-accent">
                  {common("highlightsTitle")}
                </span>
                <p className="text-base md:text-lg opacity-80 max-w-4xl">{t("pageDescription")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {highlights.map((highlight, idx) => {
                  const Icon = highlightIcons[idx % highlightIcons.length];
                  return (
                    <div
                      key={highlight.title}
                      className="h-full border-2 border-neo-text-inverse/30 bg-neo-text text-neo-text-inverse p-6 shadow-[6px_6px_0px_0px_var(--neo-accent)]"
                    >
                      <Icon className="w-8 h-8 text-neo-accent mb-4" />
                      <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-neo-text-inverse">
                        {highlight.title}
                      </h3>
                      <p className="text-sm opacity-80 leading-relaxed text-neo-text-inverse">
                        {highlight.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="flex flex-col gap-3 mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neo-accent">
              {common("sectionsTitle")}
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              {t("pageTitle")}
            </h2>
          </div>

          <div className="space-y-8">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="border-2 border-neo-border bg-neo-surface p-6 md:p-8 shadow-[6px_6px_0px_0px_var(--neo-border)]"
              >
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-neo-text text-neo-text-inverse flex items-center justify-center font-black text-lg shadow-[4px_4px_0px_0px_var(--neo-accent)]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                      {section.title}
                    </h3>
                    {section.description && (
                      <p className="text-sm md:text-base text-neo-text/80 leading-relaxed">
                        {section.description}
                      </p>
                    )}
                    {section.bullets && (
                      <ul className="space-y-2">
                        {section.bullets.map((bullet, bulletIdx) => (
                          <li
                            key={bulletIdx}
                            className="flex items-start gap-2 text-sm leading-relaxed"
                          >
                            <span className="mt-1 h-2 w-2 rounded-full bg-neo-accent" aria-hidden />
                            <span className="flex-1">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 pb-20">
          <div className="border-2 border-neo-border bg-neo-accent text-neo-text p-8 md:p-10 shadow-[8px_8px_0px_0px_var(--neo-border)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-neo-text">
                  {common("contactTitle")}
                </p>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  {t("pageTitle")}
                </h3>
                <p className="text-sm md:text-base max-w-2xl">{t("contactIntro")}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.value}
                    href={channel.href || "#"}
                    className="flex items-center gap-3 bg-neo-text text-neo-text-inverse px-4 py-3 border-2 border-neo-border hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_var(--neo-border)]"
                  >
                    {channel.label.toLowerCase().includes("mail") ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs uppercase font-mono opacity-70">
                        {channel.label}
                      </span>
                      <span className="font-bold text-sm">{channel.value}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};
