import { runCoach } from "@/lib/coach";
import { spendCredits } from "@/lib/credits";
import type { CoachMode } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const prompt = String(body.prompt ?? "").trim();
  const mode = (body.mode ?? "fast") as CoachMode;
  if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });
  if (!["fast", "deep", "max"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  }

  const action = mode === "max" ? "coach_max" : mode === "deep" ? "coach_deep" : "coach_fast";
  const spent = await spendCredits(action);
  if (!spent.ok) return NextResponse.json(spent, { status: 402 });

  const reply = await runCoach(prompt, mode);
  return NextResponse.json({ reply, credits: spent.state, cost: spent.cost, mode });
}
