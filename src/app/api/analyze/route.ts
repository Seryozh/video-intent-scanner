import { NextRequest, NextResponse } from 'next/server';
import { classifyComments } from '@/lib/ai';
import { computeConversionScore, computeFreshness, computeAverageIntentScore, computeGeoMentions } from '@/lib/scoring';
import { IntentCategory } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { comments, viewCount } = await req.json();

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return NextResponse.json({ error: 'No comments to analyze' }, { status: 400 });
    }

    // Prepare comments for classification
    const indexedComments = comments.map((c: { text: string }, i: number) => ({
      index: i,
      text: c.text,
    }));

    // Classify with AI
    const classifications = await classifyComments(indexedComments);

    // Compute category counts
    const categoryCounts: Record<IntentCategory, number> = {
      BOOKING_INTENT: 0,
      FRUSTRATION_WITH_SYSTEM: 0,
      MEDICAL_HELP_SEEKING: 0,
      GEOGRAPHIC_MENTION: 0,
      GRATITUDE_ENGAGEMENT: 0,
      GENERAL: 0,
    };

    const validCategories = new Set(Object.keys(categoryCounts));

    for (const c of classifications) {
      const cat = c.category as IntentCategory;
      if (validCategories.has(cat)) {
        categoryCounts[cat]++;
      } else {
        categoryCounts.GENERAL++;
      }
    }

    // Compute scores
    const { rawScore, densityScore } = computeConversionScore(categoryCounts, viewCount || 1);
    const averageIntentScore = computeAverageIntentScore(
      classifications.map((c) => c.intent_score)
    );

    // Compute geo mentions
    const geoMentions = computeGeoMentions(classifications.map((c) => c.location));

    // Compute freshness from comment timestamps
    const commentDates = comments.map((c: { publishedAt: string }) => c.publishedAt);
    const freshness = computeFreshness(commentDates);

    return NextResponse.json({
      classifications,
      categoryCounts,
      rawScore,
      densityScore,
      averageIntentScore,
      geoMentions,
      freshness,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `AI analysis failed: ${msg}` }, { status: 500 });
  }
}
