import { TRENDS } from "@/lib/knowledge/trends";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    trends: [...TRENDS].sort((a, b) => b.opportunity - a.opportunity),
  });
}
