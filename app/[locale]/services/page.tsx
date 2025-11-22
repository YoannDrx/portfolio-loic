import { prisma } from '@/lib/prisma';
import { ServicesDisplay } from '@/components/services/ServicesDisplay';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Récupérer tous les services publiés, triés par ordre
  const services = await prisma.service.findMany({
    where: {
      published: true,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      no: true,
      title: true,
      text: true,
      largeImg: true,
      largeTitle: true,
      poster: true,
      date: true,
      author: true,
      fullDescription: true,
      descriptionsFr: true,
      descriptionsEn: true,
    },
  });

  return <ServicesDisplay services={services} locale={locale} />;
}
