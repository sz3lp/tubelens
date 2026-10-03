import { thumbnailBrief } from "@/lib/content-tools";
import { spendCredits } from "@/lib/credits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = String(body.topic ?? "").trim();
  if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

  const spent = await spendCredits("thumbnail");
  if (!spent.ok) return NextResponse.json(spent, { status: 402 });

  return NextResponse.json({
    brief: thumbnailBrief(topic),
    credits: spent.state,
    cost: spent.cost,
    note: "Connect an image model API later for pixel generation; Max parity ships creative briefs + variant plans now.",
  });
}
