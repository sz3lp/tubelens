import type { ChannelSnapshot } from "@/lib/types";

export const DEMO_CHANNEL: ChannelSnapshot = {
  id: "ch-demo",
  title: "Lens & Ladder",
  handle: "@lensandladder",
  subscribers: 28400,
  totalViews: 2140000,
  videoCount: 96,
  niche: "YouTube Growth",
  avgViews30d: 12600,
  ctrEstimate: 4.8,
  bestPostHours: [10, 14, 18],
  topKeywords: [
    "youtube thumbnail tips",
    "how to grow on youtube 2026",
    "youtube shorts ideas",
    "faceless youtube channel ideas",
  ],
};

export const DEMO_VIDEOS = [
  {
    id: "v1",
    title: "I Tested 12 Thumbnail Styles for 30 Days",
    views: 48200,
    ctr: 6.1,
    avgViewDuration: "48%",
    publishedAt: "2026-09-12",
  },
  {
    id: "v2",
    title: "YouTube SEO Checklist That Still Works",
    views: 31100,
    ctr: 5.2,
    avgViewDuration: "44%",
    publishedAt: "2026-09-02",
  },
  {
    id: "v3",
    title: "Faceless Channel Ideas With Real Demand Data",
    views: 67500,
    ctr: 7.4,
    avgViewDuration: "51%",
    publishedAt: "2026-08-21",
  },
  {
    id: "v4",
    title: "Why Your Shorts Aren't Feeding Long-Form",
    views: 19800,
    ctr: 3.9,
    avgViewDuration: "41%",
    publishedAt: "2026-08-10",
  },
];
