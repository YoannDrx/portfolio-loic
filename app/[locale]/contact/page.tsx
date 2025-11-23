import { getTranslations } from "next-intl/server";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard, GlassCardContent } from "@/components/ui/GlassCard";
import ContactForm from "@/components/contact/ContactForm";
import MapBox from "@/components/contact/MapBox";
import ContactScene from "@/components/three/scenes/ContactScene";
import PageShell from '@/components/ui/PageShell';
import { Mail, MapPin, Phone } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <PageShell
      title={t("pageTitle")}
      subtitle="Get In Touch"
      scene={<ContactScene />}
      gradient="lime"
    >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <AnimatedSection variant="slideUp" delay={0.2}>
            <ContactForm />
          </AnimatedSection>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Contact Information */}
            <AnimatedSection variant="slideUp" delay={0.3}>
              <GlassCard variant="default" className="h-full">
                <GlassCardContent className="p-8 space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">{t("info.title")}</h3>

                  {/* Email */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-magenta/20 flex items-center justify-center group-hover:from-neon-cyan/30 group-hover:to-neon-magenta/30 transition-all">
                      <Mail className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">{t("info.email")}</h4>
                      <a href="mailto:loic.ghanem@outlook.com" className="text-white hover:text-neon-cyan transition-colors break-all">
                        loic.ghanem@outlook.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-magenta/20 to-neon-purple/20 flex items-center justify-center group-hover:from-neon-magenta/30 group-hover:to-neon-purple/30 transition-all">
                      <Phone className="w-6 h-6 text-neon-magenta" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">{t("info.phone")}</h4>
                      <a href="tel:+33123456789" className="text-white hover:text-neon-magenta transition-colors">
                        +33 6 00 00 00 00
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 flex items-center justify-center group-hover:from-neon-purple/30 group-hover:to-neon-blue/30 transition-all">
                      <MapPin className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-1">{t("info.location")}</h4>
                      <p className="text-white">{t("info.locationValue")}</p>
                    </div>
                  </div>

                  {/* Availability Notice */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400">
                      {t("info.availability")}
                    </p>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection variant="slideUp" delay={0.4}>
              <MapBox />
            </AnimatedSection>
          </div>
        </div>

        {/* Additional CTA */}
        <AnimatedSection variant="fadeIn" delay={0.6}>
          <GlassCard variant="subtle" className="text-center py-8">
            <GlassCardContent>
              <p className="text-gray-300 mb-4 font-light">{t("cta.text")}</p>
              <a
                href="/services"
                className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-magenta font-semibold transition-colors"
              >
                <span>{t("cta.button")}</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </GlassCardContent>
          </GlassCard>
        </AnimatedSection>
    </PageShell>
  );
}
