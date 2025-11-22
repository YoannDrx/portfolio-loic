import { ServiceForm } from "@/components/admin/service-form";

export default async function NewServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau service</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Créez un nouveau service
        </p>
      </div>

      <ServiceForm locale={locale} />
    </div>
  );
}
