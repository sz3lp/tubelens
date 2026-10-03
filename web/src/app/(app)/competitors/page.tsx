import { Metric, PageHeader, Panel } from "@/components/ui";
import { COMPETITORS } from "@/lib/knowledge/competitors";
import { formatNumber } from "@/lib/utils";

export default function CompetitorsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Competitor intel"
        title="Track the channels stealing your browse"
        description="Max-parity competitor boards: packaging patterns, topic coverage, strengths, and gaps you can attack."
      />

      <div className="grid gap-4 md:grid-cols-3 animate-rise">
        <Metric label="Tracked" value={String(COMPETITORS.length)} />
        <Metric
          label="Avg competitor views"
          value={formatNumber(
            Math.round(COMPETITORS.reduce((a, c) => a + c.avgViews, 0) / COMPETITORS.length),
          )}
        />
        <Metric label="Niches covered" value={String(new Set(COMPETITORS.map((c) => c.niche)).size)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {COMPETITORS.map((c, i) => (
          <Panel key={c.id} className={i % 2 === 0 ? "animate-rise-delay" : "animate-rise-delay-2"}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl">{c.name}</h2>
                <div className="text-sm text-[var(--muted)]">
                  {c.handle} · {c.niche} · {c.uploadFrequency}
                </div>
              </div>
              <div className="text-right">
                <div className="font-[family-name:var(--font-display)] text-xl">
                  {formatNumber(c.subscribers)}
                </div>
                <div className="text-xs text-[var(--muted)]">subscribers</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-[var(--paper)] p-3">
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Avg views</div>
                <div className="mt-1 font-semibold">{formatNumber(c.avgViews)}</div>
              </div>
              <div className="rounded-2xl bg-[var(--paper)] p-3">
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Top topics</div>
                <div className="mt-1 font-semibold">{c.topTopics.slice(0, 2).join(", ")}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Recent titles</div>
              <ul className="mt-2 space-y-1 text-sm">
                {c.recentTitles.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--mint)]">Strengths</div>
                <ul className="mt-1 text-sm text-[var(--muted)]">
                  {c.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--coral)]">Gaps to attack</div>
                <ul className="mt-1 text-sm text-[var(--muted)]">
                  {c.gaps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
