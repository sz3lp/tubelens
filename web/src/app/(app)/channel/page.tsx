import { Metric, PageHeader, Panel } from "@/components/ui";
import { DEMO_CHANNEL, DEMO_VIDEOS } from "@/lib/knowledge/channel";
import { formatNumber } from "@/lib/utils";
import { youtubeConfigured } from "@/lib/youtube";

export default function ChannelPage() {
  const liveReady = youtubeConfigured();

  return (
    <div>
      <PageHeader
        eyebrow="Channel analytics"
        title={DEMO_CHANNEL.title}
        description={`${DEMO_CHANNEL.handle} · ${DEMO_CHANNEL.niche}. ${
          liveReady
            ? "YouTube API key detected — pass ?id=CHANNEL_ID to /api/channel for live stats."
            : "Running on demo channel data. Add YOUTUBE_API_KEY to pull live channel stats."
        }`}
      />

      <div className="grid gap-4 md:grid-cols-4 animate-rise">
        <Metric label="Subscribers" value={formatNumber(DEMO_CHANNEL.subscribers)} />
        <Metric label="Total views" value={formatNumber(DEMO_CHANNEL.totalViews)} />
        <Metric label="Videos" value={formatNumber(DEMO_CHANNEL.videoCount)} />
        <Metric
          label="Best post hours"
          value={DEMO_CHANNEL.bestPostHours.map((h) => `${h}:00`).join(" · ")}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel className="animate-rise-delay">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Top keywords on channel</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {DEMO_CHANNEL.topKeywords.map((k) => (
              <span key={k} className="rounded-xl bg-[var(--paper)] px-3 py-2 text-sm">
                {k}
              </span>
            ))}
          </div>
        </Panel>
        <Panel className="animate-rise-delay-2">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Posting guidance</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            For this niche, Tubelens recommends publishing on weekdays around your best hours, then
            supporting with 1–2 searchable Shorts within 24 hours. Protect CTR first — impressions
            without clicks waste the topic.
          </p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <h2 className="font-[family-name:var(--font-display)] text-xl">Recent performance</h2>
        <div className="mt-4 space-y-3">
          {DEMO_VIDEOS.map((v) => (
            <div
              key={v.id}
              className="flex flex-col justify-between gap-2 rounded-2xl bg-[var(--paper)] px-4 py-3 md:flex-row md:items-center"
            >
              <div>
                <div className="font-medium">{v.title}</div>
                <div className="text-xs text-[var(--muted)]">{v.publishedAt}</div>
              </div>
              <div className="flex gap-4 text-sm">
                <span>{formatNumber(v.views)} views</span>
                <span>{v.ctr}% CTR</span>
                <span>{v.avgViewDuration} AVD</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
