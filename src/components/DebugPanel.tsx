'use client';

import { useState } from 'react';

interface DebugPanelProps {
  relevanceCount: number;
  timeCount: number;
  uniqueCount: number;
  analysisTimeMs: number;
  totalCharacters: number;
}

export default function DebugPanel({
  relevanceCount,
  timeCount,
  uniqueCount,
  analysisTimeMs,
  totalCharacters,
}: DebugPanelProps) {
  const [open, setOpen] = useState(false);

  const estimatedTokens = Math.ceil(totalCharacters / 4);
  // Gemini 3 Flash: $0.50/1M input, $3.00/1M output. Estimate ~500 output tokens.
  const inputCost = (estimatedTokens / 1_000_000) * 0.5;
  const outputCost = (500 / 1_000_000) * 3.0;
  const estimatedCost = inputCost + outputCost;

  return (
    <div className="border-t border-slate-800 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1 transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Analysis Details
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
          <span>Comments fetched</span>
          <span className="text-slate-400">
            {relevanceCount} by relevance + {timeCount} by recency = {uniqueCount} unique
          </span>
          <span>AI model</span>
          <span className="text-slate-400">google/gemini-3-flash-preview</span>
          <span>Analysis time</span>
          <span className="text-slate-400">{(analysisTimeMs / 1000).toFixed(1)}s</span>
          <span>Estimated cost</span>
          <span className="text-slate-400">${estimatedCost.toFixed(4)}</span>
          <span>Tokens sent (est.)</span>
          <span className="text-slate-400">~{estimatedTokens.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
