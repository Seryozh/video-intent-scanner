'use client';

import { useState } from 'react';

interface StaticPinnedCommentProps {
  comment: string;
  dominantConcern: string;
  highIntentCount: number;
}

export default function StaticPinnedComment({
  comment,
  dominantConcern,
  highIntentCount,
}: StaticPinnedCommentProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(comment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-slate-300">Pinned Comment Draft</h4>
      <div className="space-y-2">
        <div className="bg-slate-800 rounded-md p-4 text-sm text-slate-200 leading-relaxed border border-slate-700">
          {comment}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            This comment addresses the {dominantConcern} concern visible in {highIntentCount} comments and converts interest into a consultation link.
          </p>
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
