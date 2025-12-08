import { NeoCVPage } from "@/components/neo-brutalist/cv/NeoCVPage";
import { NeoNavbar } from "@/components/neo-brutalist/NeoNavbar";
import type { CVData } from "@/types/cv";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getCVData(): Promise<CVData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/cv`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch CV data");
    }

    return response.json();
  } catch {
    // Return default data structure
    return {
      fullName: "Loïc Ghanem",
      headlineFr: "Compositeur & Producteur",
      headlineEn: "Composer & Producer",
      sections: [],
      skills: [],
      socialLinks: [],
    };
  }
}

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
