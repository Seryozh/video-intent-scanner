import { NextRequest, NextResponse } from 'next/server';
import { fetchComments, getQuotaUsed } from '@/lib/youtube';

export async function POST(req: NextRequest) {
  try {
    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: 'videoId required' }, { status: 400 });
    }

    // Fetch two batches: relevance + time
    const [relevanceComments, timeComments] = await Promise.all([
      fetchComments(videoId, 'relevance', 50),
      fetchComments(videoId, 'time', 50),
    ]);

    // Deduplicate by comment ID
    const seen = new Set<string>();
    const allComments = [];

    for (const c of [...relevanceComments, ...timeComments]) {
      if (!seen.has(c.commentId)) {
        seen.add(c.commentId);
        allComments.push(c);
      }
    }

    return NextResponse.json({
      comments: allComments,
      relevanceCount: relevanceComments.length,
      timeCount: timeComments.length,
      quotaUsed: getQuotaUsed(),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'COMMENTS_DISABLED') {
      return NextResponse.json(
        { error: 'Comments are disabled on this video.' },
        { status: 403 }
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
