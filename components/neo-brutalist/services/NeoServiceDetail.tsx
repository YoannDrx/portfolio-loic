"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Eye,
  Mail,
  Zap,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Headphones,
  MessageSquare,
  Send,
  Music,
  Wand2,
  Layers,
} from "lucide-react";
import { NeoNavbar } from "../NeoNavbar";
import { NeoFooter } from "../NeoFooter";
import { NeoCard } from "../ui/NeoCard";
import { NeoTag } from "../ui/NeoTag";
import { BrutalistButton } from "../ui/BrutalistButton";
import { GridBackground } from "../ui/GridBackground";

interface Service {
  id: string;
  no: string;
  title: string;
  text: string;
  largeImg: string;
  largeTitle: string;
  poster: string;
  date: string;
  author: string;
  fullDescription: string;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface NeoServiceDetailProps {
  service: Service;
  allServices: Service[];
  locale: string;
  isPreview?: boolean;
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Process steps avec icônes
const processSteps = [
  { icon: MessageSquare, key: "brief" },
  { icon: Wand2, key: "composition" },
  { icon: Headphones, key: "production" },
  { icon: Sparkles, key: "mixing" },
  { icon: Send, key: "delivery" },
];

// Mapping service number to translation key
const serviceTranslationKeys: Record<string, string> = {
  "01": "composition",
  "02": "production",
  "03": "arranging",
  "04": "vocalProducer",
  "05": "mixing",
  "06": "mastering",
};

export default function NeoServiceDetail({
  service,
  allServices,
  locale,
  isPreview = false,
}: NeoServiceDetailProps) {
  const t = useTranslations("services");
  const tDetail = useTranslations("services.detail");
  const tCommon = useTranslations("common");

  // Get translated largeTitle based on service number
  const translationKey = serviceTranslationKeys[service.no];
  const translatedLargeTitle = translationKey
    ? t(`${translationKey}.largeTitle`)
    : service.largeTitle;

  const description =
    locale === "fr"
      ? service.descriptionsFr || service.fullDescription
      : service.descriptionsEn || service.fullDescription;

  // Find previous and next services for navigation
  const currentIndex = allServices.findIndex((s) => s.id === service.id);
  const prevService =
    currentIndex > 0 ? allServices[currentIndex - 1] : allServices[allServices.length - 1];
  const nextService =
    currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : allServices[0];

  return (
    <div className="min-h-screen bg-neo-bg text-neo-text font-sans selection:bg-neo-text selection:text-neo-accent overflow-x-hidden">
      <GridBackground withAccentGlow />
      <NeoNavbar />

      <main className="relative z-10 pt-24 pb-24">
        {/* Preview Banner */}
        {isPreview && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-neo-accent text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-shadow)]">
              <Eye className="w-4 h-4" />
              <span className="font-mono text-xs font-bold uppercase">
                Prévisualisation - {service.published ? "Publié" : "Brouillon"}
              </span>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 md:px-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {tCommon("backToServices")}
            </Link>
          </motion.div>

          {/* ==================== HERO SECTION ==================== */}
          <section className="mb-16 lg:mb-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-[minmax(280px,400px)_1fr] gap-8 lg:gap-12 items-start w-full"
            >
              {/* Left Column - Service Image */}
              <motion.div
                variants={fadeInLeft}
                className="relative max-w-[320px] sm:max-w-[360px] lg:max-w-none mx-auto lg:mx-0"
              >
                {/* Decorative background element */}
                <div className="absolute -inset-4 bg-neo-accent/10 rotate-2 -z-10 hidden lg:block" />
                <div className="absolute -inset-2 bg-neo-text/5 -rotate-1 -z-10 hidden lg:block" />

                <NeoCard
                  hover="lift"
                  padding="none"
                  className="overflow-hidden shadow-[10px_10px_0px_0px_var(--neo-shadow)] border-4"
                >
                  <div className="aspect-square relative overflow-hidden group">
                    {service.largeImg ? (
                      <Image
                        src={service.largeImg}
                        alt={service.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105"
                        priority
                        sizes="(max-width: 640px) 320px, (max-width: 1024px) 360px, 400px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neo-bg via-neo-surface to-neo-bg-alt flex items-center justify-center">
                        <Layers className="w-24 h-24 text-neo-accent/30" />
                      </div>
                    )}
                    {/* Overlay with hover indication */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neo-text/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </NeoCard>

                {/* Service number badge */}
                <div className="absolute -bottom-4 -right-4 lg:-bottom-5 lg:-right-5 bg-neo-text text-neo-accent w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center border-4 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)] font-black text-2xl">
                  {service.no}
                </div>
              </motion.div>

              {/* Right Column - Service Info + Description */}
              <motion.div variants={fadeInRight} className="space-y-6">
                {/* Service Tag */}
                <NeoTag variant="accent" size="lg" className="inline-flex">
                  <Layers className="w-4 h-4 mr-2" />
                  SERVICE N°{service.no}
                </NeoTag>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter leading-[0.85] text-neo-text">
                  {translatedLargeTitle || service.title}
                </h1>

                {/* Tagline */}
                <p className="text-lg md:text-xl font-medium text-neo-text/80 max-w-2xl">
                  {service.text}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact">
                    <BrutalistButton variant="primary" size="lg" icon={<Mail size={20} />}>
                      {tDetail("requestQuote")}
                    </BrutalistButton>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* ==================== ABOUT SECTION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-24"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                01
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                {tDetail("about")}
              </h2>
              <div className="flex-1 h-1 bg-neo-border" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
              {/* Main Description */}
              <NeoCard padding="lg" className="border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]">
                <div
                  className="prose prose-lg max-w-none text-neo-text leading-relaxed
                    prose-headings:font-black prose-headings:uppercase prose-headings:text-neo-text
                    prose-p:font-mono prose-p:leading-relaxed prose-p:text-sm
                    prose-strong:text-neo-accent prose-strong:font-bold
                    prose-a:text-neo-accent prose-a:no-underline hover:prose-a:underline
                    prose-ul:text-sm prose-li:font-mono prose-li:marker:text-neo-accent"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </NeoCard>

              {/* What You Get */}
              <NeoCard
                padding="lg"
                className="bg-neo-text border-4 shadow-[8px_8px_0px_0px_var(--neo-shadow)]"
              >
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-neo-text-inverse">
                  <Check className="w-5 h-5 text-neo-accent" />
                  {tDetail("whatYouGet")}
                </h3>
                <ul className="space-y-4">
                  {[
                    tDetail("whatYouGetItems.item1"),
                    tDetail("whatYouGetItems.item2"),
                    tDetail("whatYouGetItems.item3"),
                    tDetail("whatYouGetItems.item4"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="w-6 h-6 bg-neo-accent text-neo-text flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-neo-text-inverse">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Quick Contact */}
                <Link href="/contact" className="block mt-8">
                  <div className="flex items-center justify-between p-4 bg-neo-accent/20 hover:bg-neo-accent transition-colors group cursor-pointer">
                    <div>
                      <p className="font-mono text-xs uppercase opacity-60 mb-1 text-neo-text-inverse">
                        {tDetail("readyToStart")}
                      </p>
                      <p className="font-black text-lg uppercase text-neo-text-inverse">
                        {tDetail("requestQuote")}
                      </p>
                    </div>
                    <ChevronRight className="w-8 h-8 text-neo-accent group-hover:text-neo-text-inverse group-hover:translate-x-2 transition-all" />
                  </div>
                </Link>
              </NeoCard>
            </div>
          </motion.section>

          {/* ==================== PROCESS SECTION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-24"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                02
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                {tDetail("process")}
              </h2>
              <div className="flex-1 h-1 bg-neo-border" />
            </div>

            {/* Process Timeline */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-neo-border hidden md:block" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {processSteps.map((step, i) => (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <NeoCard padding="lg" hover="lift" className="text-center h-full group">
                      {/* Step Number */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center font-mono text-sm font-black bg-neo-accent text-neo-text-inverse group-hover:bg-neo-text group-hover:text-neo-accent transition-colors">
                        {i + 1}
                      </div>

                      <step.icon className="w-10 h-10 mx-auto mb-4 text-neo-accent group-hover:scale-110 transition-transform" />

                      <h3 className="font-black uppercase text-lg mb-2">
                        {t(`process.${step.key}.title`)}
                      </h3>
                      <p className="font-mono text-xs opacity-60">
                        {t(`process.${step.key}.description`)}
                      </p>
                    </NeoCard>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ==================== DISCOVER WORK SECTION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-24"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                03
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                {tDetail("discoverWork")}
              </h2>
              <div className="flex-1 h-1 bg-neo-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Albums Card */}
              <Link href="/albums">
                <NeoCard
                  hover="lift"
                  padding="lg"
                  className="h-full border-4 shadow-[6px_6px_0px_0px_var(--neo-shadow)] group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-neo-text flex items-center justify-center flex-shrink-0 group-hover:bg-neo-accent transition-colors">
                      <Headphones className="w-8 h-8 text-neo-accent group-hover:text-neo-text-inverse transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black uppercase mb-1 group-hover:text-neo-accent transition-colors">
                        {tDetail("viewAlbums")}
                      </h3>
                      <p className="font-mono text-sm opacity-60">
                        {tDetail("discoverWorkDescription")}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-neo-accent group-hover:translate-x-2 transition-transform" />
                  </div>
                </NeoCard>
              </Link>

              {/* Videos Card */}
              <Link href="/videos">
                <NeoCard
                  hover="lift"
                  padding="lg"
                  className="h-full border-4 shadow-[6px_6px_0px_0px_var(--neo-shadow)] group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-neo-text flex items-center justify-center flex-shrink-0 group-hover:bg-neo-accent transition-colors">
                      <Music className="w-8 h-8 text-neo-accent group-hover:text-neo-text-inverse transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black uppercase mb-1 group-hover:text-neo-accent transition-colors">
                        {tDetail("viewVideos")}
                      </h3>
                      <p className="font-mono text-sm opacity-60">
                        {tDetail("discoverWorkDescription")}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-neo-accent group-hover:translate-x-2 transition-transform" />
                  </div>
                </NeoCard>
              </Link>
            </div>
          </motion.section>

          {/* ==================== SERVICE NAVIGATION ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-24"
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-sm font-bold bg-neo-text text-neo-accent px-3 py-2">
                04
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-neo-text">
                {tDetail("relatedServices")}
              </h2>
              <div className="flex-1 h-1 bg-neo-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Previous Service */}
              <Link
                href={{ pathname: "/services/[id]", params: { id: prevService.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-16 md:w-20 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronLeft className="w-8 h-8 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-neo-surface flex items-center justify-center flex-shrink-0 border-2 border-neo-border font-black text-2xl text-neo-accent">
                        {prevService.no}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tDetail("previousService")}
                        </span>
                        <h3 className="font-black text-lg md:text-xl uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {prevService.title}
                        </h3>
                        <p className="font-mono text-xs text-neo-text/50 mt-1 line-clamp-1 hidden sm:block">
                          {prevService.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>

              {/* Next Service */}
              <Link
                href={{ pathname: "/services/[id]", params: { id: nextService.id } }}
                className="group"
              >
                <NeoCard hover="lift" padding="none" className="h-full border-4 overflow-hidden">
                  <div className="flex items-stretch h-full flex-row-reverse">
                    {/* Arrow */}
                    <div className="flex items-center justify-center w-16 md:w-20 bg-neo-text group-hover:bg-neo-accent transition-colors flex-shrink-0">
                      <ChevronRight className="w-8 h-8 text-neo-accent group-hover:text-neo-text transition-colors" />
                    </div>
                    {/* Content */}
                    <div className="flex items-center gap-4 p-4 flex-1 min-w-0 flex-row-reverse text-right">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-neo-surface flex items-center justify-center flex-shrink-0 border-2 border-neo-border font-black text-2xl text-neo-accent">
                        {nextService.no}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs uppercase text-neo-text/60 block">
                          {tDetail("nextService")}
                        </span>
                        <h3 className="font-black text-lg md:text-xl uppercase truncate text-neo-text group-hover:text-neo-accent transition-colors">
                          {nextService.title}
                        </h3>
                        <p className="font-mono text-xs text-neo-text/50 mt-1 line-clamp-1 hidden sm:block">
                          {nextService.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </NeoCard>
              </Link>
            </div>

            {/* Back to services link */}
            <div className="mt-8 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-neo-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {tCommon("backToServices")}
              </Link>
            </div>
          </motion.section>

          {/* ==================== FINAL CTA ==================== */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <NeoCard
              variant="inverted"
              padding="lg"
              className="py-16 border-4 shadow-[8px_8px_0px_0px_var(--neo-accent)] relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-40 h-40 border-8 border-neo-accent rotate-12" />
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-neo-accent rotate-45" />
                <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-neo-accent" />
              </div>

              <div className="relative z-10 text-center">
                <NeoTag variant="accent" size="lg" className="mb-8 inline-flex">
                  <Zap className="w-4 h-4 mr-2" />
                  {tDetail("pricing")}
                </NeoTag>

                <p className="text-4xl md:text-6xl font-black text-neo-accent mb-6">
                  {tDetail("onQuote")}
                </p>

                <p className="font-mono text-lg text-neo-text-inverse/60 max-w-2xl mx-auto mb-12">
                  {tDetail("customizable")}
                </p>

                <div className="flex flex-wrap justify-center gap-6">
                  <Link href="/contact">
                    <BrutalistButton variant="dark" size="lg" icon={<Mail size={20} />}>
                      {tDetail("requestQuote")}
                    </BrutalistButton>
                  </Link>
                  <Link href="/services">
                    <BrutalistButton variant="dark" size="lg">
                      {tDetail("backToServices")}
                    </BrutalistButton>
                  </Link>
                </div>
              </div>
            </NeoCard>
          </motion.section>
        </div>
      </main>

      <NeoFooter />
    </div>
  );
}
