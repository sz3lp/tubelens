import type { VideoScoreInput, VideoScoreResult } from "@/lib/types";

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function scoreVideo(input: VideoScoreInput): VideoScoreResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const tags = input.tags.map((t) => t.trim()).filter(Boolean);
  const keyword = (input.targetKeyword ?? "").trim().toLowerCase();

  let titleScore = 40;
  if (title.length >= 40 && title.length <= 70) titleScore += 25;
  else if (title.length >= 25) titleScore += 12;
  if (/[0-9]/.test(title)) titleScore += 8;
  if (/\b(how|why|vs|i |the |stop|best)\b/i.test(title)) titleScore += 10;
  if (keyword && title.toLowerCase().includes(keyword)) titleScore += 15;
  titleScore = clamp(titleScore);

  let descriptionScore = 30;
  if (description.length >= 120) descriptionScore += 20;
  if (description.length >= 400) descriptionScore += 15;
  if (keyword && description.toLowerCase().includes(keyword)) descriptionScore += 20;
  if (/https?:\/\//i.test(description)) descriptionScore += 5;
  if (/\n/.test(description)) descriptionScore += 5;
  descriptionScore = clamp(descriptionScore);

  let tagScore = tags.length === 0 ? 20 : Math.min(90, 30 + tags.length * 8);
  if (keyword && tags.some((t) => t.toLowerCase().includes(keyword))) tagScore += 10;
  tagScore = clamp(tagScore);

  const hay = `${title} ${description} ${tags.join(" ")}`.toLowerCase();
  const keywordCoverage = keyword
    ? clamp(
        (hay.includes(keyword) ? 55 : 15) +
          (title.toLowerCase().includes(keyword) ? 25 : 0) +
          (description.toLowerCase().slice(0, 200).includes(keyword) ? 20 : 0),
      )
    : 50;

  const overall = clamp(titleScore * 0.4 + descriptionScore * 0.25 + tagScore * 0.15 + keywordCoverage * 0.2);

  const suggestions: string[] = [];
  if (title.length < 40) suggestions.push("Lengthen the title toward 40–70 characters with a clearer payoff.");
  if (keyword && !title.toLowerCase().includes(keyword))
    suggestions.push(`Place the primary keyword “${input.targetKeyword}” near the start of the title.`);
  if (description.length < 120)
    suggestions.push("Expand the description with a search-friendly summary in the first 2–3 lines.");
  if (tags.length < 5) suggestions.push("Add 5–12 relevant tags for disambiguation (not ranking magic).");
  if (!/[0-9]/.test(title)) suggestions.push("Consider a number or specificity marker to raise CTR.");
  if (suggestions.length === 0) suggestions.push("Packaging looks solid — A/B test thumbnail emotion next.");

  return {
    overall,
    titleScore,
    descriptionScore,
    tagScore,
    keywordCoverage,
    suggestions,
  };
}

export function generateTitles(topic: string, keyword?: string): string[] {
  const k = keyword?.trim() || topic.trim();
  const base = topic.trim() || k;
  return [
    `I Tested ${base} — Here's What Actually Worked`,
    `The ${k} Playbook Nobody Explains Clearly`,
    `Stop Guessing at ${base}: A Data-Backed Guide`,
    `How I Use ${k} to Get More Views (Step-by-Step)`,
    `${base}: What I'd Do Differently in 2026`,
  ];
}

export function generateDescription(topic: string, keyword?: string): string {
  const k = keyword?.trim() || topic;
  return `${topic.trim()} — a practical breakdown of what works right now.

In this video you'll learn how to approach ${k}, avoid common packaging mistakes, and build a repeatable system you can reuse every upload.

Timestamps:
0:00 Hook
0:25 What most creators get wrong
2:10 The framework
6:40 Examples
10:20 Action checklist

If this helped, subscribe for more creator strategy grounded in real channel data.`;
}

export function generateTags(topic: string, keyword?: string): string[] {
  const parts = `${topic} ${keyword ?? ""}`
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  const unique = Array.from(new Set(parts));
  return [...unique.slice(0, 8), "youtube tips", "content strategy", "creator advice"].slice(0, 12);
}
