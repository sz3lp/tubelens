import { planClips } from "@/lib/content-tools";
import { spendCredits } from "@/lib/credits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? "Untitled upload").trim();
  const minutes = Math.max(1, Math.min(180, Number(body.minutes ?? 10)));
  const mode = body.mode === "shorts" ? "shorts" : "clip";

  if (mode === "shorts") {
    const seconds = Math.max(15, Math.min(60, Number(body.seconds ?? 30)));
    const spent = await spendCredits("shorts_second", seconds);
    if (!spent.ok) return NextResponse.json(spent, { status: 402 });
    return NextResponse.json({
      mode,
      output: {
        durationSec: seconds,
        hook: `Short-form concept for “${title}”`,
        beats: ["cold open", "one insight", "visual proof", "loop reset", "CTA"],
        caption: `${title} — watch the full breakdown on the channel.`,
      },
      credits: spent.state,
      cost: spent.cost,
    });
  }

  const spent = await spendCredits("clip_minute", minutes);
  if (!spent.ok) return NextResponse.json(spent, { status: 402 });
  return NextResponse.json({
    mode,
    clips: planClips(title, minutes),
    credits: spent.state,
    cost: spent.cost,
  });
}
