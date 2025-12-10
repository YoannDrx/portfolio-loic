"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Music4, Disc, Sliders, Mic2, Radio, ArrowRight, CheckCircle } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoHeroSection } from "../ui/NeoHeroSection";
import { NeoCard } from "../ui/NeoCard";
import { BrutalistButton } from "../ui/BrutalistButton";
import { NeoTag } from "../ui/NeoTag";
import { Link } from "@/i18n/routing";

interface Service {
  id: string;
  title: string;
  text: string;
  fullDescription?: string;
  descriptionsFr?: string | null;
  descriptionsEn?: string | null;
}

interface NeoServicesPageProps {
  services: Service[];
}

const getIconForService = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("compo")) return Music4;
  if (lowerTitle.includes("produc")) return Disc;
  if (lowerTitle.includes("mix")) return Sliders;
  if (lowerTitle.includes("master")) return Radio;
  if (lowerTitle.includes("vocal")) return Mic2;
  return Disc;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const NeoServicesPage: React.FC<NeoServicesPageProps> = ({ services }) => {
  const t = useTranslations("services");
  const locale = useLocale();

  const getDescription = (service: Service) => {
    if (locale === "fr" && service.descriptionsFr) return service.descriptionsFr;
    if (locale === "en" && service.descriptionsEn) return service.descriptionsEn;
    return service.text;
  };

  const processSteps = [
    { key: "brief", icon: "01" },
    { key: "composition", icon: "02" },
    { key: "production", icon: "03" },
    { key: "mixing", icon: "04" },
    { key: "delivery", icon: "05" },
  ];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <NeoNavbar />

      <main className="relative z-10 pt-20">
        {/* Hero */}
        <NeoHeroSection
          badgeNumber="03"
          badge={t("hero.badge")}
          title={t("hero.title")}
          description={t("hero.description")}
          fullViewport
        >
          <div className="flex flex-wrap gap-4">
            <BrutalistButton
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={() =>
                document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.cta")}
            </BrutalistButton>
            <Link href="/contact">
              <BrutalistButton variant="secondary" size="lg">
                {t("hero.ctaSecondary")}
              </BrutalistButton>
            </Link>
          </div>
        </NeoHeroSection>

        {/* Stats Bar */}
        <section className="border-y-4 border-neo-border bg-neo-text text-neo-text-inverse py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: services.length.toString(), label: t("stats.services") },
                { val: "15+", label: t("stats.experience") },
                { val: "150+", label: t("stats.projects") },
                { val: "98%", label: t("stats.satisfaction") },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl font-black text-neo-accent tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest mt-2 opacity-60">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section id="services-list" className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-16"
            >
              {services.map((service, i) => {
                const IconComponent = getIconForService(service.title);
                return (
                  <motion.div
                    key={service.id}
                    variants={fadeInUp}
                    className="border-b-4 border-neo-border pb-16 last:border-b-0"
                  >
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                      {/* Number & Icon */}
                      <div className="flex lg:flex-col items-center lg:items-start gap-6 lg:w-48 shrink-0">
                        <span
                          className="text-6xl lg:text-8xl font-black text-transparent"
                          style={{ WebkitTextStroke: "2px var(--neo-text)" }}
                        >
                          0{i + 1}
                        </span>
                        <div className="w-16 h-16 bg-neo-accent border-2 border-neo-border flex items-center justify-center shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
                          <IconComponent size={32} className="text-neo-text-inverse" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight mb-6 text-neo-text">
                          {service.title}
                        </h2>
                        <div
                          className="font-mono text-lg leading-relaxed max-w-3xl border-l-4 border-neo-accent pl-6 opacity-80"
                          dangerouslySetInnerHTML={{ __html: getDescription(service) }}
                        />
                        <Link
                          href={{ pathname: "/services/[id]", params: { id: service.id } }}
                          className="inline-block mt-6"
                        >
                          <BrutalistButton
                            variant="ghost"
                            size="sm"
                            icon={<ArrowRight className="w-4 h-4" />}
                          >
                            {t("seeMore")}
                          </BrutalistButton>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-neo-bg-alt border-y-2 border-neo-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-8">
              <NeoTag variant="default">{t("process.subtitle")}</NeoTag>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-16 text-neo-text">
              {t("process.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <NeoCard hover="lift" padding="md" className="h-full text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-neo-accent text-neo-text-inverse flex items-center justify-center font-black text-xl">
                      {step.icon}
                    </div>
                    <h3 className="font-black uppercase text-lg mb-2 text-neo-text">
                      {t(`process.${step.key}.title`)}
                    </h3>
                    <p className="font-mono text-xs text-neo-text/60">
                      {t(`process.${step.key}.description`)}
                    </p>
                  </NeoCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-neo-text">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-neo-accent" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neo-text-inverse mb-4">
                {t("cta.title")}
              </h2>
              <p className="font-mono text-lg text-neo-text-inverse/60 max-w-2xl mx-auto mb-8">
                {t("cta.description")}
              </p>
              <div className="flex justify-center">
                <Link href="/contact">
                  <BrutalistButton
                    variant="dark"
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    {t("hero.ctaSecondary")}
                  </BrutalistButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <NeoFooter />
    </div>
  );
};

export default NeoServicesPage;
