import NeoHome from "@/components/neo-brutalist/NeoHome";

// Force dynamic rendering for useSearchParams
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <NeoHome />;
}
