'use client';

interface GeoMentionsProps {
  mentions: { location: string; count: number }[];
}

export default function GeoMentions({ mentions }: GeoMentionsProps) {
  if (mentions.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-slate-300">Geographic Mentions</h4>
      <div className="flex flex-wrap gap-2">
        {mentions.map((m) => (
          <span
            key={m.location}
            className="px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 text-xs border border-violet-500/20"
          >
            {m.location} ({m.count})
          </span>
        ))}
      </div>
    </div>
  );
}
