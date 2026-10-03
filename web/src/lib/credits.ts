import { cookies } from "next/headers";
import {
  CREDIT_COSTS,
  MAX_MONTHLY_CREDITS,
  type CreditAction,
  type CreditState,
} from "@/lib/types";

const COOKIE = "tubelens_credits";

function monthResetISO() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function defaultCredits(): CreditState {
  return {
    balance: MAX_MONTHLY_CREDITS,
    plan: "max",
    resetAt: monthResetISO(),
  };
}

export async function readCredits(): Promise<CreditState> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return defaultCredits();
  try {
    const parsed = JSON.parse(raw) as CreditState;
    if (typeof parsed.balance !== "number") return defaultCredits();
    return parsed;
  } catch {
    return defaultCredits();
  }
}

export async function writeCredits(state: CreditState) {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(state), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 40,
  });
}

export async function spendCredits(action: CreditAction, units = 1) {
  const cost = CREDIT_COSTS[action] * units;
  const state = await readCredits();
  if (state.balance < cost) {
    return { ok: false as const, state, cost, error: "Not enough AI credits for this action." };
  }
  const next = { ...state, balance: state.balance - cost };
  await writeCredits(next);
  return { ok: true as const, state: next, cost };
}

export function actionLabel(action: CreditAction) {
  return {
    coach_fast: "AI Coach (Fast)",
    coach_deep: "AI Coach (Deep)",
    coach_max: "AI Coach (Max)",
    titles: "Title generation",
    thumbnail: "Thumbnail generation",
    script: "Script writing",
    clip_minute: "Clipping (per minute)",
    shorts_second: "Shorts generation (per second)",
  }[action];
}
