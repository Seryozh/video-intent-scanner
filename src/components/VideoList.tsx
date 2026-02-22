'use client';

import VideoCard, { AnalysisProgress } from './VideoCard';
import { IntentCategory, FreshnessData } from '@/lib/types';

interface VideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
}

interface AnalysisData {
  classifications: {
    comment_index: number;
    category: string;
    intent_score: number;
    location: string | null;
    key_phrase: string;
  }[];
  categoryCounts: Record<IntentCategory, number>;
  rawScore: number;
  densityScore: number;
  averageIntentScore: number;
  geoMentions: { location: string; count: number }[];
  freshness: FreshnessData;
  comments: { text: string; authorName: string; likeCount: number; publishedAt: string }[];
  debugInfo?: {
    relevanceCount: number;
    timeCount: number;
    uniqueCount: number;
    analysisTimeMs: number;
    totalCharacters: number;
  };
}

interface VideoListProps {
  videos: VideoData[];
  channelName?: string;
  analyses: Record<string, AnalysisData>;
  progressMap: Record<string, AnalysisProgress>;
  analysisErrors: Record<string, string>;
  onAnalyze: (videoId: string) => void;
  maxDisplay?: number;
}

export default function VideoList({
  videos,
  channelName,
  analyses,
  progressMap,
  analysisErrors,
  onAnalyze,
  maxDisplay = 30,
}: VideoListProps) {
  const displayed = videos.slice(0, maxDisplay);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">
          Top {displayed.length} videos by views
          {videos.length > maxDisplay && (
            <span className="text-slate-500"> (of {videos.length} total)</span>
          )}
        </h3>
      </div>
      <div className="space-y-2">
        {displayed.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            channelName={channelName}
            analysis={analyses[video.videoId] || null}
            progress={progressMap[video.videoId] || null}
            analysisError={analysisErrors[video.videoId] || null}
            onAnalyze={onAnalyze}
          />
        ))}
      </div>
    </div>
  );
}
