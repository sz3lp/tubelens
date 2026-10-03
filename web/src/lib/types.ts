export type CreditAction =
  | "coach_fast"
  | "coach_deep"
  | "coach_max"
  | "titles"
  | "thumbnail"
  | "script"
  | "clip_minute"
  | "shorts_second";

export type CoachMode = "fast" | "deep" | "max";

export interface KeywordRecord {
  id: string;
  keyword: string;
  niche: string;
  volume: number;
  competition: number;
  trend: number;
  overallScore: number;
  related: string[];
  intent: "how-to" | "review" | "entertainment" | "news" | "listicle" | "comparison";
  notes: string;
}

export interface CompetitorRecord {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  avgViews: number;
  uploadFrequency: string;
  niche: string;
  topTopics: string[];
  recentTitles: string[];
  strengths: string[];
  gaps: string[];
}

export interface ChannelSnapshot {
  id: string;
  title: string;
  handle: string;
  subscribers: number;
  totalViews: number;
  videoCount: number;
  niche: string;
  avgViews30d: number;
  ctrEstimate: number;
  bestPostHours: number[];
  topKeywords: string[];
}

export interface TrendRecord {
  id: string;
  topic: string;
  niche: string;
  velocity: number;
  opportunity: number;
  why: string;
  exampleTitles: string[];
}

export interface VideoScoreInput {
  title: string;
  description: string;
  tags: string[];
  targetKeyword?: string;
}

export interface VideoScoreResult {
  overall: number;
  titleScore: number;
  descriptionScore: number;
  tagScore: number;
  keywordCoverage: number;
  suggestions: string[];
}

export interface CreditState {
  balance: number;
  plan: "demo" | "boost" | "max";
  resetAt: string;
}

export const CREDIT_COSTS: Record<CreditAction, number> = {
  coach_fast: 10,
  coach_deep: 25,
  coach_max: 35,
  titles: 3,
  thumbnail: 22,
  script: 1,
  clip_minute: 9,
  shorts_second: 20,
};

export const MAX_MONTHLY_CREDITS = 6000;
