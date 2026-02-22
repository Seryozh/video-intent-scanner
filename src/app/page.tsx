'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import ChannelInput from '@/components/ChannelInput';
import ChannelCard from '@/components/ChannelCard';
import VideoList from '@/components/VideoList';
import VideoCard, { AnalysisProgress } from '@/components/VideoCard';
import StatusBar from '@/components/StatusBar';
import EmptyState from '@/components/EmptyState';
import PasswordGate from '@/components/PasswordGate';
import { SkeletonChannelCard, SkeletonVideoList } from '@/components/SkeletonCard';
import { parseYouTubeInput, isVideoInput } from '@/lib/url-parser';
import { IntentCategory, FreshnessData } from '@/lib/types';

interface ChannelData {
  channelId: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  thumbnail: string;
  uploadsPlaylistId: string;
}

interface VideoData {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
}

interface AnalysisData {
  classifications: {
    comment_index: number;
    category: string;
    intent_score: number;
    location: string | null;
    key_phrase: string;
  }[];
  categoryCounts: Record<IntentCategory, number>;
  rawScore: number;
  densityScore: number;
  averageIntentScore: number;
  geoMentions: { location: string; count: number }[];
  freshness: FreshnessData;
  comments: { text: string; authorName: string; likeCount: number; publishedAt: string }[];
  debugInfo?: {
    relevanceCount: number;
    timeCount: number;
    uniqueCount: number;
    analysisTimeMs: number;
    totalCharacters: number;
  };
}

// Split comma-separated geo mentions into individual entries
function splitGeoMentions(
  geoMentions: { location: string; count: number }[]
): { location: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const m of geoMentions) {
    const parts = m.location.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      counts[part] = (counts[part] || 0) + m.count;
    }
  }
  return Object.entries(counts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export default function Home() {
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [singleVideo, setSingleVideo] = useState<VideoData | null>(null);
  const [mode, setMode] = useState<'idle' | 'channel' | 'video'>('idle');

  const [isLoadingChannel, setIsLoadingChannel] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analyses, setAnalyses] = useState<Record<string, AnalysisData>>({});
  const [progressMap, setProgressMap] = useState<Record<string, AnalysisProgress>>({});
  const [analysisErrors, setAnalysisErrors] = useState<Record<string, string>>({});

  const [quotaUsed, setQuotaUsed] = useState(0);
  const [orRemaining, setOrRemaining] = useState<number | null>(null);

  const autoAnalyzeRef = useRef<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/balance');
      const data = await res.json();
      setQuotaUsed(data.youtubeQuotaUsed || 0);
      if (data.openRouter?.remaining !== undefined) {
        setOrRemaining(data.openRouter.remaining);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const setProgress = useCallback((videoId: string, p: AnalysisProgress | null) => {
    setProgressMap((prev) => {
      if (p === null) {
        const next = { ...prev };
        delete next[videoId];
        return next;
      }
      return { ...prev, [videoId]: p };
    });
  }, []);

  const handleAnalyze = useCallback(async (videoId: string) => {
    if (analyses[videoId]) return;

    setAnalysisErrors((prev) => {
      const next = { ...prev };
      delete next[videoId];
      return next;
    });

    // Step 1: Fetching comments
    setProgress(videoId, { step: 'fetching' });

    try {
      const commentsRes = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });
      const commentsData = await commentsRes.json();

      if (!commentsRes.ok) {
        throw new Error(commentsData.error || 'Failed to fetch comments');
      }

      if (commentsData.quotaUsed) setQuotaUsed(commentsData.quotaUsed);

      const comments = commentsData.comments;
      if (!comments || comments.length === 0) {
        throw new Error('No comments found on this video');
      }

      const relevanceCount = commentsData.relevanceCount || Math.ceil(comments.length / 2);
      const timeCount = commentsData.timeCount || Math.floor(comments.length / 2);

      // Step 2: Show fetched state with raw comments, then start analyzing
      setProgress(videoId, {
        step: 'analyzing',
        commentsFetched: comments.length,
        relevanceCount,
        timeCount,
        rawComments: comments,
      });

      const video = videos.find((v) => v.videoId === videoId) || singleVideo;
      const viewCount = video?.viewCount || 1;

      const analysisStart = Date.now();

      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments, viewCount }),
      });
      const analyzeData = await analyzeRes.json();

      const analysisTimeMs = Date.now() - analysisStart;

      if (!analyzeRes.ok) {
        throw new Error(analyzeData.error || 'Analysis failed');
      }

      // Fix geographic mentions: split comma-separated
      const fixedGeoMentions = splitGeoMentions(analyzeData.geoMentions || []);

      // Also fix locations in classifications
      const fixedClassifications = (analyzeData.classifications || []).map(
        (c: { location: string | null; [key: string]: unknown }) => ({
          ...c,
          // Keep the raw location for display per-comment; splitting happens at geo aggregate level
        })
      );

      const totalCharacters = comments.reduce(
        (sum: number, c: { text: string }) => sum + c.text.length,
        0
      );

      setAnalyses((prev) => ({
        ...prev,
        [videoId]: {
          ...analyzeData,
          classifications: fixedClassifications,
          geoMentions: fixedGeoMentions,
          comments,
          debugInfo: {
            relevanceCount,
            timeCount,
            uniqueCount: comments.length,
            analysisTimeMs,
            totalCharacters,
          },
        },
      }));

      setProgress(videoId, { step: 'done' });
      fetchBalance();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setAnalysisErrors((prev) => ({ ...prev, [videoId]: msg }));
      setProgress(videoId, { step: 'error', errorMessage: msg });
    }
  }, [analyses, videos, singleVideo, fetchBalance, setProgress]);

  useEffect(() => {
    if (autoAnalyzeRef.current) {
      const videoId = autoAnalyzeRef.current;
      autoAnalyzeRef.current = null;
      handleAnalyze(videoId);
    }
  }, [singleVideo, handleAnalyze]);

  const handleSubmit = async (input: string) => {
    setError(null);

    const parsed = parseYouTubeInput(input);

    if (parsed.type === 'unknown') {
      setError("Couldn't recognize this URL. Try a YouTube channel or video link.");
      return;
    }

    if (isVideoInput(parsed)) {
      setMode('video');
      setChannel(null);
      setVideos([]);
      setSingleVideo(null);
      setIsLoadingChannel(true);

      try {
        const res = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId: parsed.value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        if (data.quotaUsed) setQuotaUsed(data.quotaUsed);

        const vid = data.videos[0];
        setSingleVideo(vid);
        autoAnalyzeRef.current = vid.videoId;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch video');
      } finally {
        setIsLoadingChannel(false);
      }
    } else {
      setMode('channel');
      setChannel(null);
      setVideos([]);
      setSingleVideo(null);
      setIsLoadingChannel(true);
      setIsLoadingVideos(false);

      try {
        const channelRes = await fetch('/api/channel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        });
        const channelData = await channelRes.json();
        if (!channelRes.ok) throw new Error(channelData.error);

        if (channelData.quotaUsed) setQuotaUsed(channelData.quotaUsed);
        setChannel(channelData.channel);
        setIsLoadingChannel(false);
        setIsLoadingVideos(true);

        const videosRes = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uploadsPlaylistId: channelData.channel.uploadsPlaylistId,
            maxVideos: 200,
          }),
        });
        const videosData = await videosRes.json();
        if (!videosRes.ok) throw new Error(videosData.error);

        if (videosData.quotaUsed) setQuotaUsed(videosData.quotaUsed);
        setVideos(videosData.videos);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoadingChannel(false);
        setIsLoadingVideos(false);
      }
    }
  };

  const isLoading = isLoadingChannel || isLoadingVideos;

  return (
    <PasswordGate>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">Video Intent Scanner</h1>
              <p className="text-xs text-slate-500">Find the videos where patients are already asking</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/demo"
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                See guided walkthrough
              </a>
              <StatusBar youtubeQuotaUsed={quotaUsed} openRouterRemaining={orRemaining} />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <ChannelInput onSubmit={handleSubmit} isLoading={isLoading} />

          {error && (
            <div className="max-w-3xl mx-auto text-sm text-rose-400 bg-rose-500/10 rounded-lg p-4 border border-rose-500/20">
              {error}
            </div>
          )}

          {isLoadingChannel && mode === 'channel' && <SkeletonChannelCard />}
          {channel && <ChannelCard channel={channel} />}
          {isLoadingVideos && <SkeletonVideoList />}

          {mode === 'channel' && videos.length > 0 && (
            <VideoList
              videos={videos}
              channelName={channel?.title}
              analyses={analyses}
              progressMap={progressMap}
              analysisErrors={analysisErrors}
              onAnalyze={handleAnalyze}
            />
          )}

          {mode === 'video' && singleVideo && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400">Single Video Analysis</h3>
              <VideoCard
                video={singleVideo}
                analysis={analyses[singleVideo.videoId] || null}
                progress={progressMap[singleVideo.videoId] || null}
                analysisError={analysisErrors[singleVideo.videoId] || null}
                onAnalyze={handleAnalyze}
                autoExpand
              />
            </div>
          )}

          {mode === 'video' && isLoadingChannel && (
            <div className="space-y-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-4 animate-pulse">
                <div className="w-[120px] h-[68px] rounded bg-slate-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
            </div>
          )}

          {mode === 'idle' && !isLoading && !error && <EmptyState />}
        </main>

        <footer className="border-t border-slate-800 mt-12">
          <div className="max-w-6xl mx-auto px-6 py-4 text-center text-xs text-slate-600">
            Video Intent Scanner &middot; Built for FutureClinic Growth
          </div>
        </footer>
      </div>
    </PasswordGate>
  );
}
