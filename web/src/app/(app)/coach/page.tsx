"use client";

import { useState } from "react";
import { Button, Field, PageHeader, Panel, Select, TextArea } from "@/components/ui";
import type { CoachMode } from "@/lib/types";

interface Msg {
  role: "user" | "assistant";
  content: string;
  mode?: CoachMode;
  cost?: number;
}

const prompts = [
  "Audit my channel and give a 14-day plan",
  "What keywords should I chase next?",
  "How do I improve my thumbnails and CTR?",
  "Where are my competitors weak?",
  "Build a Shorts funnel for my niche",
];

export default function CoachPage() {
  const [mode, setMode] = useState<CoachMode>("max");
  const [prompt, setPrompt] = useState(prompts[0]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(nextPrompt = prompt) {
    if (!nextPrompt.trim()) return;
    setBusy(true);
    setError("");
    setMessages((m) => [...m, { role: "user", content: nextPrompt }]);
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: nextPrompt, mode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Coach unavailable");
      setBusy(false);
      return;
    }
    setMessages((m) => [
      ...m,
      { role: "assistant", content: data.reply, mode: data.mode, cost: data.cost },
    ]);
    setBusy(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Coach"
        title="Max Mode strategy on tap"
        description="Fast for quick asks, Deep for multi-step strategy, Max for full audits grounded in the Tubelens knowledge DB."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel className="animate-rise h-fit space-y-4">
          <Field label="Mode">
            <Select value={mode} onChange={(e) => setMode(e.target.value as CoachMode)}>
              <option value="fast">Fast · 10 credits</option>
              <option value="deep">Deep Thinking · 25 credits</option>
              <option value="max">Max Mode · 35 credits</option>
            </Select>
          </Field>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Starters
            </div>
            <div className="space-y-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPrompt(p);
                    send(p);
                  }}
                  className="w-full rounded-xl bg-[var(--paper)] px-3 py-2 text-left text-sm hover:bg-[var(--paper-2)]"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="animate-rise-delay flex min-h-[560px] flex-col">
          <div className="flex-1 space-y-4 overflow-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Ask for a channel audit, keyword plan, competitor teardown, or packaging advice.
              </p>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl bg-[var(--ink)] px-4 py-3 text-sm text-white"
                    : "mr-4 rounded-2xl bg-[var(--paper)] px-4 py-3 text-sm"
                }
              >
                {m.role === "assistant" && m.mode ? (
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {m.mode} · {m.cost} credits
                  </div>
                ) : null}
                <div className="prose-coach">{m.content}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 border-t border-black/5 pt-4">
            <TextArea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the coach…"
            />
            <div className="flex items-center justify-between gap-3">
              {error ? <p className="text-sm text-[var(--coral)]">{error}</p> : <span />}
              <Button onClick={() => send()} disabled={busy}>
                {busy ? "Thinking…" : "Send"}
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
