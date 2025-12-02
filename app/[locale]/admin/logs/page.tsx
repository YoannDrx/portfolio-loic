import { LogsContent } from "@/components/admin/logs/LogsContent";

export const metadata = {
  title: "Journal d'activité | Admin",
  description: "Consultez l'historique des actions et des exports",
};

export default async function LogsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LogsContent locale={locale} />;
}
