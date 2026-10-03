import { spendCredits } from "@/lib/credits";
import { generateDescription, generateTags, generateTitles, scoreVideo } from "@/lib/seo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "score";

  if (action === "score") {
    const result = scoreVideo({
      title: String(body.title ?? ""),
      description: String(body.description ?? ""),
      tags: Array.isArray(body.tags) ? body.tags.map(String) : String(body.tags ?? "").split(","),
      targetKeyword: body.targetKeyword ? String(body.targetKeyword) : undefined,
    });
    return NextResponse.json(result);
  }

  if (action === "titles") {
    const spent = await spendCredits("titles");
    if (!spent.ok) return NextResponse.json(spent, { status: 402 });
    return NextResponse.json({
      titles: generateTitles(String(body.topic ?? ""), body.keyword ? String(body.keyword) : undefined),
      description: generateDescription(String(body.topic ?? ""), body.keyword ? String(body.keyword) : undefined),
      tags: generateTags(String(body.topic ?? ""), body.keyword ? String(body.keyword) : undefined),
      credits: spent.state,
      cost: spent.cost,
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
