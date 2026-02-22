'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DEMO_CHANNEL,
  DEMO_VIDEOS,
  DEMO_TARGET_VIDEO,
  DEMO_ANALYSIS,
  DEMO_PINNED_COMMENT,
} from '@/lib/demo-data';
import { CATEGORY_LABELS, IntentCategory } from '@/lib/types';
import ChannelCard from '@/components/ChannelCard';
import ConversionScore from '@/components/ConversionScore';
import FreshnessBadge from '@/components/FreshnessBadge';
import IntentBreakdown from '@/components/IntentBreakdown';
import AllComments from '@/components/HighIntentComments';
import GeoMentions from '@/components/GeoMentions';
import StaticPinnedComment from '@/components/StaticPinnedComment';
import DebugPanel from '@/components/DebugPanel';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const days = Math.floor((now - then) / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  return 'today';
}

// ── Tutorial step content ────────────────────────────────────────────────────

interface StepContent {
  title: string;
  body: string;
  targetId?: string;
  isFullScreen?: boolean;
}

const ANALYSIS_STEPS: StepContent[] = [
  {
    targetId: 'demo-conversion-score',
    title: 'Conversion Score',
    body: `Every comment gets classified by AI into 6 categories. Each has a weight based on how close that person is to becoming a patient:

Booking Intent (x10) - literally trying to book
System Frustration (x7) - unhappy with current care
Help Seeking (x5) - describing a real condition
Geographic (x3) - mentions a location
Gratitude (x1) - trusts you, not converting yet
General (x0) - noise

This video scores 142 (MODERATE). Your rosacea video scores 250 (HIGH), with more people in active distress.`,
  },
  {
    targetId: 'demo-density',
    title: 'Intent Density: the key metric',
    body: `Raw score alone is misleading. A viral video with 3M views might have a high raw score but low density because most viewers are casual.

Density = raw score / views (in thousands)

This video: 142 / 141K = 1.0 per 1K views
Your biggest video (3.1M views): 136 / 3,100K = 0.04

This lip video has 25x more conversion potential per viewer. That's why we target specific videos, not just channels. The biggest video isn't always the best opportunity.`,
  },
  {
    targetId: 'demo-freshness',
    title: 'Is this video still alive?',
    body: `Views don't tell you if a video is still generating traffic RIGHT NOW. Comment timestamps do.

Active = comments in the last 7 days
Warm = comments in the last 30 days
Cold = no comments in 30+ days

This video is Warm: 6 comments this month, last one 15 days ago. Still getting eyeballs. A pinned comment here catches real people today.`,
  },
  {
    targetId: 'demo-comments',
    title: 'Every comment, classified',
    body: `Filter by category to see exactly what patients are saying. The specific words people use become the copy for pinned comments, CTAs, and eventually paid ads.

You're not guessing what patients care about. They're telling you.

Look at the Help Seeking comments: real people describing isotretinoin damage, eczema, cracked lips on a 3-year-old. These are patients.`,
  },
  {
    targetId: 'demo-pinned-comment',
    title: 'From data to action',
    body: `The tool auto-generates a pinned comment draft written in your voice, addressing the specific conditions people describe.

This isn't a generic CTA. It references eczematous cheilitis, angular cheilitis, and isotretinoin side effects, because that's what YOUR audience is actually struggling with.

A targeted pinned comment converts at roughly 3x a generic "link in bio" because it responds to demand that already exists.`,
  },
];

// ── Main component ───────────────────────────────────────────────────────────

type Phase =
  | 'welcome'
  | 'typing'
  | 'loading-channel'
  | 'videos'
  | 'mock-fetching'
  | 'mock-analyzing'
  | 'tutorial'
  | 'final'
  | 'exploring';

export default function DemoPage() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const analysis = DEMO_ANALYSIS;
  const targetVideo = DEMO_TARGET_VIDEO;

  const dominantCategory = (Object.entries(analysis.categoryCounts) as [IntentCategory, number][])
    .filter(([cat]) => cat !== 'GENERAL' && cat !== 'GRATITUDE_ENGAGEMENT')
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'GENERAL';

  // ── Phase transitions ────────────────────────────────────────────────────

  const startDemo = useCallback(() => {
    setPhase('typing');
    // Auto-type animation
    const text = '@usamasyed';
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setSearchValue(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        // Auto-submit after typing
        setTimeout(() => {
          setPhase('loading-channel');
          // Show channel after brief loading
          setTimeout(() => setPhase('videos'), 1500);
        }, 400);
      }
    }, 80);
  }, []);

  const handleAnalyzeClick = useCallback(() => {
    setPhase('mock-fetching');
    setTimeout(() => {
      setPhase('mock-analyzing');
      setTimeout(() => {
        setShowAnalysis(true);
        setPhase('tutorial');
        setTutorialStep(0);
      }, 2500);
    }, 1800);
  }, []);

  // ── Spotlight positioning ────────────────────────────────────────────────

  const updateSpotlight = useCallback(() => {
    if (phase !== 'tutorial') { setSpotlightRect(null); return; }
    const step = ANALYSIS_STEPS[tutorialStep];
    if (!step?.targetId) { setSpotlightRect(null); return; }
    const el = document.getElementById(step.targetId);
    if (el) {
      setSpotlightRect(el.getBoundingClientRect());
    }
  }, [phase, tutorialStep]);

  useEffect(() => {
    updateSpotlight();
    const onResize = () => updateSpotlight();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [updateSpotlight]);

  // Scroll target into view
  useEffect(() => {
    if (phase !== 'tutorial') return;
    const step = ANALYSIS_STEPS[tutorialStep];
    if (!step?.targetId) return;
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(updateSpotlight, 400);
    }
  }, [phase, tutorialStep, updateSpotlight]);

  // ── Navigation ───────────────────────────────────────────────────────────

  const nextStep = useCallback(() => {
    if (phase === 'tutorial') {
      if (tutorialStep >= ANALYSIS_STEPS.length - 1) {
        setIsTransitioning(true);
        setTimeout(() => { setPhase('final'); setIsTransitioning(false); }, 150);
      } else {
        setIsTransitioning(true);
        setTimeout(() => { setTutorialStep(s => s + 1); setIsTransitioning(false); }, 150);
      }
    }
  }, [phase, tutorialStep]);

  const prevStep = useCallback(() => {
    if (phase === 'tutorial' && tutorialStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => { setTutorialStep(s => s - 1); setIsTransitioning(false); }, 150);
    }
  }, [phase, tutorialStep]);

  const skipToExplore = useCallback(() => {
    setShowAnalysis(true);
    setPhase('exploring');
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase === 'tutorial') {
        if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); nextStep(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
        else if (e.key === 'Escape') { e.preventDefault(); skipToExplore(); }
      } else if (phase === 'welcome' && (e.key === 'Enter' || e.key === 'ArrowRight')) {
        e.preventDefault(); startDemo();
      } else if (phase === 'final' && e.key === 'Escape') {
        e.preventDefault(); skipToExplore();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, nextStep, prevStep, skipToExplore, startDemo]);

  // ── Card position (near spotlight) ───────────────────────────────────────

  const getCardStyle = (): React.CSSProperties => {
    if (!spotlightRect) return {};
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cardW = Math.min(400, vw - 32);
    const pad = 20;

    // Mobile: bottom drawer
    if (vw < 768) {
      return { position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: '100%', borderRadius: '16px 16px 0 0' };
    }

    const spaceRight = vw - spotlightRect.right;
    let top = Math.max(pad, spotlightRect.top);
    let left: number;

    if (spaceRight > cardW + pad * 2) {
      left = spotlightRect.right + pad;
    } else if (spotlightRect.left > cardW + pad * 2) {
      left = spotlightRect.left - cardW - pad;
    } else {
      left = Math.max(pad, (vw - cardW) / 2);
      top = spotlightRect.bottom + pad;
    }

    top = Math.min(top, vh - 420);
    top = Math.max(pad, top);

    return { position: 'fixed', top, left, width: cardW, maxWidth: cardW };
  };

  // ── Total steps for progress dots ────────────────────────────────────────

  const totalSteps = ANALYSIS_STEPS.length;
  const currentStep = ANALYSIS_STEPS[tutorialStep];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-100">Video Intent Scanner</h1>
            <p className="text-xs text-slate-500">Finding the videos where patients are already asking</p>
          </div>
          <div className="flex items-center gap-3">
            {phase === 'exploring' && (
              <button
                onClick={() => { setShowAnalysis(false); setPhase('welcome'); setSearchValue(''); setTutorialStep(0); }}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Restart tutorial
              </button>
            )}
            <span className="text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded">DEMO</span>
          </div>
        </div>
      </header>

      {/* Main content - visible after welcome */}
      {phase !== 'welcome' && (
        <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Search bar */}
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                ref={searchRef}
                type="text"
                value={searchValue}
                readOnly
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none"
                placeholder="Paste a YouTube channel or video URL..."
              />
              <button
                disabled
                className={`px-6 py-3 font-medium rounded-lg transition-colors whitespace-nowrap ${
                  phase === 'typing' || phase === 'loading-channel'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-500'
                }`}
              >
                {(phase === 'typing' || phase === 'loading-channel') ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Scanning...
                  </span>
                ) : 'Scan'}
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {phase === 'loading-channel' && (
            <div className="animate-pulse space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4 max-w-3xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-800 rounded w-48" />
                  <div className="h-4 bg-slate-800 rounded w-32" />
                </div>
              </div>
            </div>
          )}

          {/* Channel card + videos */}
          {(phase !== 'typing' && phase !== 'loading-channel') && (
            <>
              <ChannelCard channel={DEMO_CHANNEL} />

              {/* Video list */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-slate-400">
                  Top {DEMO_VIDEOS.length} videos by views
                  <span className="text-slate-500"> (of {DEMO_CHANNEL.videoCount} total)</span>
                </h3>
                <div className="space-y-2">
                  {DEMO_VIDEOS.map((video) => {
                    const isTarget = video.videoId === targetVideo.videoId;
                    const isAnalyzed = showAnalysis && isTarget;
                    const isMockLoading = isTarget && (phase === 'mock-fetching' || phase === 'mock-analyzing');

                    return (
                      <div
                        key={video.videoId}
                        id={isTarget ? 'demo-target-video' : undefined}
                        className={`bg-slate-900 rounded-lg overflow-hidden ${
                          isTarget && phase === 'videos'
                            ? 'ring-2 ring-emerald-500 border border-emerald-500/40 shadow-lg shadow-emerald-500/20 animate-glow-pulse'
                            : 'border border-slate-800'
                        }`}
                      >
                        {/* Video row */}
                        <div className="p-4 flex items-start gap-4">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-[120px] h-[68px] rounded object-cover bg-slate-800 flex-shrink-0"
                          />
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
                            {/* Score badges (only for analyzed video) */}
                            {isAnalyzed && (
                              <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <div id="demo-conversion-score">
                                  <ConversionScore rawScore={analysis.rawScore} densityScore={analysis.densityScore} />
                                </div>
                                <div id="demo-freshness">
                                  <FreshnessBadge freshness={analysis.freshness} />
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Action button */}
                          <div className="flex-shrink-0">
                            {!isAnalyzed && !isMockLoading && (
                              <button
                                onClick={isTarget ? handleAnalyzeClick : undefined}
                                disabled={phase === 'mock-fetching' || phase === 'mock-analyzing' || phase === 'tutorial' || phase === 'final'}
                                className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                                  isTarget && phase === 'videos'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 animate-pulse'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                                }`}
                              >
                                Analyze
                              </button>
                            )}
                            {isAnalyzed && (
                              <span className="px-3 py-1.5 text-xs text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                                Analyzed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mock loading indicator */}
                        {isMockLoading && (
                          <div className="border-t border-slate-800 px-4 py-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              {phase === 'mock-fetching' ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                  <span className="text-slate-400">Fetching comments...</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-emerald-400">&#10003;</span>
                                  <span className="text-slate-300">89 comments fetched <span className="text-slate-500">(50 by relevance, 50 by recency)</span></span>
                                </>
                              )}
                            </div>
                            {phase === 'mock-analyzing' && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="relative flex h-4 w-4 items-center justify-center">
                                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-50" />
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                                </span>
                                <span className="text-slate-400">Analyzing with Gemini 3 Flash...</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Expanded analysis */}
                        {isAnalyzed && (
                          <div className="border-t border-slate-800 p-4 space-y-5">
                            <div id="demo-density" className="text-xs text-slate-400 flex items-center gap-3 flex-wrap">
                              <span>Last comment: {analysis.freshness.lastCommentDate ? timeAgo(analysis.freshness.lastCommentDate) : 'N/A'}</span>
                              <span className="text-slate-600">&middot;</span>
                              <span>{analysis.freshness.commentsLast7Days} comments this week</span>
                              <span className="text-slate-600">&middot;</span>
                              <span>{analysis.freshness.commentsLast30Days} comments this month</span>
                              <span className="text-slate-600">&middot;</span>
                              <span>Avg intent: {analysis.averageIntentScore.toFixed(1)}/10</span>
                            </div>
                            <IntentBreakdown categoryCounts={analysis.categoryCounts} totalComments={analysis.comments.length} />
                            <div id="demo-comments">
                              <AllComments classifications={analysis.classifications} comments={analysis.comments} categoryCounts={analysis.categoryCounts} />
                            </div>
                            <GeoMentions mentions={analysis.geoMentions} />
                            <div id="demo-pinned-comment">
                              <StaticPinnedComment
                                comment={DEMO_PINNED_COMMENT}
                                dominantConcern={CATEGORY_LABELS[dominantCategory as IntentCategory] || 'general'}
                                highIntentCount={(analysis.categoryCounts.BOOKING_INTENT || 0) + (analysis.categoryCounts.MEDICAL_HELP_SEEKING || 0) + (analysis.categoryCounts.FRUSTRATION_WITH_SYSTEM || 0)}
                              />
                            </div>
                            <DebugPanel
                              relevanceCount={analysis.debugInfo.relevanceCount}
                              timeCount={analysis.debugInfo.timeCount}
                              uniqueCount={analysis.debugInfo.uniqueCount}
                              analysisTimeMs={analysis.debugInfo.analysisTimeMs}
                              totalCharacters={analysis.debugInfo.totalCharacters}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      )}

      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-600">
          Video Intent Scanner &middot; Built for FutureClinic Growth
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* OVERLAY LAYER                                                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {/* Welcome overlay */}
      {phase === 'welcome' && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center">
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border-l-4 border-l-emerald-500">
            <h2 className="text-2xl font-bold text-white mb-2">Video Intent Scanner</h2>
            <p className="text-sm text-slate-400 mb-6">Finding the videos where patients are already asking</p>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 mb-8">
              <p>
                You&apos;ve built an audience of 226,000 people who trust your medical opinion.
                Some of them are already trying to become your patients. They&apos;re just buried
                in comment sections.
              </p>
              <p>This tool finds them.</p>
              <p>
                It scans any YouTube video, reads every comment, classifies patient intent
                using AI, and shows you exactly which videos have the most conversion potential.
              </p>
              <p className="text-slate-400">Here&apos;s how it works, using your own channel.</p>
            </div>
            <button
              onClick={startDemo}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              Show me {'->'}
            </button>
            <div className="mt-3 text-center">
              <button onClick={skipToExplore} className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                Skip tutorial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Pick a video" prompt when videos are shown */}
      {phase === 'videos' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-slate-900/95 border border-slate-700 rounded-xl px-6 py-4 shadow-2xl border-l-4 border-l-emerald-500 max-w-sm">
            <p className="text-sm text-slate-300 mb-1">
              <span className="text-emerald-400 font-medium">Your channel, {DEMO_CHANNEL.videoCount} videos.</span>
            </p>
            <p className="text-sm text-slate-400">
              Click <span className="text-emerald-400">Analyze</span> on the highlighted video to scan its comments.
            </p>
          </div>
        </div>
      )}

      {/* Tutorial spotlight overlay */}
      {phase === 'tutorial' && currentStep && (
        <div className="fixed inset-0 z-[9999]" role="dialog">
          {/* SVG mask spotlight */}
          {spotlightRect && (
            <>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <mask id="spot-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <rect
                      x={spotlightRect.left - 12}
                      y={spotlightRect.top - 12}
                      width={spotlightRect.width + 24}
                      height={spotlightRect.height + 24}
                      rx="14"
                      fill="black"
                    />
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0,0,0,0.75)" mask="url(#spot-mask)" />
              </svg>
              {/* Glow ring */}
              <div
                className="absolute rounded-xl pointer-events-none animate-glow-pulse"
                style={{
                  zIndex: 2,
                  left: spotlightRect.left - 12,
                  top: spotlightRect.top - 12,
                  width: spotlightRect.width + 24,
                  height: spotlightRect.height + 24,
                  boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.3)',
                  transition: 'all 300ms ease-in-out',
                }}
              />
              {/* Arrow indicator */}
              <div
                className="absolute pointer-events-none z-[3]"
                style={{
                  left: spotlightRect.left + spotlightRect.width / 2 - 12,
                  top: spotlightRect.top - 36,
                  transition: 'all 300ms ease-in-out',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-emerald-400 animate-bounce">
                  <path d="M12 4 L4 14 L10 14 L10 20 L14 20 L14 14 L20 14 Z" fill="currentColor" />
                </svg>
              </div>
            </>
          )}

          {/* Click blocker */}
          <div className="absolute inset-0" style={{ zIndex: 3 }} />

          {/* Explanation card */}
          <div
            className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            style={{ zIndex: 10, ...getCardStyle() }}
          >
            <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl border-l-4 border-l-emerald-500">
              <p className="text-xs text-slate-500 mb-3">
                Step {tutorialStep + 1} of {totalSteps}
              </p>
              <h3 className="text-lg font-bold text-white mb-3">{currentStep.title}</h3>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-5 max-h-[45vh] overflow-y-auto">
                {currentStep.body}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  className={`text-sm transition-colors ${tutorialStep > 0 ? 'text-slate-400 hover:text-slate-300' : 'text-transparent pointer-events-none'}`}
                >
                  {'<-'} Back
                </button>
                <button
                  onClick={nextStep}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {tutorialStep === totalSteps - 1 ? 'Finish' : 'Next ->'}
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button onClick={skipToExplore} className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                  Skip tutorial
                </button>
                <div className="flex gap-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === tutorialStep ? 'bg-emerald-500' : 'bg-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final overlay */}
      {phase === 'final' && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center">
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border-l-4 border-l-emerald-500">
            <h2 className="text-2xl font-bold text-white mb-6">This is the growth engine</h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 mb-8">
              <p>
                Scan a channel. Rank every video by conversion potential. Deploy
                pinned comments on the top performers. Capture demand. Repeat.
              </p>
              <p>
                For every doctor who joins FutureClinic, this process identifies which of
                their videos to activate first, what copy to use, and where their patients
                are located.
              </p>
              <p className="text-slate-400">
                The tool was built overnight. The strategy behind it is in the document
                I sent you yesterday.
              </p>
              <p className="text-slate-500 mt-4">
                &mdash; Sergey
              </p>
            </div>
            <button
              onClick={skipToExplore}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
            >
              Explore the results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
