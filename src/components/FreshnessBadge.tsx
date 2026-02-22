'use client';

import { FreshnessData } from '@/lib/types';

interface FreshnessBadgeProps {
  freshness: FreshnessData;
}

export default function FreshnessBadge({ freshness }: FreshnessBadgeProps) {
  const badgeConfig = {
    active: {
      label: 'Active',
      emoji: '\uD83D\uDD25',
      className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    warm: {
      label: 'Warm',
      emoji: '',
      className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    cold: {
      label: 'Cold',
      emoji: '',
      className: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    },
  };

  const config = badgeConfig[freshness.badge];

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
      {config.emoji ? `${config.emoji} ` : ''}{config.label}
    </span>
  );
}
