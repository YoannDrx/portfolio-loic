import { prisma } from "@/lib/prisma";
import { ResumeForm } from "@/components/admin/resume-form";
import { notFound } from "next/navigation";
import type { ResumeEntryCreateFormInput } from "@/lib/validations/schemas";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

type ResumeEntryType = ResumeEntryCreateFormInput["type"];

export default async function EditResumeEntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const entry = await prisma.resumeEntry.findUnique({
    where: { id },
  });

  if (!entry) {
    notFound();
  }

  // Transform Prisma entry to form-compatible data
  const formData: Partial<ResumeEntryCreateFormInput> & { id: string } = {
    id: entry.id,
    type: entry.type as ResumeEntryType,
    titleEn: entry.titleEn,
    titleFr: entry.titleFr,
    subtitleEn: entry.subtitleEn ?? undefined,
    subtitleFr: entry.subtitleFr ?? undefined,
    dateRangeEn: entry.dateRangeEn ?? undefined,
    dateRangeFr: entry.dateRangeFr ?? undefined,
    descriptionEn: entry.descriptionEn ?? undefined,
    descriptionFr: entry.descriptionFr ?? undefined,
    value: entry.value ?? undefined,
    link: entry.link ?? undefined,
    published: entry.published,
    order: entry.order,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary">
        Edit Resume Entry
      </h1>
      <ResumeForm locale={locale} initialData={formData} isEditing />
    </div>
  );
}
