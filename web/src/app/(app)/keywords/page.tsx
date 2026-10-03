"use client";

import { useEffect, useState } from "react";
import { Button, Field, Input, PageHeader, Panel, Select, ScoreBar } from "@/components/ui";
import type { KeywordRecord } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export default function KeywordsPage() {
  const [q, setQ] = useState("");
  const [niche, setNiche] = useState("All");
  const [niches, setNiches] = useState<string[]>(["All"]);
  const [results, setResults] = useState<KeywordRecord[]>([]);
  const [selected, setSelected] = useState<KeywordRecord | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<
    { title: string; channelTitle: string; videoId: string }[]
  >([]);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(query = q, n = niche) {
    setLoading(true);
    const res = await fetch(`/api/keywords?q=${encodeURIComponent(query)}&niche=${encodeURIComponent(n)}`);
    const data = await res.json();
    setNiches(data.niches ?? ["All"]);
    setResults(data.results ?? []);
    setLoading(false);
  }

  async function deepResearch(keyword: string) {
    setLoading(true);
    const res = await fetch(`/api/keywords?q=${encodeURIComponent(keyword)}&deep=1`);
    const data = await res.json();
    setSelected(data.keyword);
    setRelatedVideos(data.relatedVideos ?? []);
    setSource(data.source);
    setLoading(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("q") ?? "";
    setQ(initial);
    load(initial, "All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Keyword research"
        title="Find demand before you film"
        description="Scores blend search volume, competition, and trend velocity from the Tubelens knowledge graph — optionally enriched with live YouTube search."
      />

      <Panel className="animate-rise">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <Field label="Query">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. faceless youtube channel ideas"
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </Field>
          <Field label="Niche">
            <Select value={niche} onChange={(e) => setNiche(e.target.value)}>
              {niches.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </Field>
          <div className="flex items-end">
            <Button onClick={() => load()} disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </Button>
          </div>
        </div>
      </Panel>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="space-y-2">
            {results.map((k) => (
              <button
                key={k.id}
                onClick={() => {
                  setSelected(k);
                  deepResearch(k.keyword);
                }}
                className="flex w-full items-center justify-between rounded-2xl bg-[var(--paper)] px-4 py-3 text-left transition hover:bg-[var(--paper-2)]"
              >
                <div>
                  <div className="font-medium">{k.keyword}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {k.niche} · {k.intent} · vol {formatNumber(k.volume)}
                  </div>
                </div>
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--amber)]">
                  {k.overallScore}
                </div>
              </button>
            ))}
            {results.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No keywords matched. Try a broader query.</p>
            ) : null}
          </div>
        </Panel>

        <Panel>
          {selected ? (
            <div className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Selected</div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl">{selected.keyword}</h2>
                {source ? <div className="mt-1 text-xs text-[var(--muted)]">Source: {source}</div> : null}
              </div>
              <ScoreBar label="Overall opportunity" value={selected.overallScore} />
              <ScoreBar label="Competition" value={selected.competition} />
              <ScoreBar label="Trend" value={selected.trend} />
              <p className="text-sm text-[var(--muted)]">{selected.notes}</p>
              <div>
                <div className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Related</div>
                <div className="flex flex-wrap gap-2">
                  {selected.related.map((r) => (
                    <span key={r} className="rounded-lg bg-[var(--paper)] px-2 py-1 text-xs">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              {relatedVideos.length > 0 ? (
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                    Live YouTube sample
                  </div>
                  <ul className="space-y-2 text-sm">
                    {relatedVideos.slice(0, 5).map((v) => (
                      <li key={v.videoId + v.title} className="rounded-xl bg-[var(--paper)] px-3 py-2">
                        <div className="font-medium">{v.title}</div>
                        <div className="text-xs text-[var(--muted)]">{v.channelTitle}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">Select a keyword to inspect scores and notes.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
