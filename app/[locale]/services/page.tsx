import { prisma } from "@/lib/prisma";
import { NeoServicesPage } from "@/components/neo-brutalist/services/NeoServicesPage";
import { getTranslations } from "next-intl/server";

// Force dynamic rendering to avoid DB calls during static build
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  // Récupérer tous les services publiés, triés par ordre
  const services = await prisma.service.findMany({
    where: {
      published: true,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      no: true,
      title: true,
      text: true,
      // We select only what we need for NeoServicesPage + keeping others available if needed later
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

  return <NeoServicesPage services={services} />;
}
