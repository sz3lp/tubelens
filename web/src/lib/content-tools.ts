export function writeScript(topic: string, minutes = 8) {
  const beats = Math.max(4, Math.min(12, minutes));
  return `# Script: ${topic}

**Target length:** ~${minutes} minutes
**Framework:** Hook → Promise → Proof → Steps → Objections → CTA

## Hook (0:00–0:08)
Most creators treat “${topic}” like a checklist. The ones growing treat it like a system. Here's the system.

## Promise (0:08–0:25)
By the end, you'll have a repeatable process for ${topic} you can reuse on every upload — not another pile of vague tips.

## Proof (0:25–1:10)
Quick proof: channels that package first and keyword second consistently beat channels that only “optimize tags.”

## Steps
${Array.from({ length: beats }, (_, i) => `### Step ${i + 1}\nExplain the move, show the example, then give the viewer a 60-second action.`).join("\n\n")}

## Objections
“I don't have time.” — Batch packaging. “My niche is saturated.” — Attack gaps, not head terms.

## CTA
If you want the template, comment “SYSTEM” and watch the related video next.
`;
}

export function planClips(sourceTitle: string, durationMinutes: number) {
  const clips = Math.max(3, Math.min(12, Math.round(durationMinutes / 2)));
  return Array.from({ length: clips }, (_, i) => ({
    id: `clip-${i + 1}`,
    title: `${sourceTitle} — Clip ${i + 1}`,
    startSec: i * 45,
    endSec: i * 45 + 35,
    hook: [
      "The mistake everyone makes…",
      "Do this before you upload",
      "The 10-second fix",
      "What the data actually says",
      "Stop doing this in thumbnails",
    ][i % 5],
    format: i % 2 === 0 ? "searchable-short" : "loop-hook",
  }));
}

export function thumbnailBrief(topic: string) {
  return {
    concept: `High-contrast subject for “${topic}” with one clear emotion`,
    textOverlay: topic.split(/\s+/).slice(0, 3).join(" ").toUpperCase(),
    palette: ["#0B1220", "#F5A524", "#F4F7FB"],
    composition: "Subject left-third, curiosity object right, heavy separation from background",
    variants: [
      "Shocked face + before/after inset",
      "Clean product/result hero with bold 3-word claim",
      "Red-X on old way vs check on new way",
    ],
  };
}
