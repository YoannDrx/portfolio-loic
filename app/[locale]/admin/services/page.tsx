import { prisma } from "@/lib/prisma";
import { ServicesList } from "@/components/admin/services-list";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      no: true,
      largeImg: true,
      title: true,
      date: true,
      published: true,
    },
  });

  return <ServicesList services={services} locale={locale} />;
}
