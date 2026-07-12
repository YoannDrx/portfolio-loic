import { getTranslations } from "next-intl/server";
import { NeoContact } from "@/components/neo-brutalist/contact/NeoContact";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return buildLocalizedMetadata({
    locale,
    path: "/contact",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function ContactPage() {
  return <NeoContact />;
}
