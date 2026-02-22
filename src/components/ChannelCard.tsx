'use client';

interface ChannelCardProps {
  channel: {
    title: string;
    thumbnail: string;
    subscriberCount: number;
    videoCount: number;
    description: string;
  };
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center gap-4 max-w-3xl mx-auto">
      <img
        src={channel.thumbnail}
        alt={channel.title}
        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold text-slate-100 truncate">{channel.title}</h2>
        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
          <span>{formatNumber(channel.subscriberCount)} subscribers</span>
          <span className="text-slate-600">·</span>
          <span>{formatNumber(channel.videoCount)} videos</span>
        </div>
      </div>
    </div>
  );
}
