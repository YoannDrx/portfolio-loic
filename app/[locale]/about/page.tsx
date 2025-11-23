import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import PageShell from "@/components/ui/PageShell";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GlassCard, GlassCardContent } from "@/components/ui/GlassCard";
import Timeline from "@/components/about/Timeline";
import SkillCard from "@/components/about/SkillCard";
import Awards from "@/components/about/Awards";
import MusicianExperience from "@/components/about/MusicianExperience";
import AboutScene from "@/components/three/scenes/AboutScene";
import { Award, Users, Building2, Sparkles, Download, MapPin, Mail, Languages } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <PageShell
      title={t("pageTitle")}
      subtitle="Biography"
      scene={<AboutScene />}
      gradient="lime"
    >
        {/* Bio Section */}
        <AnimatedSection variant="slideUp" className="mb-20" triggerOnLoad delay={0.2}>
          <div className="max-w-6xl mx-auto">
            {/* Hero Image */}
            <div className="mb-8">
              <GlassCard variant="neon" className="overflow-hidden" triggerOnLoad>
                <div className="relative w-full h-[500px] md:h-[600px]">
                  <Image
                    src="/img/slider/loic-studio-front.jpg"
                    alt="Loïc Ghanem in studio"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "50% 35%" }}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Bio */}
              <div className="lg:col-span-2">
                <GlassCard variant="neon" className="h-full" triggerOnLoad>
                  <GlassCardContent className="p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-white mb-6">{t("title")}</h2>
                    <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                      <p>
                        <strong className="text-white">{t("intro")}</strong> {t("bio.paragraph1")}
                      </p>
                      <p>{t("bio.paragraph2")}</p>
                      <p>{t("bio.paragraph3")}</p>
                      <p className="text-neon-cyan font-semibold">{t("bio.paragraph4")}</p>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <GlassCard variant="default" className="border-neon-cyan/30" triggerOnLoad>
                  <GlassCardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{t("contactInfo.title")}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30">
                          <MapPin className="w-5 h-5 text-neon-cyan" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">{t("contactInfo.address")}</p>
                          <p className="text-white font-semibold">{t("contactInfo.location")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-neon-magenta/10 border border-neon-magenta/30 flex-shrink-0">
                          <Mail className="w-5 h-5 text-neon-magenta" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400 mb-1">{t("contactInfo.email")}</p>
                          <a
                            href="mailto:loic.ghanem@outlook.com"
                            className="text-white font-semibold hover:text-neon-magenta transition-colors break-words text-sm"
                          >
                            loic.ghanem@outlook.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/30">
                          <Languages className="w-5 h-5 text-neon-purple" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">{t("contactInfo.languages")}</p>
                          <p className="text-white font-semibold">{t("contactInfo.languageList")}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>

                <GlassCard variant="subtle" className="border-neon-cyan/20" triggerOnLoad>
                  <GlassCardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{t("achievements.title")}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center text-2xl font-black text-white">
                          16
                        </div>
                        <p className="text-sm text-gray-300">{t("achievements.albums")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-magenta to-neon-purple flex items-center justify-center text-2xl font-black text-white">
                          34
                        </div>
                        <p className="text-sm text-gray-300">{t("achievements.projects")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-2xl font-black text-white">
                          15+
                        </div>
                        <p className="text-sm text-gray-300">{t("achievements.years")}</p>
                      </div>
                    </div>
                  </GlassCardContent>
                </GlassCard>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Skills Section */}
        <AnimatedSection variant="slideUp" className="mb-20" delay={0.3}>
          <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-tighter">{t("skills.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard
              iconName="Music"
              title={t("skills.composition.title")}
              skills={["Metal", "Hip-Hop", "Ambient", "Electronic", "Orchestral"]}
              color="cyan"
            />
            <SkillCard
              iconName="Headphones"
              title={t("skills.production.title")}
              skills={["Mixing", "Mastering", "Sound Design", "Arrangement"]}
              color="magenta"
            />
            <SkillCard
              iconName="Mic2"
              title={t("skills.vocalProduction.title")}
              skills={["Direction", "Recording", "Editing", "Processing"]}
              color="purple"
            />
            <SkillCard
              iconName="Sliders"
              title={t("skills.postProduction.title")}
              skills={["Film Scoring", "TV Music", "Ads", "Game Audio"]}
              color="blue"
            />
          </div>
        </AnimatedSection>

        {/* Awards Section */}
        <Awards />

        {/* Timeline Section */}
        <AnimatedSection variant="slideUp" className="mb-20" delay={0.4}>
          <h2 className="text-4xl font-bold text-white text-center mb-12 tracking-tighter">{t("timeline.title")}</h2>
          <div className="max-w-4xl mx-auto">
            <Timeline />
          </div>
        </AnimatedSection>

        {/* Musician Experience Section */}
        <MusicianExperience />

        {/* Stats Grid */}
        <AnimatedSection variant="fadeIn" className="mb-20" delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard variant="default" hover className="text-center">
              <GlassCardContent className="p-8">
                <Award className="w-12 h-12 text-neon-cyan mx-auto mb-4" />
                <div className="text-4xl font-black text-gradient-neon mb-2">16</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t("achievements.albums")}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" hover className="text-center">
              <GlassCardContent className="p-8">
                <Sparkles className="w-12 h-12 text-neon-magenta mx-auto mb-4" />
                <div className="text-4xl font-black text-gradient-neon mb-2">34</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t("achievements.projects")}</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" hover className="text-center">
              <GlassCardContent className="p-8">
                <Users className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                <div className="text-4xl font-black text-gradient-neon mb-2">50+</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">Collaborations</div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard variant="default" hover className="text-center">
              <GlassCardContent className="p-8">
                <Building2 className="w-12 h-12 text-neon-blue mx-auto mb-4" />
                <div className="text-4xl font-black text-gradient-neon mb-2">15+</div>
                <div className="text-gray-400 uppercase tracking-widest text-xs">{t("achievements.years")}</div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </AnimatedSection>

        {/* Labels & Publishers */}
        <AnimatedSection variant="slideUp" className="mb-20" delay={0.6}>
          <GlassCard variant="subtle" className="max-w-4xl mx-auto">
            <GlassCardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-tighter">{t("labelsPublishers.title")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                <div>
                  <h3 className="text-xl font-semibold text-neon-cyan mb-4 uppercase tracking-widest text-sm">{t("labelsPublishers.labels")}</h3>
                  <ul className="space-y-2 text-gray-300 font-light">
                    <li>Infinity Scores (Cezame Music Agency)</li>
                    <li>Montmorency Music Agency (MYMA)</li>
                    <li>Justement Music</li>
                    <li>Stereoscopic</li>
                    <li>Superpitch</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neon-magenta mb-4 uppercase tracking-widest text-sm">{t("labelsPublishers.publishers")}</h3>
                  <ul className="space-y-2 text-gray-300 font-light">
                    <li>Cezame Music Agency</li>
                    <li>Montmorency Music Agency</li>
                  </ul>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection variant="fadeIn" delay={0.7}>
          <GlassCard variant="neon" className="text-center max-w-3xl mx-auto">
            <GlassCardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">{t("cta.title")}</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light">{t("cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg font-semibold text-white hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-all duration-300 uppercase tracking-wider text-sm"
                >
                  <span>{t("cta.contactMe")}</span>
                </Link>
                <Link
                  href="/albums"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-neon-cyan rounded-lg font-semibold text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 uppercase tracking-wider text-sm"
                >
                  <span>{t("cta.viewAlbums")}</span>
                </Link>
                <a
                  href="/img/cv_loic_ghanem.pdf"
                  download="CV_Loic_Ghanem.pdf"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-neon-purple rounded-lg font-semibold text-neon-purple hover:bg-neon-purple/10 transition-all duration-300 uppercase tracking-wider text-sm"
                >
                  <Download className="w-5 h-5" />
                  <span>{t("cta.downloadCV")}</span>
                </a>
              </div>
            </GlassCardContent>
          </GlassCard>
        </AnimatedSection>
    </PageShell>
  );
}
