import NeoHome from "@/components/neo-brutalist/NeoHome";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, SOCIAL_PROFILES } from "@/lib/seo";

// ISR - revalidate every hour
export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Loïc Ghanem",
            url: SITE_URL,
            inLanguage: ["fr", "en"],
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Loïc Ghanem",
            url: SITE_URL,
            sameAs: SOCIAL_PROFILES,
            jobTitle:
              locale === "fr" ? "Compositeur et producteur musical" : "Music composer and producer",
            homeLocation: { "@type": "Place", name: "Paris, France" },
          },
        ]}
      />
      <NeoHome />
    </>
  );
}
