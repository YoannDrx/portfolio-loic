"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const NeoHero: React.FC = () => {
  const t = useTranslations("home.hero");

  return (
    <section className="container mx-auto px-4 md:px-6 mb-24 min-h-[calc(100vh-8rem)] flex flex-col justify-center relative">
      <div className="relative">
        {/* Decorative labels */}
        <div className="absolute -top-12 left-0 font-mono text-xs font-bold text-neo-accent flex items-center gap-2">
          <div className="w-2 h-2 bg-neo-accent animate-pulse"></div>
          {t("basedIn")}
        </div>

        <motion.h1
          className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter uppercase break-words mb-8 text-neo-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t("music")} <br />
          {/* Style néo-brutaliste pour Composer - effet stamp/tampon */}
          <span
            className="inline-block relative px-2 md:px-4 py-1 -rotate-2 bg-neo-accent text-neo-text-inverse border-4 border-neo-text shadow-[6px_6px_0px_0px_var(--neo-text)] my-2 whitespace-nowrap"
            style={{
              fontStretch: "condensed",
              letterSpacing: "-0.05em",
            }}
          >
            {t("composer")}
          </span>{" "}
          <br />
          <span className="whitespace-nowrap">{t("producer")}</span>
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center gap-8 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-mono text-sm md:text-base font-medium max-w-md border-l-4 border-neo-accent pl-6 bg-neo-surface p-4 shadow-neo text-neo-text">
            {t("tagline")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};
