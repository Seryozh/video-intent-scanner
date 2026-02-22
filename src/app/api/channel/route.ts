import { NextRequest, NextResponse } from 'next/server';
import { resolveChannel, getQuotaUsed } from '@/lib/youtube';
import { parseYouTubeInput } from '@/lib/url-parser';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const parsed = parseYouTubeInput(input.trim());

    if (parsed.type === 'videoId') {
      return NextResponse.json({ error: 'This is a video URL, not a channel URL' }, { status: 400 });
    }

    if (parsed.type === 'unknown') {
      return NextResponse.json(
        { error: "Couldn't recognize this URL. Try a YouTube channel or video link." },
        { status: 400 }
      );
    }

    const resolveType = parsed.type as 'channelId' | 'handle' | 'username' | 'customName';
    const channel = await resolveChannel(resolveType, parsed.value);

    return NextResponse.json({
      channel,
      quotaUsed: getQuotaUsed(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'CHANNEL_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Channel not found. Check the URL and try again.' },
        { status: 404 }
      );
    }
    if (msg === 'QUOTA_EXCEEDED') {
      return NextResponse.json(
        { error: 'YouTube API quota reached. Quota resets at midnight Pacific time.' },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
