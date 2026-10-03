import { PageHeader, Panel, ScoreBar } from "@/components/ui";
import { TRENDS } from "@/lib/knowledge/trends";

export default function TrendsPage() {
  const sorted = [...TRENDS].sort((a, b) => b.opportunity - a.opportunity);

  return (
    <div>
      <PageHeader
        eyebrow="Trend radar"
        title="Intercept demand while it's climbing"
        description="Velocity and opportunity scores help you decide what to film this week — not what was viral last month."
      />

      <div className="grid gap-4">
        {sorted.map((t, i) => (
          <Panel key={t.id} className={i === 0 ? "animate-rise" : "animate-rise-delay"}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{t.niche}</div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.topic}</h2>
                <p className="mt-2 text-[var(--muted)]">{t.why}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.exampleTitles.map((title) => (
                    <span key={title} className="rounded-xl bg-[var(--paper)] px-3 py-1.5 text-xs">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full space-y-3 md:max-w-xs">
                <ScoreBar label="Velocity" value={t.velocity} />
                <ScoreBar label="Opportunity" value={t.opportunity} />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
