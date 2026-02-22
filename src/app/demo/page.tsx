'use client';

import { useState, useCallback } from 'react';
import { DEMO_VIDEO, DEMO_ANALYSIS, DEMO_PINNED_COMMENT } from '@/lib/demo-data';
import { CATEGORY_LABELS, IntentCategory } from '@/lib/types';
import ConversionScore from '@/components/ConversionScore';
import FreshnessBadge from '@/components/FreshnessBadge';
import IntentBreakdown from '@/components/IntentBreakdown';
import AllComments from '@/components/HighIntentComments';
import GeoMentions from '@/components/GeoMentions';
import StaticPinnedComment from '@/components/StaticPinnedComment';
import DebugPanel from '@/components/DebugPanel';
import TutorialOverlay from '@/components/TutorialOverlay';

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

export default function DemoPage() {
  const [showTutorial, setShowTutorial] = useState(true);

  const video = DEMO_VIDEO;
  const analysis = DEMO_ANALYSIS;

  const dominantCategory = (Object.entries(analysis.categoryCounts) as [IntentCategory, number][])
    .filter(([cat]) => cat !== 'GENERAL' && cat !== 'GRATITUDE_ENGAGEMENT')
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'GENERAL';

  const handleComplete = useCallback(() => {
    window.location.href = '/?key=futureclinic2026';
  }, []);

  const handleSkip = useCallback(() => {
    setShowTutorial(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Video Intent Scanner</h1>
            <p className="text-xs text-slate-500">Finding the videos where patients are already asking</p>
          </div>
          <div className="flex items-center gap-3">
            {!showTutorial && (
              <button
                onClick={() => setShowTutorial(true)}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Restart tutorial
              </button>
            )}
            <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">DEMO MODE</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Search bar (disabled in demo) */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 opacity-60">
            <svg className="w-5 h-5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-slate-500">Paste a YouTube channel or video URL...</span>
          </div>
        </div>

        {/* Video Card */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400">Single Video Analysis</h3>

          <div id="demo-video-card" className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            {/* Main row */}
            <div className="p-4 flex items-start gap-4">
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

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-100 truncate" title={video.title}>
                  {video.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{formatViews(video.viewCount)} views</span>
                  <span className="text-slate-600">&middot;</span>
                  <span>{timeAgo(video.publishedAt)}</span>
                  <span className="text-slate-600">&middot;</span>
                  <span>{video.commentCount.toLocaleString()} comments</span>
                </div>

                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <div id="demo-conversion-score">
                    <ConversionScore rawScore={analysis.rawScore} densityScore={analysis.densityScore} />
                  </div>
                  <div id="demo-freshness">
                    <FreshnessBadge freshness={analysis.freshness} />
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded analysis details */}
            <div className="border-t border-slate-800 p-4 space-y-5">
              {/* Density callout for tutorial targeting */}
              <div id="demo-density" className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                <span>
                  Last comment: {analysis.freshness.lastCommentDate ? timeAgo(analysis.freshness.lastCommentDate) : 'N/A'}
                </span>
                <span className="text-slate-600">&middot;</span>
                <span>{analysis.freshness.commentsLast7Days} comments this week</span>
                <span className="text-slate-600">&middot;</span>
                <span>{analysis.freshness.commentsLast30Days} comments this month</span>
                <span className="text-slate-600">&middot;</span>
                <span>Avg intent: {analysis.averageIntentScore.toFixed(1)}/10</span>
              </div>

              {/* Intent breakdown */}
              <IntentBreakdown
                categoryCounts={analysis.categoryCounts}
                totalComments={analysis.comments.length}
              />

              {/* All classified comments */}
              <div id="demo-comments">
                <AllComments
                  classifications={analysis.classifications}
                  comments={analysis.comments}
                  categoryCounts={analysis.categoryCounts}
                />
              </div>

              {/* Geo mentions */}
              <GeoMentions mentions={analysis.geoMentions} />

              {/* Pinned comment — static, no API call */}
              <div id="demo-pinned-comment">
                <StaticPinnedComment
                  comment={DEMO_PINNED_COMMENT}
                  dominantConcern={CATEGORY_LABELS[dominantCategory as IntentCategory] || 'general'}
                  highIntentCount={
                    (analysis.categoryCounts.BOOKING_INTENT || 0) +
                    (analysis.categoryCounts.MEDICAL_HELP_SEEKING || 0) +
                    (analysis.categoryCounts.FRUSTRATION_WITH_SYSTEM || 0)
                  }
                />
              </div>

              {/* Debug panel */}
              <DebugPanel
                relevanceCount={analysis.debugInfo.relevanceCount}
                timeCount={analysis.debugInfo.timeCount}
                uniqueCount={analysis.debugInfo.uniqueCount}
                analysisTimeMs={analysis.debugInfo.analysisTimeMs}
                totalCharacters={analysis.debugInfo.totalCharacters}
              />
            </div>
          </div>
        </div>

        {/* Link to live tool */}
        {!showTutorial && (
          <div className="text-center py-8">
            <a
              href="/?key=futureclinic2026"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              Try the live tool
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-600">
          Video Intent Scanner &middot; Built for FutureClinic Growth
        </div>
      </footer>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onComplete={handleComplete} onSkip={handleSkip} />
      )}
    </div>
  );
}
