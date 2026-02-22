import { IntentCategory, INTENT_WEIGHTS, FreshnessData } from './types';

export function computeConversionScore(
  categoryCounts: Record<IntentCategory, number>,
  viewCount: number
): { rawScore: number; densityScore: number } {
  const rawScore = Object.entries(categoryCounts).reduce(
    (sum, [cat, count]) => sum + count * (INTENT_WEIGHTS[cat as IntentCategory] || 0),
    0
  );

  const densityScore = viewCount > 0 ? rawScore / (viewCount / 1000) : 0;

  return { rawScore, densityScore };
}

export function computeFreshness(commentDates: string[]): FreshnessData {
  if (commentDates.length === 0) {
    return {
      lastCommentDate: null,
      commentsLast7Days: 0,
      commentsLast30Days: 0,
      badge: 'cold',
    };
  }

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const dates = commentDates
    .map((d) => new Date(d).getTime())
    .filter((t) => !isNaN(t))
    .sort((a, b) => b - a);

  if (dates.length === 0) {
    return {
      lastCommentDate: null,
      commentsLast7Days: 0,
      commentsLast30Days: 0,
      badge: 'cold',
    };
  }

  const commentsLast7Days = dates.filter((t) => t >= sevenDaysAgo).length;
  const commentsLast30Days = dates.filter((t) => t >= thirtyDaysAgo).length;

  let badge: FreshnessData['badge'] = 'cold';
  if (commentsLast7Days > 0) {
    badge = 'active';
  } else if (commentsLast30Days > 0) {
    badge = 'warm';
  }

  return {
    lastCommentDate: new Date(dates[0]).toISOString(),
    commentsLast7Days,
    commentsLast30Days,
    badge,
  };
}

export function computeAverageIntentScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function computeGeoMentions(
  locations: (string | null)[]
): { location: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const loc of locations) {
    if (loc) {
      const normalized = loc.trim();
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count);
}

export function getScoreLevel(rawScore: number): 'high' | 'moderate' | 'low' {
  if (rawScore >= 150) return 'high';
  if (rawScore >= 50) return 'moderate';
  return 'low';
}
