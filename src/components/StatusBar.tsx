'use client';

interface StatusBarProps {
  youtubeQuotaUsed: number;
  openRouterRemaining: number | null;
}

export default function StatusBar({ youtubeQuotaUsed, openRouterRemaining }: StatusBarProps) {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-500">
      <span>
        YT Quota:{' '}
        <span className={youtubeQuotaUsed > 8000 ? 'text-rose-400' : youtubeQuotaUsed > 5000 ? 'text-amber-400' : 'text-slate-400'}>
          {youtubeQuotaUsed.toLocaleString()}
        </span>
        {' '}/ 10,000
      </span>
      {openRouterRemaining !== null && (
        <>
          <span className="text-slate-700">|</span>
          <span>
            OpenRouter:{' '}
            <span className={openRouterRemaining < 1 ? 'text-rose-400' : 'text-slate-400'}>
              ${openRouterRemaining.toFixed(2)}
            </span>
            {' '}remaining
          </span>
        </>
      )}
    </div>
  );
}
