import Link from "next/link";
import { Metric, PageHeader, Panel } from "@/components/ui";
import { DEMO_CHANNEL, DEMO_VIDEOS } from "@/lib/knowledge/channel";
import { TRENDS } from "@/lib/knowledge/trends";
import { KEYWORDS } from "@/lib/knowledge/keywords";
import { formatNumber } from "@/lib/utils";
import { readCredits } from "@/lib/credits";

export default async function DashboardPage() {
  const credits = await readCredits();
  const topKeywords = [...KEYWORDS].sort((a, b) => b.overallScore - a.overallScore).slice(0, 4);
  const hotTrends = [...TRENDS].sort((a, b) => b.velocity - a.velocity).slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Daily digest"
        title="Grow what already has demand"
        description={`Signed in as demo channel ${DEMO_CHANNEL.title}. Credits refresh with your Max plan.`}
      />

      <div className="grid gap-4 md:grid-cols-4 animate-rise">
        <Metric label="Subscribers" value={formatNumber(DEMO_CHANNEL.subscribers)} />
        <Metric label="Avg views / 30d" value={formatNumber(DEMO_CHANNEL.avgViews30d)} />
        <Metric label="Est. CTR" value={`${DEMO_CHANNEL.ctrEstimate}%`} />
        <Metric label="AI credits" value={credits.balance.toLocaleString()} hint={credits.plan.toUpperCase()} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel className="animate-rise-delay">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Best opportunities</h2>
          <div className="mt-4 space-y-3">
            {topKeywords.map((k) => (
              <Link
                key={k.id}
                href={`/keywords?q=${encodeURIComponent(k.keyword)}`}
                className="flex items-center justify-between rounded-2xl bg-[var(--paper)] px-4 py-3 transition hover:bg-[var(--paper-2)]"
              >
                <div>
                  <div className="font-medium">{k.keyword}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {k.niche} · vol {formatNumber(k.volume)}
                  </div>
                </div>
                <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--amber)]">
                  {k.overallScore}
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel className="animate-rise-delay-2">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Trend intercepts</h2>
          <div className="mt-4 space-y-3">
            {hotTrends.map((t) => (
              <div key={t.id} className="rounded-2xl bg-[var(--paper)] px-4 py-3">
                <div className="font-medium">{t.topic}</div>
                <p className="mt-1 text-sm text-[var(--muted)]">{t.why}</p>
              </div>
            ))}
          </div>
          <Link href="/trends" className="mt-4 inline-block text-sm font-semibold text-[var(--ink)]">
            Open trends →
          </Link>
        </Panel>
      </div>

      <Panel className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Recent videos</h2>
          <Link href="/channel" className="text-sm font-semibold">
            Channel analytics →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[var(--muted)]">
              <tr>
                <th className="pb-2 font-medium">Title</th>
                <th className="pb-2 font-medium">Views</th>
                <th className="pb-2 font-medium">CTR</th>
                <th className="pb-2 font-medium">AVD</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_VIDEOS.map((v) => (
                <tr key={v.id} className="border-t border-black/5">
                  <td className="py-3 pr-3 font-medium">{v.title}</td>
                  <td className="py-3">{formatNumber(v.views)}</td>
                  <td className="py-3">{v.ctr}%</td>
                  <td className="py-3">{v.avgViewDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
