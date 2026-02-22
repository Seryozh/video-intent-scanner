'use client';

export function SkeletonChannelCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4 max-w-3xl mx-auto animate-pulse">
      <div className="w-16 h-16 rounded-full bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-slate-800 rounded w-48" />
        <div className="h-4 bg-slate-800 rounded w-32" />
      </div>
    </div>
  );
}

export function SkeletonVideoList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-4 animate-pulse"
        >
          <div className="w-[120px] h-[68px] rounded bg-slate-800 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
          <div className="w-20 h-8 bg-slate-800 rounded" />
        </div>
      ))}
    </div>
  );
}
