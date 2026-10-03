import { niches, searchKeywords } from "@/lib/knowledge/keywords";
import { KeywordsClient } from "./KeywordsClient";

export default async function KeywordsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; niche?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const niche = params.niche ?? "All";
  const results = searchKeywords(q, niche);

  return (
    <KeywordsClient
      initialQuery={q}
      initialNiche={niche}
      initialNiches={niches()}
      initialResults={results}
    />
  );
}
