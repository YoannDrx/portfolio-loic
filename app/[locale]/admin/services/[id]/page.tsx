import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le service</h1>
        <p className="text-gray-500 dark:text-gray-400">{service.title}</p>
      </div>

      <ServiceForm locale={locale} initialData={service} />
    </div>
  );
}
