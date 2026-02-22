export interface ChannelInfo {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  thumbnail: string;
  uploadsPlaylistId: string;
}

export interface VideoInfo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
}

export interface CommentData {
  commentId: string;
  text: string;
  authorName: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
}

export interface ClassifiedComment {
  comment_index: number;
  category: IntentCategory;
  intent_score: number;
  location: string | null;
  key_phrase: string;
}

export type IntentCategory =
  | 'BOOKING_INTENT'
  | 'FRUSTRATION_WITH_SYSTEM'
  | 'MEDICAL_HELP_SEEKING'
  | 'GEOGRAPHIC_MENTION'
  | 'GRATITUDE_ENGAGEMENT'
  | 'GENERAL';

export interface AnalysisResult {
  videoId: string;
  comments: CommentData[];
  classifications: ClassifiedComment[];
  categoryCounts: Record<IntentCategory, number>;
  rawScore: number;
  densityScore: number;
  averageIntentScore: number;
  geoMentions: { location: string; count: number }[];
  freshness: FreshnessData;
}

export interface FreshnessData {
  lastCommentDate: string | null;
  commentsLast7Days: number;
  commentsLast30Days: number;
  badge: 'active' | 'warm' | 'cold';
}

export const INTENT_WEIGHTS: Record<IntentCategory, number> = {
  BOOKING_INTENT: 10,
  FRUSTRATION_WITH_SYSTEM: 7,
  MEDICAL_HELP_SEEKING: 5,
  GEOGRAPHIC_MENTION: 3,
  GRATITUDE_ENGAGEMENT: 1,
  GENERAL: 0,
};

export const CATEGORY_COLORS: Record<IntentCategory, string> = {
  BOOKING_INTENT: 'bg-emerald-500',
  FRUSTRATION_WITH_SYSTEM: 'bg-amber-500',
  MEDICAL_HELP_SEEKING: 'bg-sky-500',
  GEOGRAPHIC_MENTION: 'bg-violet-500',
  GRATITUDE_ENGAGEMENT: 'bg-slate-500',
  GENERAL: 'bg-slate-600',
};

export const CATEGORY_TEXT_COLORS: Record<IntentCategory, string> = {
  BOOKING_INTENT: 'text-emerald-400',
  FRUSTRATION_WITH_SYSTEM: 'text-amber-400',
  MEDICAL_HELP_SEEKING: 'text-sky-400',
  GEOGRAPHIC_MENTION: 'text-violet-400',
  GRATITUDE_ENGAGEMENT: 'text-slate-400',
  GENERAL: 'text-slate-500',
};

export const CATEGORY_LABELS: Record<IntentCategory, string> = {
  BOOKING_INTENT: 'Booking Intent',
  FRUSTRATION_WITH_SYSTEM: 'System Frustration',
  MEDICAL_HELP_SEEKING: 'Help Seeking',
  GEOGRAPHIC_MENTION: 'Geographic',
  GRATITUDE_ENGAGEMENT: 'Gratitude',
  GENERAL: 'General',
};
