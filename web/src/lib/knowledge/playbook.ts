/** Domain knowledge the AI Coach retrieves against for grounded answers. */
export const PLAYBOOK = [
  {
    id: "pb-packaging",
    topic: "packaging",
    title: "Title + thumbnail congruence",
    content:
      "CTR rises when the title names the payoff and the thumbnail shows the conflict or transformation. Avoid restating the title on the image. One face, one object, one emotion. Test contrast first, cleverness second.",
  },
  {
    id: "pb-seo",
    topic: "seo",
    title: "Modern YouTube SEO",
    content:
      "Primary keyword in the first 40–60 characters of the title, natural language in the description's first 2–3 lines, and spoken in the first 30 seconds. Tags are weak ranking signals; use them for disambiguation. Playlists and sessions matter more than keyword stuffing.",
  },
  {
    id: "pb-retention",
    topic: "retention",
    title: "Retention architecture",
    content:
      "Open with the payoff preview in 5–8 seconds, then establish stakes. Pattern interrupt every 20–40 seconds in mid-form. Use open loops before midrolls. End screens should start while value is still landing, not after a dead outro.",
  },
  {
    id: "pb-niche",
    topic: "niche",
    title: "Niche selection",
    content:
      "Prefer niches where you can win on either unique access, unique process, or unique packaging. Validate with keyword opportunity score >70, competitor upload gaps, and whether viewers binge related videos. Avoid head terms until authority exists.",
  },
  {
    id: "pb-shorts",
    topic: "shorts",
    title: "Shorts to long-form funnel",
    content:
      "Best Shorts answer one searchable question, loop cleanly, and verbally point to a long-form deep dive. Reposting random viral formats rarely compounds. Track which Shorts lift long-form browse impressions within 48 hours.",
  },
  {
    id: "pb-cadence",
    topic: "cadence",
    title: "Upload cadence",
    content:
      "Consistency beats volume. For channels under 50k, 1–2 high-effort videos/week plus 3–5 Shorts outperforms daily low-signal uploads. Batch packaging and scripting to protect quality.",
  },
  {
    id: "pb-competitors",
    topic: "competitors",
    title: "Competitor analysis",
    content:
      "Track title patterns, packaging motifs, upload timing, and topic coverage gaps. Do not clone. Steal the job-to-be-done, then differentiate with your proof, process, or personality. Look for topics they ignore that their audience still asks about in comments.",
  },
  {
    id: "pb-thumbnails",
    topic: "thumbnails",
    title: "Thumbnail craft",
    content:
      "Readable at mobile size. Max 3–5 words if any text. High subject/background separation. Emotion or curiosity gap over literal scene recreation. Keep a brand color system so returning viewers recognize you in browse.",
  },
  {
    id: "pb-scripts",
    topic: "scripts",
    title: "Script frameworks",
    content:
      "Use Hook → Promise → Proof → Steps → Objections → CTA. For listicles, escalate value. For tutorials, show the finished result first. For stories, delay the lesson until after the conflict peak.",
  },
  {
    id: "pb-analytics",
    topic: "analytics",
    title: "Reading analytics",
    content:
      "CTR under 4% usually means packaging. AVD under 40% on mid-form usually means hook/structure. Impressions rising but CTR flat means topic demand exists — remake packaging. Traffic source shifts tell you whether SEO, browse, or suggested is working.",
  },
];

export function retrievePlaybook(query: string, limit = 4) {
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  return PLAYBOOK.map((p) => {
    const hay = `${p.topic} ${p.title} ${p.content}`.toLowerCase();
    const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    return { ...p, score };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
