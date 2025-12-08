import { getTranslations } from "next-intl/server";
import { NeoContact } from "@/components/neo-brutalist/contact/NeoContact";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("pageTitle")} | Loïc Ghanem`,
    description: t("pageDescription"),
  };
}

export default async function ContactPage() {
  return <NeoContact />;
}
