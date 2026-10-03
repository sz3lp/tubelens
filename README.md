# Tubelens

A YouTube growth suite aimed at **vidIQ Max parity**: keyword research, competitor intel, trends, video SEO optimizer, AI Coach (Fast / Deep / Max), thumbnails, scripts, clips & Shorts, channel analytics, credit economy, and a Chrome extension overlay.

## Data architecture (where the knowledge comes from)

Tubelens does **not** copy vidIQ’s proprietary database. The knowledge layer is built from:

1. **Tubelens knowledge graph** (shipped seed in `web/src/lib/knowledge/`)
   - Keyword demand / competition / trend scores
   - Competitor boards with gaps
   - Trend intercepts
   - AI Coach playbook retrieval
2. **YouTube Data API v3** (optional `YOUTUBE_API_KEY`)
   - Live search enrichment for keyword research
   - Live channel statistics via `/api/channel?id=...`
3. **Connected-channel path (next)**
   - YouTube OAuth + YouTube Analytics API for private Studio metrics
4. **LLM coach** (optional `OPENAI_API_KEY`)
   - Uses retrieved knowledge context; falls back to a grounded local coach

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `web/.env.example` → `web/.env.local` and add keys when ready.

### Chrome extension

1. Chrome → `chrome://extensions` → Developer mode
2. Load unpacked → `extension/`
3. Visit YouTube to see Tubelens Vision overlays

## Max feature map

| Feature | Route / surface |
| --- | --- |
| Dashboard digest | `/dashboard` |
| Keyword research | `/keywords` + `/api/keywords` |
| Competitors | `/competitors` |
| Trends | `/trends` |
| Video optimizer / SEO score | `/optimize` |
| AI Coach Fast/Deep/Max | `/coach` |
| Thumbnails | `/thumbnails` |
| Script writer | `/scripts` |
| Clips & Shorts | `/clips` |
| Channel analytics | `/channel` |
| Extension docs | `/extension` + `extension/` |
| Credits (6,000 Max default) | cookie-backed `/api/credits` |

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Knowledge modules + API routes
- Manifest V3 Chrome extension
