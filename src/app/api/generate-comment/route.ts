import { NextRequest, NextResponse } from 'next/server';
import { generatePinnedComment } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { channelName, videoTitle, topComments, dominantCategory, helpSeekingCount, bookingIntentCount } = body;

    if (!videoTitle) {
      return NextResponse.json({ error: 'videoTitle required' }, { status: 400 });
    }

    const comment = await generatePinnedComment({
      channelName: channelName || 'Unknown',
      videoTitle,
      topComments: topComments || '',
      dominantCategory: dominantCategory || 'GENERAL',
      helpSeekingCount: helpSeekingCount || 0,
      bookingIntentCount: bookingIntentCount || 0,
    });

    return NextResponse.json({ comment });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Comment generation failed: ${msg}` }, { status: 500 });
  }
}
