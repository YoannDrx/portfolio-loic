import { notFound, permanentRedirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import NeoServiceDetail from "@/components/neo-brutalist/services/NeoServiceDetail";
import { buildLocalizedMetadata, plainText, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPublishedServices, getServiceByIdentifier } from "@/lib/public-content";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  try {
    const services = await prisma.service.findMany({
      where: { published: true },
      select: { id: true, slug: true },
    });

    const locales = ["fr", "en"];

    // Générer les combinaisons locale + id
    return services.flatMap((service) =>
      locales.map((locale) => ({
        locale,
        id: service.slug || service.id,
      }))
    );
  } catch {
    // Return empty array if DB is not available (CI build)
    return [];
  }
}

// Configuration du rendu
export const dynamicParams = true; // Permettre les params non pré-générés
// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.detail" });

  try {
    const service = await getServiceByIdentifier(id);

    if (!service) {
      return {
        title: t("notFound"),
      };
    }

    return buildLocalizedMetadata({
      locale,
      path: `/services/${service.slug || id}`,
      title: service.title,
      description: plainText(locale === "fr" ? service.descriptionsFr : service.descriptionsEn),
      image: service.largeImg,
    });
  } catch {
    return {
      title: "Service | Loïc Ghanem",
    };
  }
}

export default async function ServiceDetailPage({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  // Si mode preview, vérifier l'authentification
  let isAdmin = false;
  if (isPreview) {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({ headers: headersList });
      isAdmin = session?.user?.role === "admin";
    } catch {
      isAdmin = false;
    }

    // Si preview demandé mais pas admin, rediriger vers 404
    if (!isAdmin) {
      notFound();
    }
  }

  // Fetch the service
  const service = await getServiceByIdentifier(id);

  if (!service) {
    notFound();
  }

  // Si pas en mode preview et service non publié, 404
  if (!isPreview && !service.published) {
    notFound();
  }

  if (!isPreview && service.slug && id !== service.slug) {
    permanentRedirect(`/${locale}/services/${service.slug}`);
  }

  // Fetch all services for related section
  const allServices = await getPublishedServices();

  const serviceUrl = `${SITE_URL}/${locale}/services/${service.slug || service.id}`;
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: plainText(
              locale === "fr" ? service.descriptionsFr : service.descriptionsEn,
              500
            ),
            provider: { "@type": "Person", name: "Loïc Ghanem", url: SITE_URL },
            url: serviceUrl,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Services",
                item: `${SITE_URL}/${locale}/services`,
              },
              { "@type": "ListItem", position: 2, name: service.title, item: serviceUrl },
            ],
          },
        ]}
      />
      <NeoServiceDetail
        service={service}
        allServices={allServices}
        locale={locale}
        isPreview={isPreview && isAdmin}
      />
    </>
  );
}
