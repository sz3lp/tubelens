import { listCompetitors } from "@/lib/knowledge/competitors";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const niche = new URL(req.url).searchParams.get("niche") ?? "All";
  return NextResponse.json({ competitors: listCompetitors(niche) });
}
