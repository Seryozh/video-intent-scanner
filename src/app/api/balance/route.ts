import { NextResponse } from 'next/server';
import { getQuotaUsed } from '@/lib/youtube';
import { getOpenRouterBalance } from '@/lib/ai';

export async function GET() {
  try {
    const orBalance = await getOpenRouterBalance();
    return NextResponse.json({
      youtubeQuotaUsed: getQuotaUsed(),
      openRouter: orBalance,
    });
  } catch {
    return NextResponse.json({
      youtubeQuotaUsed: getQuotaUsed(),
      openRouter: { totalCredits: 0, totalUsage: 0, remaining: 0 },
    });
  }
}
