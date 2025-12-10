"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoContactInfo } from "./NeoContactInfo";
import { GeometricIllustration } from "./GeometricIllustration";
import { BrutalistButton } from "../ui/BrutalistButton";
import { NeoTag } from "../ui/NeoTag";
import { Link } from "@/i18n/routing";

export const NeoContact = () => {
  const t = useTranslations("contact");

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text selection:bg-neo-text selection:text-neo-accent">
      <NeoNavbar />

      <main className="pt-16 md:pt-20">
        {/* Hero Split Screen */}
        <section className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] pt-8 pb-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* LEFT - Accroche + Illustration */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 flex items-center gap-3"
                >
                  <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-2 py-1">
                    06
                  </span>
                  <NeoTag>{t("hero.badge")}</NeoTag>
                </motion.div>

                {/* Titre */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[12vw] md:text-[8vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase text-neo-text"
                >
                  {t("hero.title")}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-6 text-lg max-w-2xl text-neo-text/70"
                >
                  {t("hero.description")}
                </motion.p>

                {/* Illustration géométrique */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="mt-8 hidden lg:block"
                >
                  <GeometricIllustration />
                </motion.div>
              </motion.div>

              {/* RIGHT - Infos Contact */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <NeoContactInfo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-neo-text">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-neo-text-inverse text-lg mb-6"
            >
              {t("cta.text")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <Link href="/services">
                <BrutalistButton variant="dark" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  {t("cta.button")}
                </BrutalistButton>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoContact;
