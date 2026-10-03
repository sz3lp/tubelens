"use client";

import { useState } from "react";
import { Button, Field, Input, PageHeader, Panel } from "@/components/ui";

export default function ScriptsPage() {
  const [topic, setTopic] = useState("How to grow on YouTube in 2026");
  const [minutes, setMinutes] = useState(8);
  const [script, setScript] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/scripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, minutes }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed");
      setBusy(false);
      return;
    }
    setScript(data.script);
    setBusy(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Script writer"
        title="Structure that holds retention"
        description="Hook → Promise → Proof → Steps → Objections → CTA. Credits scale with target minutes."
      />

      <Panel className="animate-rise grid max-w-3xl gap-4 md:grid-cols-[1fr_140px_auto]">
        <Field label="Topic">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Field>
        <Field label="Minutes">
          <Input
            type="number"
            min={1}
            max={30}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </Field>
        <div className="flex items-end">
          <Button onClick={generate} disabled={busy}>
            {busy ? "Writing…" : "Write script"}
          </Button>
        </div>
      </Panel>
      {error ? <p className="mt-3 text-sm text-[var(--coral)]">{error}</p> : null}

      {script ? (
        <Panel className="animate-rise-delay mt-6">
          <pre className="whitespace-pre-wrap font-[family-name:var(--font-body)] text-sm leading-relaxed">
            {script}
          </pre>
        </Panel>
      ) : null}
    </div>
  );
}
