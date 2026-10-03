import { readCredits, writeCredits, defaultCredits } from "@/lib/credits";
import { MAX_MONTHLY_CREDITS } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  const state = await readCredits();
  return NextResponse.json(state);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "reset") {
    const state = defaultCredits();
    await writeCredits(state);
    return NextResponse.json(state);
  }
  if (body?.action === "topup") {
    const state = await readCredits();
    const next = {
      ...state,
      balance: Math.min(MAX_MONTHLY_CREDITS * 2, state.balance + Number(body.amount || 1000)),
    };
    await writeCredits(next);
    return NextResponse.json(next);
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
