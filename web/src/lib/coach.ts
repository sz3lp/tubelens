import { listCompetitors } from "@/lib/knowledge/competitors";
import { DEMO_CHANNEL } from "@/lib/knowledge/channel";
import { searchKeywords } from "@/lib/knowledge/keywords";
import { retrievePlaybook } from "@/lib/knowledge/playbook";
import { TRENDS } from "@/lib/knowledge/trends";
import type { CoachMode } from "@/lib/types";

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

function modeDepth(mode: CoachMode) {
  if (mode === "max") return { playbook: 5, keywords: 5, competitors: 3, trends: 3 };
  if (mode === "deep") return { playbook: 3, keywords: 3, competitors: 2, trends: 2 };
  return { playbook: 2, keywords: 2, competitors: 1, trends: 1 };
}

export async function runCoach(prompt: string, mode: CoachMode): Promise<string> {
  const depth = modeDepth(mode);
  const playbook = retrievePlaybook(prompt, depth.playbook);
  const keywords = searchKeywords(prompt).slice(0, depth.keywords);
  const competitors = listCompetitors().slice(0, depth.competitors);
  const trends = TRENDS.slice(0, depth.trends);

  const context = {
    channel: DEMO_CHANNEL,
    playbook,
    keywords,
    competitors,
    trends,
    mode,
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: mode === "fast" ? 0.5 : 0.7,
          messages: [
            {
              role: "system",
              content:
                "You are Tubelens Max Coach, an expert YouTube growth strategist. Use the provided knowledge context. Be concrete, numbered, and actionable. Never claim access to private YouTube Studio data you do not have.",
            },
            {
              role: "user",
              content: `Context JSON:\n${JSON.stringify(context)}\n\nCreator question:\n${prompt}`,
            },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch {
      // fall through to grounded local coach
    }
  }

  return localCoach(prompt, mode, context);
}

function localCoach(
  prompt: string,
  mode: CoachMode,
  context: {
    channel: typeof DEMO_CHANNEL;
    playbook: ReturnType<typeof retrievePlaybook>;
    keywords: ReturnType<typeof searchKeywords>;
    competitors: ReturnType<typeof listCompetitors>;
    trends: typeof TRENDS;
  },
) {
  const q = prompt.toLowerCase();
  const lines: string[] = [];

  lines.push(
    mode === "max"
      ? `## Max Mode audit for ${context.channel.title}`
      : mode === "deep"
        ? `## Deep strategy for ${context.channel.title}`
        : `## Quick coaching`,
  );

  lines.push(
    `You're at **${context.channel.subscribers.toLocaleString()}** subs with ~**${context.channel.avgViews30d.toLocaleString()}** avg views / 30d and an estimated **${context.channel.ctrEstimate}%** CTR. Niche focus: ${context.channel.niche}.`,
  );

  if (q.includes("thumbnail") || q.includes("ctr") || q.includes("packaging")) {
    lines.push("### Packaging");
    lines.push(
      "1. Rebuild your next 3 thumbnails around conflict/transformation, not scene recreation.",
      "2. Keep on-image text ≤ 4 words; put the search phrase in the title instead.",
      "3. Run a 50/50 CTR test for 48 hours before declaring a winner.",
    );
  } else if (q.includes("keyword") || q.includes("seo") || q.includes("rank")) {
    lines.push("### Keyword / SEO");
    if (context.keywords[0]) {
      const k = context.keywords[0];
      lines.push(
        `Primary opportunity near your ask: **${k.keyword}** (score ${k.overallScore}, vol ${k.volume.toLocaleString()}, competition ${k.competition}).`,
      );
      lines.push(`Related angles: ${k.related.join("; ")}.`);
    }
    lines.push(
      "Put the primary phrase in the first half of the title, first 150 description chars, and spoken hook.",
    );
  } else if (q.includes("competitor") || q.includes("rival")) {
    lines.push("### Competitor gaps");
    for (const c of context.competitors) {
      lines.push(
        `- **${c.name}** (${c.handle}): strong at ${c.strengths[0]}; gap — ${c.gaps[0]}. Steal the job-to-be-done, not the packaging.`,
      );
    }
  } else if (q.includes("short") || q.includes("clip")) {
    lines.push("### Shorts funnel");
    lines.push(
      "Ship searchable Shorts that answer one question, then verbally bridge to a long-form deep dive within 48 hours.",
    );
  } else if (q.includes("script") || q.includes("hook")) {
    lines.push("### Script");
    lines.push(
      "Use Hook → Promise → Proof → Steps → Objection → CTA. Preview the payoff in the first 8 seconds.",
    );
  } else {
    lines.push("### Recommended next moves");
    lines.push(
      `1. Double down on: ${context.channel.topKeywords.slice(0, 2).join(" · ")}.`,
      "2. Publish one gap topic your competitors under-serve this week.",
      "3. Improve packaging on your highest-impression / lowest-CTR video.",
    );
  }

  if (mode !== "fast") {
    lines.push("### Knowledge anchors");
    for (const p of context.playbook.slice(0, mode === "max" ? 4 : 2)) {
      lines.push(`- **${p.title}**: ${p.content}`);
    }
  }

  if (mode === "max") {
    lines.push("### Trend intercepts");
    for (const t of context.trends.slice(0, 2)) {
      lines.push(`- **${t.topic}** (opportunity ${t.opportunity}): ${t.why}`);
    }
    lines.push(
      "### 14-day plan",
      "Days 1–2: keyword + competitor gap map.",
      "Days 3–5: script + package 2 long-form videos.",
      "Days 6–10: publish + 6 Shorts funnels.",
      "Days 11–14: remake losers' packaging; keep winners' formats.",
    );
  }

  lines.push(
    "_Grounded in Tubelens knowledge DB" +
      (process.env.OPENAI_API_KEY ? "" : " (local coach — add OPENAI_API_KEY for LLM Max Mode)") +
      "._",
  );

  return lines.join("\n\n");
}
