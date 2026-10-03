"use client";

import { useState } from "react";
import { Button, Field, Input, PageHeader, Panel } from "@/components/ui";

export default function ThumbnailsPage() {
  const [topic, setTopic] = useState("youtube thumbnail tips");
  const [brief, setBrief] = useState<{
    concept: string;
    textOverlay: string;
    palette: string[];
    composition: string;
    variants: string[];
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/thumbnails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      setBusy(false);
      return;
    }
    setBrief(data.brief);
    setBusy(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Thumbnail studio"
        title="Design for the browse shelf"
        description="Max credit flow for thumbnail ideation — composition briefs, overlay copy, and variant plans."
      />

      <Panel className="animate-rise max-w-2xl space-y-4">
        <Field label="Video topic">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Field>
        <Button onClick={generate} disabled={busy}>
          {busy ? "Generating…" : "Generate brief (22 credits)"}
        </Button>
        {error ? <p className="text-sm text-[var(--coral)]">{error}</p> : null}
      </Panel>

      {brief ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="animate-rise-delay overflow-hidden p-0">
            <div
              className="relative aspect-video w-full"
              style={{
                background: `linear-gradient(135deg, ${brief.palette[0]}, ${brief.palette[1]} 55%, ${brief.palette[2]})`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="max-w-[50%] font-[family-name:var(--font-display)] text-3xl font-bold leading-none text-white md:text-5xl">
                  {brief.textOverlay}
                </div>
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white/20 text-sm text-white backdrop-blur md:h-36 md:w-36">
                  subject
                </div>
              </div>
            </div>
          </Panel>
          <Panel className="animate-rise-delay-2 space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-xl">Creative brief</h2>
            <p className="text-sm text-[var(--muted)]">{brief.concept}</p>
            <p className="text-sm">{brief.composition}</p>
            <div className="flex gap-2">
              {brief.palette.map((c) => (
                <span key={c} className="h-8 w-8 rounded-full border border-black/10" style={{ background: c }} />
              ))}
            </div>
            <ul className="space-y-2 text-sm">
              {brief.variants.map((v) => (
                <li key={v} className="rounded-xl bg-[var(--paper)] px-3 py-2">
                  {v}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
