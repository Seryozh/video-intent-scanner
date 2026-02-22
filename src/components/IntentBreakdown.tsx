'use client';

import { IntentCategory, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';

interface IntentBreakdownProps {
  categoryCounts: Record<IntentCategory, number>;
  totalComments: number;
}

const BAR_COLORS: Record<IntentCategory, string> = {
  BOOKING_INTENT: '#10b981',
  FRUSTRATION_WITH_SYSTEM: '#f59e0b',
  MEDICAL_HELP_SEEKING: '#0ea5e9',
  GEOGRAPHIC_MENTION: '#8b5cf6',
  GRATITUDE_ENGAGEMENT: '#64748b',
  GENERAL: '#475569',
};

export default function IntentBreakdown({ categoryCounts, totalComments }: IntentBreakdownProps) {
  const categories = Object.entries(categoryCounts) as [IntentCategory, number][];
  const nonZero = categories.filter(([, count]) => count > 0);

  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="h-6 rounded-full overflow-hidden flex bg-slate-800">
        {nonZero.map(([cat, count]) => {
          const pct = totalComments > 0 ? (count / totalComments) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={cat}
              style={{ width: `${pct}%`, backgroundColor: BAR_COLORS[cat] }}
              className="h-full transition-all duration-300 flex items-center justify-center overflow-hidden"
              title={`${CATEGORY_LABELS[cat]}: ${count} (${pct.toFixed(0)}%)`}
            >
              {pct > 8 && (
                <span className="text-[10px] font-bold text-white/90 drop-shadow-sm">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
        {categories.map(([cat, count]) => {
          const pct = totalComments > 0 ? ((count / totalComments) * 100).toFixed(0) : '0';
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${CATEGORY_COLORS[cat]}`} />
              <span className="text-slate-400">
                {CATEGORY_LABELS[cat]}
              </span>
              <span className="text-slate-500 ml-auto">
                {count} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
