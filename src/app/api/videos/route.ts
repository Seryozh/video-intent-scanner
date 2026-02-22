import { NextRequest, NextResponse } from 'next/server';
import { fetchAllVideos, fetchSingleVideo, getQuotaUsed } from '@/lib/youtube';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Single video mode
    if (body.videoId) {
      const video = await fetchSingleVideo(body.videoId);
      return NextResponse.json({
        videos: [video],
        quotaUsed: getQuotaUsed(),
      });
    }

    // Channel mode - fetch all videos from uploads playlist
    if (body.uploadsPlaylistId) {
      const videos = await fetchAllVideos(body.uploadsPlaylistId, body.maxVideos || 200);
      return NextResponse.json({
        videos,
        quotaUsed: getQuotaUsed(),
      });
    }

    return NextResponse.json({ error: 'Provide videoId or uploadsPlaylistId' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'VIDEO_NOT_FOUND') {
      return NextResponse.json({ error: 'Video not found.' }, { status: 404 });
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
