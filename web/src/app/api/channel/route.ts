import { fetchChannelLive, getDemoChannel } from "@/lib/youtube";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const channelId = new URL(req.url).searchParams.get("id");
  if (channelId) {
    const live = await fetchChannelLive(channelId);
    if (live) return NextResponse.json({ channel: live, videos: [], source: "youtube" });
  }
  const demo = getDemoChannel();
  return NextResponse.json({ ...demo, source: demo.live ? "demo+youtube-ready" : "demo" });
}
