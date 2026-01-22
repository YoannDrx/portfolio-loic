import { NeoCVPage } from "@/components/neo-brutalist/cv/NeoCVPage";
import { NeoNavbar } from "@/components/neo-brutalist/NeoNavbar";
import { getCVData } from "@/lib/cv-data";

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
