import { writeScript } from "@/lib/content-tools";
import { spendCredits } from "@/lib/credits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const topic = String(body.topic ?? "").trim();
  const minutes = Math.max(1, Math.min(30, Number(body.minutes ?? 8)));
  if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

  const spent = await spendCredits("script", minutes);
  if (!spent.ok) return NextResponse.json(spent, { status: 402 });

  return NextResponse.json({
    script: writeScript(topic, minutes),
    credits: spent.state,
    cost: spent.cost,
  });
}
