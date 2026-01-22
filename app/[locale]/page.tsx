import NeoHome from "@/components/neo-brutalist/NeoHome";

// ISR - revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  return <NeoHome />;
}
