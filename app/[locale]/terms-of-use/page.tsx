import { NeoLegalPage } from "@/components/neo-brutalist/legal/NeoLegalPage";
import { getTranslations } from "next-intl/server";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });

  return buildLocalizedMetadata({
    locale,
    path: "/terms-of-use",
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function TermsOfUsePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: _locale } = await params;

  return <NeoLegalPage type="terms" />;
}
