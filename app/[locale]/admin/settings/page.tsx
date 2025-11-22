import { SettingsContent } from "@/components/admin/SettingsContent";

export const metadata = {
  title: "Paramètres | Admin",
  description: "Gérez les paramètres de votre portfolio",
};

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <SettingsContent locale={locale} />;
}
