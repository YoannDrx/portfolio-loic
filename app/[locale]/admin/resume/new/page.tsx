import { ResumeForm } from "@/components/admin/resume-form";

export default async function NewResumeEntryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary">New Resume Entry</h1>
      <ResumeForm locale={locale} />
    </div>
  );
}
