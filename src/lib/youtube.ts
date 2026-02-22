const YT_BASE = 'https://www.googleapis.com/youtube/v3';

let _quotaUsed = 0;

export function getQuotaUsed(): number {
  return _quotaUsed;
}

export function resetQuota(): void {
  _quotaUsed = 0;
}

function trackQuota(cost: number) {
  _quotaUsed += cost;
}

async function ytFetch(endpoint: string, params: Record<string, string>): Promise<Response> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error('YOUTUBE_API_KEY not configured');
  const url = new URL(`${YT_BASE}/${endpoint}`);
  url.searchParams.set('key', apiKey);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const errMsg = body?.error?.message || res.statusText;
    if (res.status === 403 && errMsg.toLowerCase().includes('quota')) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`YouTube API error (${res.status}): ${errMsg}`);
  }
  return res;
}

export interface ChannelResult {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  thumbnail: string;
  uploadsPlaylistId: string;
}

export async function resolveChannel(
  type: 'channelId' | 'handle' | 'username' | 'customName',
  value: string
): Promise<ChannelResult> {
  const params: Record<string, string> = {
    part: 'snippet,statistics,contentDetails',
  };

  if (type === 'channelId') {
    params.id = value;
  } else if (type === 'handle') {
    params.forHandle = value;
  } else if (type === 'username') {
    params.forUsername = value;
  } else if (type === 'customName') {
    // Try forHandle first
    params.forHandle = value;
  }

  const res = await ytFetch('channels', params);
  trackQuota(1);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    // If customName failed with forHandle, try forUsername
    if (type === 'customName') {
      const res2 = await ytFetch('channels', {
        part: 'snippet,statistics,contentDetails',
        forUsername: value,
      });
      trackQuota(1);
      const data2 = await res2.json();
      if (!data2.items || data2.items.length === 0) {
        throw new Error('CHANNEL_NOT_FOUND');
      }
      return extractChannel(data2.items[0]);
    }
    throw new Error('CHANNEL_NOT_FOUND');
  }

  return extractChannel(data.items[0]);
}

function extractChannel(item: Record<string, unknown>): ChannelResult {
  const snippet = item.snippet as Record<string, unknown>;
  const stats = item.statistics as Record<string, string>;
  const content = item.contentDetails as Record<string, unknown>;
  const related = content.relatedPlaylists as Record<string, string>;
  const thumbs = snippet.thumbnails as Record<string, { url: string }>;

  return {
    channelId: item.id as string,
    title: snippet.title as string,
    description: (snippet.description as string || '').slice(0, 200),
    subscriberCount: parseInt(stats.subscriberCount || '0', 10),
    videoCount: parseInt(stats.videoCount || '0', 10),
    thumbnail: thumbs?.medium?.url || thumbs?.default?.url || '',
    uploadsPlaylistId: related.uploads,
  };
}

export interface VideoItem {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
}

export async function fetchAllVideos(
  uploadsPlaylistId: string,
  maxVideos: number = 200
): Promise<VideoItem[]> {
  const videoIds: string[] = [];
  let pageToken: string | undefined;

  // Step 1: Get video IDs from playlist
  while (videoIds.length < maxVideos) {
    const params: Record<string, string> = {
      part: 'contentDetails',
      playlistId: uploadsPlaylistId,
      maxResults: '50',
    };
    if (pageToken) params.pageToken = pageToken;

    const res = await ytFetch('playlistItems', params);
    trackQuota(1);
    const data = await res.json();

    if (!data.items || data.items.length === 0) break;

    for (const item of data.items) {
      videoIds.push(item.contentDetails.videoId);
      if (videoIds.length >= maxVideos) break;
    }

    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  // Step 2: Batch fetch video details (50 at a time)
  const videos: VideoItem[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await ytFetch('videos', {
      part: 'snippet,statistics',
      id: batch.join(','),
    });
    trackQuota(1);
    const data = await res.json();

    for (const item of data.items || []) {
      const snippet = item.snippet;
      const stats = item.statistics || {};
      const thumbs = snippet.thumbnails || {};

      videos.push({
        videoId: item.id,
        title: snippet.title,
        thumbnail: thumbs.medium?.url || thumbs.default?.url || '',
        publishedAt: snippet.publishedAt,
        viewCount: parseInt(stats.viewCount || '0', 10),
        likeCount: parseInt(stats.likeCount || '0', 10),
        commentCount: parseInt(stats.commentCount || '0', 10),
        channelTitle: snippet.channelTitle || '',
      });
    }
  }

  // Sort by view count descending
  videos.sort((a, b) => b.viewCount - a.viewCount);

  return videos;
}

export async function fetchSingleVideo(videoId: string): Promise<VideoItem> {
  const res = await ytFetch('videos', {
    part: 'snippet,statistics',
    id: videoId,
  });
  trackQuota(1);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('VIDEO_NOT_FOUND');
  }

  const item = data.items[0];
  const snippet = item.snippet;
  const stats = item.statistics || {};
  const thumbs = snippet.thumbnails || {};

  return {
    videoId: item.id,
    title: snippet.title,
    thumbnail: thumbs.medium?.url || thumbs.default?.url || '',
    publishedAt: snippet.publishedAt,
    viewCount: parseInt(stats.viewCount || '0', 10),
    likeCount: parseInt(stats.likeCount || '0', 10),
    commentCount: parseInt(stats.commentCount || '0', 10),
    channelTitle: snippet.channelTitle || '',
  };
}

export interface CommentItem {
  commentId: string;
  text: string;
  authorName: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
}

export async function fetchComments(
  videoId: string,
  order: 'relevance' | 'time' = 'relevance',
  maxResults: number = 50
): Promise<CommentItem[]> {
  const comments: CommentItem[] = [];

  try {
    const params: Record<string, string> = {
      part: 'snippet',
      videoId,
      order,
      maxResults: String(Math.min(maxResults, 100)),
      textFormat: 'plainText',
    };

    const res = await ytFetch('commentThreads', params);
    trackQuota(1);
    const data = await res.json();

    for (const item of data.items || []) {
      const snippet = item.snippet.topLevelComment.snippet;
      comments.push({
        commentId: item.id,
        text: snippet.textOriginal || snippet.textDisplay || '',
        authorName: snippet.authorDisplayName || '',
        likeCount: snippet.likeCount || 0,
        publishedAt: snippet.publishedAt || '',
        updatedAt: snippet.updatedAt || '',
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // Comments might be disabled
    if (
      msg.includes('commentsDisabled') ||
      msg.includes('disabled comments') ||
      msg.includes('has disabled comments') ||
      msg.includes('commentDisabled') ||
      (msg.includes('403') && msg.includes('comment'))
    ) {
      throw new Error('COMMENTS_DISABLED');
    }
    throw err;
  }

  return comments;
}
