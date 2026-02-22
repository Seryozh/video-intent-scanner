'use client';

import { useState, useEffect, useCallback } from 'react';

interface TutorialStep {
  targetId?: string;
  title: string;
  body: string;
  isFullScreen?: boolean;
  buttonText: string;
}

const STEPS: TutorialStep[] = [
  // Step 0 — Welcome
  {
    isFullScreen: true,
    title: 'Video Intent Scanner',
    body: `You've built an audience of 226,000 people who trust your medical opinion. Some of them are already trying to become your patients — they're just buried in comment sections.

This tool finds them.

It scans any YouTube video, reads every comment, classifies patient intent using AI, and shows you exactly which videos have the most conversion potential.

Here's how it works, using one of your own videos.`,
    buttonText: 'Show me \u2192',
  },
  // Step 1 — Video Card
  {
    targetId: 'demo-video-card',
    title: 'Start with any video',
    body: 'Paste a YouTube URL or scan an entire channel. The tool pulls the video\u2019s stats and fetches up to 100 comments \u2014 50 sorted by relevance (most-liked, most-visible) and 50 by recency (what people are saying right now).',
    buttonText: 'Next \u2192',
  },
  // Step 2 — Conversion Score
  {
    targetId: 'demo-conversion-score',
    title: 'Conversion Score',
    body: `Every comment is classified by AI into 6 categories. Each category has a weight based on how close that person is to becoming a patient:

\ud83d\udfe2 Booking Intent (\u00d710) \u2014 literally trying to book
\ud83d\udfe0 System Frustration (\u00d77) \u2014 unhappy with current care, looking for alternatives
\ud83d\udfe1 Help Seeking (\u00d75) \u2014 describing a real condition, needs convincing
\ud83d\udfe3 Geographic (\u00d73) \u2014 mentions a location (recruitment intel)
\u26aa Gratitude (\u00d71) \u2014 trusts you, but not converting yet
\u26ab General (\u00d70) \u2014 noise

This video scores 142 (MODERATE). Your rosacea video scores 250 (HIGH) \u2014 more people in active distress looking for help.`,
    buttonText: 'Next \u2192',
  },
  // Step 3 — Density
  {
    targetId: 'demo-density',
    title: 'Intent Density \u2014 the key metric',
    body: `Raw score alone is misleading. A viral video with 3M views might have a high raw score but low density \u2014 most viewers are casual.

Density = raw score \u00f7 views (in thousands)

This video: 142 \u00f7 141K = 1.0 per 1K views
Your biggest video (3.1M views): 136 \u00f7 3,100K = 0.04 per 1K views

This lip video has 25\u00d7 more conversion potential per viewer. That's why we target videos, not channels. The biggest video isn't the best opportunity \u2014 the mid-size condition video is.`,
    buttonText: 'Next \u2192',
  },
  // Step 4 — Freshness
  {
    targetId: 'demo-freshness',
    title: 'Is this video still alive?',
    body: `Views don't tell you if a video is still generating traffic RIGHT NOW. Comment timestamps do.

\ud83d\udfe2 Active \u2014 comments in the last 7 days (video is generating views now)
\ud83d\udfe1 Warm \u2014 comments in the last 30 days (still getting traffic)
\ud83d\udd34 Cold \u2014 no comments in 30+ days (peaked, low priority)

This video is Warm: 6 comments this month, last one 15 days ago. Still getting eyeballs. A pinned comment here catches real people today.`,
    buttonText: 'Next \u2192',
  },
  // Step 5 — Comments
  {
    targetId: 'demo-comments',
    title: 'Every comment, classified',
    body: `The tool shows ALL classified comments, not just a summary. Filter by category to see exactly what patients are saying.

This matters because the specific words people use become the copy for pinned comments, CTAs, and eventually paid ads. You're not guessing what patients care about \u2014 they're telling you.

Look at the Help Seeking comments: real people describing isotretinoin damage, eczema, cracked lips on a 3-year-old. These are patients.`,
    buttonText: 'Next \u2192',
  },
  // Step 6 — Pinned Comment
  {
    targetId: 'demo-pinned-comment',
    title: 'From data to action',
    body: `The tool auto-generates a pinned comment draft written in your voice, addressing the specific conditions people describe in the comments.

This isn't a generic CTA. It references eczematous cheilitis, angular cheilitis, and isotretinoin side effects \u2014 because that's what YOUR audience is actually struggling with.

A targeted pinned comment converts at roughly 3\u00d7 a generic \u2018link in bio\u2019 because it responds to demand that already exists.`,
    buttonText: 'Next \u2192',
  },
  // Step 7 — Final
  {
    isFullScreen: true,
    title: 'This is the growth engine',
    body: `Scan a channel \u2192 rank every video by conversion potential \u2192 deploy pinned comments on the top performers \u2192 capture demand \u2192 repeat.

For every doctor who joins FutureClinic, this process identifies which of their videos to activate first, what copy to use, and where their patients are located.

The tool was built overnight. The strategy behind it is in the document I sent you yesterday.

\u2014 Sergey`,
    buttonText: 'Try the live tool \u2192',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function TutorialOverlay({ onComplete, onSkip }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const totalSteps = STEPS.length;
  const current = STEPS[step];

  const updateSpotlight = useCallback(() => {
    if (current.isFullScreen || !current.targetId) {
      setSpotlightRect(null);
      return;
    }
    const el = document.getElementById(current.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
    }
  }, [current]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);
    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [updateSpotlight]);

  // Scroll target into view when step changes
  useEffect(() => {
    if (!current.isFullScreen && current.targetId) {
      const el = document.getElementById(current.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // Check if element is not fully visible
        if (rect.top < 80 || rect.bottom > viewportHeight - 100) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Update spotlight position after scroll
          setTimeout(updateSpotlight, 400);
        }
      }
    }
  }, [step, current, updateSpotlight]);

  const goNext = useCallback(() => {
    if (step >= totalSteps - 1) {
      // Final step — navigate to live tool
      window.location.href = '/?key=futureclinic2026';
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setIsTransitioning(false);
    }, 150);
  }, [step, totalSteps]);

  const goBack = useCallback(() => {
    if (step <= 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setIsTransitioning(false);
    }, 150);
  }, [step]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goBack, onSkip]);

  // Card positioning for spotlight mode
  const getCardPosition = (): React.CSSProperties => {
    if (current.isFullScreen || !spotlightRect) return {};

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const cardWidth = Math.min(420, viewportW - 32);
    const padding = 16;

    // Mobile: drawer at bottom
    if (viewportW < 768) {
      return {
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        maxWidth: '100%',
        borderRadius: '16px 16px 0 0',
      };
    }

    // Desktop: position near the highlighted element
    const spaceRight = viewportW - spotlightRect.right;
    const spaceLeft = spotlightRect.left;
    const spaceBelow = viewportH - spotlightRect.bottom;

    let top: number;
    let left: number;

    // Prefer placing to the right
    if (spaceRight > cardWidth + padding * 2) {
      left = spotlightRect.right + padding;
      top = Math.max(padding, spotlightRect.top);
    }
    // Try left
    else if (spaceLeft > cardWidth + padding * 2) {
      left = spotlightRect.left - cardWidth - padding;
      top = Math.max(padding, spotlightRect.top);
    }
    // Place below
    else if (spaceBelow > 200) {
      left = Math.max(padding, (viewportW - cardWidth) / 2);
      top = spotlightRect.bottom + padding;
    }
    // Place above
    else {
      left = Math.max(padding, (viewportW - cardWidth) / 2);
      top = Math.max(padding, spotlightRect.top - 320);
    }

    // Keep within viewport
    top = Math.min(top, viewportH - 400);
    top = Math.max(padding, top);

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      maxWidth: `${cardWidth}px`,
      width: `${cardWidth}px`,
    };
  };

  return (
    <div className="fixed inset-0 z-[9999]" role="dialog" aria-label="Tutorial walkthrough">
      {/* Backdrop for full-screen steps */}
      {current.isFullScreen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      )}

      {/* SVG mask spotlight for targeted steps */}
      {!current.isFullScreen && spotlightRect && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 8}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 16}
                rx="12"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      )}

      {/* Spotlight ring glow */}
      {!current.isFullScreen && spotlightRect && (
        <div
          className="absolute rounded-xl ring-2 ring-emerald-500/50 pointer-events-none"
          style={{
            zIndex: 2,
            left: spotlightRect.left - 8,
            top: spotlightRect.top - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            transition: 'all 300ms ease-in-out',
          }}
        />
      )}

      {/* Click blocker for non-spotlight areas */}
      {!current.isFullScreen && (
        <div className="absolute inset-0" style={{ zIndex: 3 }} />
      )}

      {/* Explanation Card */}
      <div
        className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{
          zIndex: 10,
          ...(current.isFullScreen
            ? { position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }
            : getCardPosition()),
        }}
      >
        {current.isFullScreen ? (
          // Full-screen centered card
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border-l-2 border-l-emerald-500">
            <p className="text-xs text-slate-500 mb-4">
              {step === 0 ? '' : `Step ${step} of ${totalSteps - 1}`}
            </p>
            <h2 className="text-2xl font-bold text-white mb-2">{current.title}</h2>
            {step === 0 && (
              <p className="text-sm text-slate-400 mb-5">Finding the videos where patients are already asking</p>
            )}
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-8">
              {current.body}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={goBack}
                    className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    \u2190 Back
                  </button>
                )}
              </div>
              <button
                onClick={goNext}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                {current.buttonText}
              </button>
            </div>
            {step === 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={onSkip}
                  className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
                >
                  Skip tutorial
                </button>
              </div>
            )}
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === step ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Positioned explanation card near spotlight
          <div className="bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl border-l-2 border-l-emerald-500">
            <p className="text-xs text-slate-500 mb-3">
              Step {step} of {totalSteps - 1}
            </p>
            <h3 className="text-lg font-bold text-white mb-3">{current.title}</h3>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-5 max-h-[50vh] overflow-y-auto">
              {current.body}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                \u2190 Back
              </button>
              <button
                onClick={goNext}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
              >
                {current.buttonText}
              </button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={onSkip}
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Skip tutorial
              </button>
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === step ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
