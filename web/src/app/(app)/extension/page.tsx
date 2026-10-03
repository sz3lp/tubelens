import { PageHeader, Panel } from "@/components/ui";

export default function ExtensionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Browser extension"
        title="Research without leaving YouTube"
        description="Tubelens Vision overlays SEO scores, keyword panels, and competitor snapshots on YouTube watch, search, and channel pages."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="animate-rise space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Load unpacked</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-[var(--muted)]">
            <li>
              Open <code className="text-[var(--ink)]">chrome://extensions</code>
            </li>
            <li>Enable Developer mode</li>
            <li>
              Load unpacked → select the repo folder <code className="text-[var(--ink)]">extension/</code>
            </li>
            <li>Open YouTube — the Tubelens side panel injects automatically</li>
          </ol>
        </Panel>
        <Panel className="animate-rise-delay space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-xl">Overlay capabilities</h2>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li>• Watch page SEO scorecard + tag insights</li>
            <li>• Search page keyword opportunity score</li>
            <li>• Channel page competitor snapshot</li>
            <li>• Quick links into Tubelens Max tools</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
