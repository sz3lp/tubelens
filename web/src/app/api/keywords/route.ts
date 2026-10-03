import { niches, searchKeywords } from "@/lib/knowledge/keywords";
import { researchKeyword } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const niche = searchParams.get("niche") ?? "All";
  const deep = searchParams.get("deep") === "1";

  if (deep && q) {
    const result = await researchKeyword(q);
    return NextResponse.json(result);
  }

  return NextResponse.json({
    niches: niches(),
    results: searchKeywords(q, niche),
  });
}
