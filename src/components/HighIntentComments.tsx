'use client';

import { useState } from 'react';
import { CATEGORY_COLORS, CATEGORY_LABELS, IntentCategory } from '@/lib/types';

interface ClassifiedComment {
  comment_index: number;
  category: string;
  intent_score: number;
  location: string | null;
  key_phrase: string;
}

interface CommentData {
  text: string;
  authorName: string;
  likeCount: number;
}

interface AllCommentsProps {
  classifications: ClassifiedComment[];
  comments: CommentData[];
  categoryCounts: Record<IntentCategory, number>;
}

type FilterKey = 'ALL' | IntentCategory;

export default function AllComments({ classifications, comments, categoryCounts }: AllCommentsProps) {
  const [filter, setFilter] = useState<FilterKey>('ALL');

  // Sort by intent score descending
  const sorted = [...classifications].sort((a, b) => b.intent_score - a.intent_score);

  // Apply filter
  const filtered = filter === 'ALL'
    ? sorted
    : sorted.filter((c) => c.category === filter);

  const totalCount = classifications.length;

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: totalCount },
    { key: 'BOOKING_INTENT', label: 'Booking Intent', count: categoryCounts.BOOKING_INTENT || 0 },
    { key: 'MEDICAL_HELP_SEEKING', label: 'Help Seeking', count: categoryCounts.MEDICAL_HELP_SEEKING || 0 },
    { key: 'FRUSTRATION_WITH_SYSTEM', label: 'Frustration', count: categoryCounts.FRUSTRATION_WITH_SYSTEM || 0 },
    { key: 'GEOGRAPHIC_MENTION', label: 'Geographic', count: categoryCounts.GEOGRAPHIC_MENTION || 0 },
    { key: 'GRATITUDE_ENGAGEMENT', label: 'Gratitude', count: categoryCounts.GRATITUDE_ENGAGEMENT || 0 },
    { key: 'GENERAL', label: 'General', count: categoryCounts.GENERAL || 0 },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-300">
        All Classified Comments ({filtered.length})
      </h4>

      {/* Filter buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => {
          const isActive = filter === f.key;
          const catColor = f.key !== 'ALL' ? CATEGORY_COLORS[f.key as IntentCategory] : '';
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                isActive
                  ? 'bg-slate-700 border-slate-600 text-slate-100'
                  : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {f.key !== 'ALL' && (
                <span className={`inline-block w-2 h-2 rounded-sm mr-1.5 ${catColor}`} />
              )}
              {f.label} ({f.count})
            </button>
          );
        })}
      </div>

      {/* Scrollable comment list */}
      <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
        {filtered.map((c, i) => {
          const comment = comments[c.comment_index];
          if (!comment) return null;
          const cat = c.category as IntentCategory;
          const badgeColor = CATEGORY_COLORS[cat] || 'bg-slate-600';
          const label = CATEGORY_LABELS[cat] || c.category;

          // Split comma-separated locations
          const locations = c.location
            ? c.location.split(',').map((l) => l.trim()).filter(Boolean)
            : [];

          return (
            <div key={i} className="bg-slate-800/50 rounded-md p-3 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${badgeColor}`}>
                  {label}
                </span>
                <span className="text-xs text-slate-500">
                  Score: {c.intent_score}/10
                </span>
                {comment.likeCount > 0 && (
                  <span className="text-xs text-slate-500">
                    · {comment.likeCount} likes
                  </span>
                )}
                {locations.map((loc) => (
                  <span
                    key={loc}
                    className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400"
                  >
                    {loc}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                &ldquo;{comment.text}&rdquo;
              </p>
              <p className="text-xs text-slate-500">— {comment.authorName}</p>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 py-4 text-center">
            No comments in this category.
          </p>
        )}
      </div>
    </div>
  );
}
