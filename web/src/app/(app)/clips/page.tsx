"use client";

import { useState } from "react";
import { Button, Field, Input, PageHeader, Panel, Select } from "@/components/ui";

export default function ClipsPage() {
  const [title, setTitle] = useState("I Tested 12 Thumbnail Styles for 30 Days");
  const [minutes, setMinutes] = useState(12);
  const [seconds, setSeconds] = useState(30);
  const [mode, setMode] = useState<"clip" | "shorts">("clip");
  const [result, setResult] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/clips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, minutes, seconds, mode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      setBusy(false);
      return;
    }
    setResult(data);
    setBusy(false);
  }

  const clips =
    result && typeof result === "object" && result !== null && "clips" in result
      ? (result as { clips: { id: string; title: string; startSec: number; endSec: number; hook: string; format: string }[] }).clips
      : null;
  const shorts =
    result && typeof result === "object" && result !== null && "output" in result
      ? (result as { output: { durationSec: number; hook: string; beats: string[]; caption: string } }).output
      : null;

  return (
    <div>
      <PageHeader
        eyebrow="Clips & Shorts"
        title="Cut long-form into distribution"
        description="Clipping priced per source minute; Shorts generation priced per output second — Max credit economics."
      />

      <Panel className="animate-rise grid max-w-4xl gap-4 md:grid-cols-4">
        <Field label="Source title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Mode">
          <Select value={mode} onChange={(e) => setMode(e.target.value as "clip" | "shorts")}>
            <option value="clip">Clip long-form</option>
            <option value="shorts">Generate Short</option>
          </Select>
        </Field>
        {mode === "clip" ? (
          <Field label="Source minutes">
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </Field>
        ) : (
          <Field label="Output seconds">
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
            />
          </Field>
        )}
        <div className="flex items-end">
          <Button onClick={run} disabled={busy}>
            {busy ? "Working…" : "Run"}
          </Button>
        </div>
      </Panel>
      {error ? <p className="mt-3 text-sm text-[var(--coral)]">{error}</p> : null}

      {clips ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {clips.map((c) => (
            <Panel key={c.id} className="animate-rise-delay">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{c.format}</div>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-lg">{c.title}</h3>
              <p className="mt-2 text-sm">{c.hook}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                {c.startSec}s – {c.endSec}s
              </p>
            </Panel>
          ))}
        </div>
      ) : null}

      {shorts ? (
        <Panel className="animate-rise-delay mt-6 space-y-2">
          <h3 className="font-[family-name:var(--font-display)] text-xl">{shorts.hook}</h3>
          <p className="text-sm text-[var(--muted)]">{shorts.durationSec}s planned output</p>
          <ul className="text-sm">
            {shorts.beats.map((b) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
          <p className="text-sm">{shorts.caption}</p>
        </Panel>
      ) : null}
    </div>
  );
}
