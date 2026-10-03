import { DEMO_CHANNEL, DEMO_VIDEOS } from "@/lib/knowledge/channel";
import { getKeyword, searchKeywords } from "@/lib/knowledge/keywords";
import type { ChannelSnapshot, KeywordRecord } from "@/lib/types";

const API = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  return process.env.YOUTUBE_API_KEY || process.env.GOOGLE_API_KEY || "";
}

export function youtubeConfigured() {
  return Boolean(apiKey());
}

export async function fetchChannelLive(channelId: string): Promise<ChannelSnapshot | null> {
  const key = apiKey();
  if (!key) return null;
  const url = new URL(`${API}/channels`);
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", key);
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  return {
    id: item.id,
    title: item.snippet?.title ?? "Channel",
    handle: item.snippet?.customUrl ? `@${String(item.snippet.customUrl).replace(/^@/, "")}` : "@channel",
    subscribers: Number(item.statistics?.subscriberCount ?? 0),
    totalViews: Number(item.statistics?.viewCount ?? 0),
    videoCount: Number(item.statistics?.videoCount ?? 0),
    niche: DEMO_CHANNEL.niche,
    avgViews30d: Math.round(Number(item.statistics?.viewCount ?? 0) / Math.max(1, Number(item.statistics?.videoCount ?? 1))),
    ctrEstimate: DEMO_CHANNEL.ctrEstimate,
    bestPostHours: DEMO_CHANNEL.bestPostHours,
    topKeywords: DEMO_CHANNEL.topKeywords,
  };
}

/** Enrich keyword research: prefer knowledge DB, optionally validate via YouTube search. */
export async function researchKeyword(query: string): Promise<{
  source: "knowledge" | "youtube+knowledge" | "synthetic";
  keyword: KeywordRecord;
  relatedVideos?: { title: string; channelTitle: string; videoId: string }[];
}> {
  const known = getKeyword(query) ?? searchKeywords(query)[0];
  const key = apiKey();

  if (!key) {
    if (known) return { source: "knowledge", keyword: known };
    return { source: "synthetic", keyword: synthesizeKeyword(query) };
  }

  try {
    const url = new URL(`${API}/search`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "8");
    url.searchParams.set("q", query);
    url.searchParams.set("key", key);
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    const data = res.ok ? await res.json() : { items: [] };
    const relatedVideos = (data.items ?? []).map(
      (item: { id?: { videoId?: string }; snippet?: { title?: string; channelTitle?: string } }) => ({
        title: item.snippet?.title ?? "Untitled",
        channelTitle: item.snippet?.channelTitle ?? "Unknown",
        videoId: item.id?.videoId ?? "",
      }),
    );

    const keyword = known ?? synthesizeKeyword(query, relatedVideos.length);
    return {
      source: "youtube+knowledge",
      keyword,
      relatedVideos,
    };
  } catch {
    if (known) return { source: "knowledge", keyword: known };
    return { source: "synthetic", keyword: synthesizeKeyword(query) };
  }
}

function synthesizeKeyword(query: string, competitionHint = 5): KeywordRecord {
  const volume = 5000 + query.length * 800 + competitionHint * 1200;
  const competition = Math.min(90, 35 + competitionHint * 6 + query.length);
  const trend = 40 + (query.length % 40);
  const overallScore = Math.round(100 - competition * 0.45 + Math.min(30, volume / 4000) + trend * 0.2);
  return {
    id: `syn-${query.slice(0, 24)}`,
    keyword: query.toLowerCase(),
    niche: "General",
    volume,
    competition,
    trend,
    overallScore: Math.max(20, Math.min(95, overallScore)),
    related: [`${query} tips`, `best ${query}`, `${query} for beginners`],
    intent: "how-to",
    notes: "Synthesized from query heuristics. Connect YOUTUBE_API_KEY and run sync for live calibration.",
  };
}

export function getDemoChannel() {
  return { channel: DEMO_CHANNEL, videos: DEMO_VIDEOS, live: youtubeConfigured() };
}
