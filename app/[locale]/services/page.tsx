import { NeoServicesPage } from "@/components/neo-brutalist/services/NeoServicesPage";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";
import { getPublishedServices } from "@/lib/public-content";

// Force dynamic rendering to avoid DB calls at build time
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });

  return buildLocalizedMetadata({
    locale,
    path: "/services",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  // Récupérer tous les services publiés, triés par ordre
  const services = await getPublishedServices();

  return <NeoServicesPage services={services} />;
}
