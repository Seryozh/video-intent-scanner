'use client';

interface ConversionScoreProps {
  rawScore: number;
  densityScore: number;
}

export default function ConversionScore({ rawScore, densityScore }: ConversionScoreProps) {
  const level = rawScore >= 150 ? 'high' : rawScore >= 50 ? 'moderate' : 'low';

  const colorMap = {
    high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  const labelMap = {
    high: 'HIGH INTENT',
    moderate: 'MODERATE',
    low: 'LOW',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`px-3 py-1.5 rounded-md border text-sm font-bold ${colorMap[level]}`}>
        {rawScore} · {labelMap[level]}
      </div>
      <div className="text-xs text-slate-400 flex items-center gap-1">
        <span>{densityScore.toFixed(1)} per 1K views</span>
        <span className="relative group">
          <svg className="w-3.5 h-3.5 text-slate-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M12 16v-4m0-4h.01" />
          </svg>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 w-56 hidden group-hover:block z-50 shadow-lg">
            Conversion signals per 1,000 video views. Higher means the audience is more concentrated with potential patients.
          </span>
        </span>
      </div>
    </div>
  );
}
