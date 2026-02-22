'use client';

import { useState, useEffect } from 'react';
import { IntentCategory, CATEGORY_LABELS, FreshnessData } from '@/lib/types';
import ConversionScore from './ConversionScore';
import FreshnessBadge from './FreshnessBadge';
import IntentBreakdown from './IntentBreakdown';
import AllComments from './HighIntentComments';
import GeoMentions from './GeoMentions';
import PinnedCommentDraft from './PinnedCommentDraft';
import DebugPanel from './DebugPanel';

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

export interface AnalysisProgress {
  step: 'fetching' | 'fetched' | 'analyzing' | 'done' | 'error';
  commentsFetched?: number;
  relevanceCount?: number;
  timeCount?: number;
  rawComments?: { text: string; authorName: string; likeCount: number; publishedAt: string }[];
  errorMessage?: string;
}

interface VideoCardProps {
  video: VideoData;
  channelName?: string;
  analysis?: AnalysisData | null;
  progress?: AnalysisProgress | null;
  analysisError?: string | null;
  onAnalyze: (videoId: string) => void;
  autoExpand?: boolean;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'just now';
}

export default function VideoCard({
  video,
  channelName,
  analysis,
  progress,
  analysisError,
  onAnalyze,
  autoExpand = false,
}: VideoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [rawCommentsOpen, setRawCommentsOpen] = useState(false);

  const isAnalyzing = !!progress && progress.step !== 'done' && progress.step !== 'error';

  // Auto-expand when analysis completes in single-video mode
  useEffect(() => {
    if (autoExpand && analysis) {
      setExpanded(true);
    }
  }, [autoExpand, analysis]);

  const dominantCategory = analysis
    ? (Object.entries(analysis.categoryCounts) as [IntentCategory, number][])
        .filter(([cat]) => cat !== 'GENERAL' && cat !== 'GRATITUDE_ENGAGEMENT')
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'GENERAL'
    : 'GENERAL';

  const topComments = analysis
    ? [...analysis.classifications]
        .sort((a, b) => b.intent_score - a.intent_score)
        .slice(0, 5)
        .map((c) => {
          const comment = analysis.comments[c.comment_index];
          return comment ? `[${c.category}] "${comment.text.slice(0, 150)}"` : '';
        })
        .filter(Boolean)
        .join('\n')
    : '';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Main row */}
      <div className="p-4 flex items-start gap-4">
        {/* Thumbnail */}
        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-[120px] h-[68px] rounded object-cover bg-slate-800"
          />
        </a>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-100 truncate" title={video.title}>
            {video.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>{formatViews(video.viewCount)} views</span>
            <span className="text-slate-600">·</span>
            <span>{timeAgo(video.publishedAt)}</span>
            <span className="text-slate-600">·</span>
            <span>{video.commentCount.toLocaleString()} comments</span>
          </div>

          {/* Analysis results inline */}
          {analysis && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <ConversionScore rawScore={analysis.rawScore} densityScore={analysis.densityScore} />
              <FreshnessBadge freshness={analysis.freshness} />
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          {!analysis && !isAnalyzing && !analysisError && (
            <button
              onClick={() => onAnalyze(video.videoId)}
              className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700 transition-colors"
            >
              Analyze
            </button>
          )}
          {analysisError && !isAnalyzing && (
            <div className="text-xs text-rose-400 max-w-[200px]">{analysisError}</div>
          )}
          {analysis && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700 transition-colors"
            >
              {expanded ? 'Collapse' : 'Details'}
            </button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {isAnalyzing && (
        <div className="border-t border-slate-800 px-4 py-3 space-y-2">
          {/* Step 1: Fetching */}
          <div className="flex items-center gap-2 text-sm">
            {progress!.step === 'fetching' ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-slate-400">Fetching comments...</span>
              </>
            ) : (
              <>
                <span className="text-emerald-400">&#10003;</span>
                <span className="text-slate-300">
                  {progress!.commentsFetched} comments fetched
                  {progress!.relevanceCount !== undefined && (
                    <span className="text-slate-500">
                      {' '}({progress!.relevanceCount} by relevance, {progress!.timeCount} by recency)
                    </span>
                  )}
                </span>
              </>
            )}
          </div>

          {/* Step 2: Analyzing */}
          {(progress!.step === 'analyzing' || progress!.step === 'fetched') && (
            <div className="flex items-center gap-2 text-sm">
              {progress!.step === 'analyzing' ? (
                <>
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                  </span>
                  <span className="text-slate-400">Analyzing with Gemini 3 Flash...</span>
                </>
              ) : (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-slate-400">Preparing analysis...</span>
                </>
              )}
            </div>
          )}

          {/* Raw comments preview (collapsible, shown while AI is working) */}
          {progress!.rawComments && progress!.rawComments.length > 0 && progress!.step !== 'done' && (
            <div className="mt-2">
              <button
                onClick={() => setRawCommentsOpen(!rawCommentsOpen)}
                className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${rawCommentsOpen ? 'rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Preview raw comments ({progress!.rawComments.length})
              </button>
              {rawCommentsOpen && (
                <div className="mt-2 max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                  {progress!.rawComments.slice(0, 20).map((c, i) => (
                    <div key={i} className="bg-slate-800/30 rounded p-2 text-xs text-slate-400">
                      <span className="text-slate-500">{c.authorName}:</span>{' '}
                      {c.text}
                    </div>
                  ))}
                  {progress!.rawComments.length > 20 && (
                    <p className="text-xs text-slate-600 text-center py-1">
                      + {progress!.rawComments.length - 20} more...
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Expanded details */}
      {analysis && expanded && (
        <div className="border-t border-slate-800 p-4 space-y-5">
          {/* Freshness details */}
          <div className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
            <span>
              Last comment: {analysis.freshness.lastCommentDate ? timeAgo(analysis.freshness.lastCommentDate) : 'N/A'}
            </span>
            <span className="text-slate-600">·</span>
            <span>{analysis.freshness.commentsLast7Days} comments this week</span>
            <span className="text-slate-600">·</span>
            <span>{analysis.freshness.commentsLast30Days} comments this month</span>
            <span className="text-slate-600">·</span>
            <span>Avg intent: {analysis.averageIntentScore.toFixed(1)}/10</span>
          </div>

          {/* Intent breakdown */}
          <IntentBreakdown
            categoryCounts={analysis.categoryCounts}
            totalComments={analysis.comments.length}
          />

          {/* All classified comments with filters */}
          <AllComments
            classifications={analysis.classifications}
            comments={analysis.comments}
            categoryCounts={analysis.categoryCounts}
          />

          {/* Geo mentions */}
          <GeoMentions mentions={analysis.geoMentions} />

          {/* Pinned comment - auto-generate */}
          <PinnedCommentDraft
            channelName={channelName || video.channelTitle}
            videoTitle={video.title}
            topComments={topComments}
            dominantCategory={CATEGORY_LABELS[dominantCategory as IntentCategory] || dominantCategory}
            helpSeekingCount={analysis.categoryCounts.MEDICAL_HELP_SEEKING || 0}
            bookingIntentCount={analysis.categoryCounts.BOOKING_INTENT || 0}
            dominantConcern={CATEGORY_LABELS[dominantCategory as IntentCategory] || 'general'}
            highIntentCount={
              (analysis.categoryCounts.BOOKING_INTENT || 0) +
              (analysis.categoryCounts.MEDICAL_HELP_SEEKING || 0) +
              (analysis.categoryCounts.FRUSTRATION_WITH_SYSTEM || 0)
            }
            autoGenerate
          />

          {/* Debug panel */}
          {analysis.debugInfo && (
            <DebugPanel
              relevanceCount={analysis.debugInfo.relevanceCount}
              timeCount={analysis.debugInfo.timeCount}
              uniqueCount={analysis.debugInfo.uniqueCount}
              analysisTimeMs={analysis.debugInfo.analysisTimeMs}
              totalCharacters={analysis.debugInfo.totalCharacters}
            />
          )}
        </div>
      )}
    </div>
  );
}
