import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import NeoServiceDetail from '@/components/neo-brutalist/services/NeoServiceDetail';

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
  } catch {
    return {
      title: 'Service | Loïc Ghanem',
    };
  }
}

export default async function ServiceDetailPage({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

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

  // Fetch the service
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

  // Fetch all services for related section
  const allServices = await prisma.service.findMany({
    where: { published: true },
    orderBy: { no: 'asc' },
  });

  return (
    <NeoServiceDetail
      service={service}
      allServices={allServices}
      locale={locale}
      isPreview={isPreview && isAdmin}
    />
  );
}
