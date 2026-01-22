import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

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
        <p className="text-muted-foreground dark:text-muted-foreground">{service.title}</p>
      </div>

      <ServiceForm locale={locale} initialData={service} />
    </div>
  );
}
