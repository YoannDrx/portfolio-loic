import { NeoCVPage } from "@/components/neo-brutalist/cv/NeoCVPage";
import { NeoNavbar } from "@/components/neo-brutalist/NeoNavbar";
import { getCVData } from "@/lib/cv-data";
import { buildLocalizedMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    path: "/cv",
    title: locale === "fr" ? "CV" : "Resume",
    description:
      locale === "fr"
        ? "Parcours, récompenses, compétences et crédits de Loïc Ghanem, compositeur et producteur musical à Paris."
        : "Experience, awards, skills and credits of Loïc Ghanem, a music composer and producer based in Paris.",
  });
}

// ISR - revalidate every hour
export const revalidate = 3600;

export default async function CVPage() {
  const cvData = await getCVData();

  return (
    <div className="min-h-screen bg-neo-bg">
      <NeoNavbar />
      <main className="pt-20">
        <NeoCVPage data={cvData} />
      </main>
    </div>
  );
}
