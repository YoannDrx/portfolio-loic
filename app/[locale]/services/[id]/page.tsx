import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Calendar, User, ArrowLeft, Eye } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { id: true },
  });

  const locales = ['fr', 'en'];

  // Générer les combinaisons locale + id
  return services.flatMap((service) =>
    locales.map((locale) => ({
      locale,
      id: service.id,
    }))
  );
}

// Configuration du rendu
export const dynamicParams = true; // Permettre les params non pré-générés
export const revalidate = 3600; // Revalider toutes les heures en production

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.detail' });

  try {
    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        title: true,
        date: true,
      },
    });

    if (!service) {
      return {
        title: t('notFound'),
      };
    }

    return {
      title: `${service.title} | Loïc Ghanem`,
      description: `${t('offeredOn')} ${service.date}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Service | Loïc Ghanem',
    };
  }
}

export default async function ServiceDetailPage({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const t = await getTranslations({ locale, namespace: 'services.detail' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Si mode preview, vérifier l'authentification
  let isAdmin = false;
  if (isPreview) {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({ headers: headersList });
      isAdmin = session?.user?.role === 'admin';
    } catch {
      isAdmin = false;
    }

    // Si preview demandé mais pas admin, rediriger vers 404
    if (!isAdmin) {
      notFound();
    }
  }

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  // Si pas en mode preview et service non publié, 404
  if (!isPreview && !service.published) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-obsidian via-obsidian-50 to-obsidian py-20">
      <div className="container-custom">
        {/* Preview Banner */}
        {isPreview && (
          <div className="mb-8 rounded-lg border-2 border-neon-cyan/50 bg-neon-cyan/10 p-4">
            <div className="flex items-center justify-center gap-3 text-neon-cyan">
              <Eye className="h-5 w-5" />
              <span className="font-semibold">
                Mode Prévisualisation - Ce service {service.published ? 'est publié' : "n'est pas encore publié"}
              </span>
            </div>
          </div>
        )}

        {/* Back Button */}
        <AnimatedSection variant="fadeIn" className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{tCommon('backToServices')}</span>
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Service Image */}
          <div className="lg:col-span-2">
            <AnimatedSection variant="slideUp">
              <GlassCard variant="neon" className="overflow-hidden sticky top-24">
                <div className="relative aspect-square w-full bg-obsidian-200">
                  <Image
                    src={service.largeImg}
                    alt={service.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    quality={90}
                  />
                  {/* Service Number Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-lg shadow-lg">
                      <span className="text-sm font-bold text-white">Service #{service.no}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-3 space-y-8">
            {/* Title & Meta */}
            <AnimatedSection variant="slideUp" delay={0.1}>
              <GlassCard variant="default">
                <GlassCardContent className="p-8">
                  <h1 className="text-4xl md:text-5xl font-black text-gradient-neon mb-6">
                    {service.title}
                  </h1>

                  <div className="space-y-4">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                      <span className="text-lg">
                        <span className="text-gray-400">{tCommon('author')}:</span>{' '}
                        <span className="text-white font-semibold">{service.author}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-neon-magenta flex-shrink-0" />
                      <span className="text-lg">
                        <span className="text-gray-400">{tCommon('releaseDate')}:</span>{' '}
                        <span className="text-white font-semibold">{service.date}</span>
                      </span>
                    </div>
                  </div>
                </GlassCardContent>
              </GlassCard>
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection variant="slideUp" delay={0.2}>
              <GlassCard variant="subtle">
                <GlassCardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">{t('about')}</h2>
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div
                      className="text-gray-300 leading-relaxed space-y-4 service-descriptions"
                      dangerouslySetInnerHTML={{
                        __html: locale === 'fr' ? service.descriptionsFr : service.descriptionsEn
                      }}
                    />
                  </div>
                </GlassCardContent>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
