"use client";

import { useState } from "react";
import { Button, Field, Input, PageHeader, Panel, ScoreBar, TextArea } from "@/components/ui";
import type { VideoScoreResult } from "@/lib/types";

export default function OptimizePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [topic, setTopic] = useState("");
  const [score, setScore] = useState<VideoScoreResult | null>(null);
  const [generated, setGenerated] = useState<{
    titles: string[];
    description: string;
    tags: string[];
    cost?: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function runScore() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "score",
        title,
        description,
        tags,
        targetKeyword,
      }),
    });
    const data = await res.json();
    setScore(data);
    setBusy(false);
  }

  async function runTitles() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "titles",
        topic: topic || title || targetKeyword,
        keyword: targetKeyword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not generate titles");
      setBusy(false);
      return;
    }
    setGenerated(data);
    if (data.titles?.[0]) setTitle(data.titles[0]);
    if (data.description) setDescription(data.description);
    if (data.tags) setTags(data.tags.join(", "));
    setBusy(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Video optimizer"
        title="Package for search and click"
        description="SEO scorecard, title variants, description drafts, and tag sets — the Max upload workflow."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="animate-rise space-y-4">
          <Field label="Target keyword">
            <Input value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} />
          </Field>
          <Field label="Topic for AI titles">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What the video is about"
            />
          </Field>
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Description">
            <TextArea rows={8} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button onClick={runScore} disabled={busy}>
              Score video
            </Button>
            <Button variant="secondary" onClick={runTitles} disabled={busy}>
              Generate titles (3 credits)
            </Button>
          </div>
          {error ? <p className="text-sm text-[var(--coral)]">{error}</p> : null}
        </Panel>

        <div className="space-y-6">
          <Panel className="animate-rise-delay">
            <h2 className="font-[family-name:var(--font-display)] text-xl">SEO scorecard</h2>
            {score ? (
              <div className="mt-4 space-y-3">
                <div className="font-[family-name:var(--font-display)] text-5xl text-[var(--amber)]">
                  {score.overall}
                </div>
                <ScoreBar label="Title" value={score.titleScore} />
                <ScoreBar label="Description" value={score.descriptionScore} />
                <ScoreBar label="Tags" value={score.tagScore} />
                <ScoreBar label="Keyword coverage" value={score.keywordCoverage} />
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {score.suggestions.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">Run a score to see the breakdown.</p>
            )}
          </Panel>

          {generated ? (
            <Panel className="animate-rise-delay-2">
              <h2 className="font-[family-name:var(--font-display)] text-xl">Generated titles</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {generated.titles.map((t) => (
                  <li key={t}>
                    <button
                      className="w-full rounded-xl bg-[var(--paper)] px-3 py-2 text-left hover:bg-[var(--paper-2)]"
                      onClick={() => setTitle(t)}
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>
      </div>
    </div>
  );
}
