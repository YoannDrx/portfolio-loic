"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Music4, Disc, Sliders, Mic2, Radio, ArrowRight, CheckCircle } from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoHeroSection } from "../ui/NeoHeroSection";
import { SectionHeader } from "../ui/SectionHeader";
import { NeoCard } from "../ui/NeoCard";
import { BrutalistButton } from "../ui/BrutalistButton";
import { GridBackground } from "../ui/GridBackground";
import { ImmersivePageAtmosphere } from "../ui/ImmersivePageAtmosphere";
import { Link } from "@/i18n/routing";

interface Service {
  id: string;
  slug?: string | null;
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

const serviceCardSpans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-6",
  "lg:col-span-6",
] as const;

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
      <GridBackground withAccentGlow />
      <ImmersivePageAtmosphere />
      <NeoNavbar />

      <main className="relative z-10 pt-16 md:pt-20">
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

        {/* Services Grid */}
        <section id="services-list" className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader number="03.1" title={t("grid.title")} subtitle={t("grid.subtitle")} />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-7"
            >
              {services.map((service, i) => {
                const IconComponent = getIconForService(service.title);
                return (
                  <motion.div
                    key={service.id}
                    variants={fadeInUp}
                    className={serviceCardSpans[i % serviceCardSpans.length]}
                  >
                    <Link
                      href={{
                        pathname: "/services/[id]",
                        params: { id: service.slug || service.id },
                      }}
                      className="block h-full"
                    >
                      <article className="relative h-full min-h-[22rem] overflow-hidden border-4 border-neo-border bg-neo-surface p-6 md:p-9 transition-all duration-500 group hover:-translate-y-2 hover:bg-neo-text hover:text-neo-text-inverse hover:shadow-[12px_12px_0px_0px_rgba(var(--neo-accent-rgb),1)]">
                        <span className="pointer-events-none absolute -bottom-12 -right-3 font-mono text-[10rem] font-black leading-none text-neo-text/[0.035] transition-all duration-500 group-hover:-translate-y-5 group-hover:text-neo-text-inverse/[0.06] md:text-[13rem]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="absolute left-0 top-0 h-1.5 w-0 bg-neo-accent transition-all duration-500 group-hover:w-full" />
                        {/* Header : Icon + Number */}
                        <div className="relative z-10 flex justify-between items-start mb-12">
                          <div className="p-4 bg-neo-bg border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-neo-surface group-hover:border-neo-text-inverse">
                            <IconComponent
                              size={28}
                              className="text-neo-accent group-hover:text-neo-accent"
                            />
                          </div>
                          <span className="font-mono font-bold text-2xl text-neo-accent">
                            /{String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="relative z-10 max-w-xl text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-5 text-neo-text group-hover:text-neo-text-inverse transition-colors">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <div
                          className="relative z-10 max-w-2xl font-mono text-sm leading-relaxed mb-10 text-neo-text/70 group-hover:text-neo-text-inverse/75 transition-colors line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: getDescription(service) }}
                        />

                        {/* CTA */}
                        <div className="relative z-10 mt-auto flex items-center gap-3 font-mono text-xs uppercase font-bold tracking-[0.18em] text-neo-accent">
                          <span>{t("seeMore")}</span>
                          <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-16" />
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Process Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-neo-text text-neo-text-inverse border-y-4 border-neo-border">
          <div className="container mx-auto px-4 md:px-6 [&_h2]:text-neo-text-inverse [&_p]:text-neo-text-inverse/60">
            <SectionHeader
              number="03.2"
              title={t("process.title")}
              subtitle={t("process.subtitle")}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-0">
              <div
                className="absolute left-[10%] right-[10%] top-7 hidden h-1 bg-neo-accent/35 md:block"
                aria-hidden="true"
              />
              {processSteps.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <NeoCard
                    hover="lift"
                    padding="md"
                    className="relative h-full text-center border-0 bg-transparent shadow-none"
                  >
                    <div className="relative z-10 w-14 h-14 mx-auto mb-5 bg-neo-accent text-neo-on-accent border-4 border-neo-text-inverse flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_var(--neo-surface)]">
                      {step.icon}
                    </div>
                    <h3 className="font-black uppercase text-lg mb-2 text-neo-text-inverse">
                      {t(`process.${step.key}.title`)}
                    </h3>
                    <p className="font-mono text-xs text-neo-text-inverse/60">
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
