export type ParsedInput =
  | { type: 'channelId'; value: string }
  | { type: 'handle'; value: string }
  | { type: 'username'; value: string }
  | { type: 'customName'; value: string }
  | { type: 'videoId'; value: string }
  | { type: 'unknown'; value: string };

export function parseYouTubeInput(input: string): ParsedInput {
  const trimmed = input.trim();

  // Direct video ID check (11 chars, alphanumeric + _ -)
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    // Ambiguous: could be a video ID or a handle. Treat as video ID.
    return { type: 'videoId', value: trimmed };
  }

  // Handle format: @handle
  if (/^@[\w.-]+$/.test(trimmed)) {
    return { type: 'handle', value: trimmed.slice(1) };
  }

  // Try to parse as URL
  let url: URL | null = null;
  try {
    // Add protocol if missing
    let urlStr = trimmed;
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr;
    }
    url = new URL(urlStr);
  } catch {
    // Not a valid URL. Try treating as a handle/channel name
    if (/^[\w.-]+$/.test(trimmed)) {
      return { type: 'handle', value: trimmed };
    }
    return { type: 'unknown', value: trimmed };
  }

  const hostname = url.hostname.replace('www.', '').replace('m.', '');
  const pathname = url.pathname;

  // YouTube short URL: youtu.be/VIDEO_ID
  if (hostname === 'youtu.be') {
    const videoId = pathname.slice(1).split(/[?&/]/)[0];
    if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) {
      return { type: 'videoId', value: videoId };
    }
  }

  // YouTube domains
  if (
    hostname === 'youtube.com' ||
    hostname === 'music.youtube.com' ||
    hostname === 'youtube-nocookie.com'
  ) {
    // Video URL: /watch?v=VIDEO_ID
    if (pathname === '/watch') {
      const videoId = url.searchParams.get('v');
      if (videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)) {
        return { type: 'videoId', value: videoId };
      }
    }

    // Embed: /embed/VIDEO_ID
    const embedMatch = pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})/);
    if (embedMatch) {
      return { type: 'videoId', value: embedMatch[1] };
    }

    // Shorts: /shorts/VIDEO_ID
    const shortsMatch = pathname.match(/^\/shorts\/([A-Za-z0-9_-]{11})/);
    if (shortsMatch) {
      return { type: 'videoId', value: shortsMatch[1] };
    }

    // Live: /live/VIDEO_ID
    const liveMatch = pathname.match(/^\/live\/([A-Za-z0-9_-]{11})/);
    if (liveMatch) {
      return { type: 'videoId', value: liveMatch[1] };
    }

    // Channel ID: /channel/UCxxxx
    const channelMatch = pathname.match(/^\/channel\/(UC[\w-]+)/);
    if (channelMatch) {
      return { type: 'channelId', value: channelMatch[1] };
    }

    // Handle: /@handle
    const handleMatch = pathname.match(/^\/@([\w.-]+)/);
    if (handleMatch) {
      return { type: 'handle', value: handleMatch[1] };
    }

    // Custom URL: /c/CustomName
    const customMatch = pathname.match(/^\/c\/([\w.-]+)/);
    if (customMatch) {
      return { type: 'customName', value: customMatch[1] };
    }

    // User URL: /user/Username
    const userMatch = pathname.match(/^\/user\/([\w.-]+)/);
    if (userMatch) {
      return { type: 'username', value: userMatch[1] };
    }

    // Vanity URL: /SomeName (no prefix, single path segment)
    const vanityMatch = pathname.match(/^\/([\w.-]+)$/);
    if (vanityMatch && !['feed', 'results', 'playlist', 'gaming', 'premium'].includes(vanityMatch[1])) {
      return { type: 'handle', value: vanityMatch[1] };
    }
  }

  return { type: 'unknown', value: trimmed };
}

export function isVideoInput(parsed: ParsedInput): parsed is { type: 'videoId'; value: string } {
  return parsed.type === 'videoId';
}

export function isChannelInput(parsed: ParsedInput): boolean {
  return ['channelId', 'handle', 'username', 'customName'].includes(parsed.type);
}
