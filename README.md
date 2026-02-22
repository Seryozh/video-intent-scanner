# Video Intent Scanner

A YouTube comment analysis tool that identifies which videos have the highest patient conversion potential for medical practices.

Built for [FutureClinic](https://futureclinic.com) to help doctors convert their YouTube audiences into patients.

## How it works

1. **Scan** a YouTube channel or paste a single video URL
2. **Fetch** up to 100 comments per video (50 by relevance, 50 by recency)
3. **Classify** every comment into 6 intent categories using AI (Gemini 3 Flash)
4. **Score** each video with a weighted conversion score and intent density metric
5. **Generate** a targeted pinned comment draft that addresses the specific conditions viewers are describing

## Intent Categories

| Category | Weight | Description |
|----------|--------|-------------|
| Booking Intent | x10 | Actively trying to book or contact the doctor |
| System Frustration | x7 | Unhappy with current care, looking for alternatives |
| Help Seeking | x5 | Describing a real condition, asking for medical advice |
| Geographic Mention | x3 | Mentions a location (recruitment signal) |
| Gratitude | x1 | Trusts the doctor but not yet converting |
| General | x0 | Noise, unrelated to conversion |

## Key Metrics

- **Raw Score**: Sum of (category weight x count) across all categories
- **Intent Density**: Raw score / (views in thousands). Normalizes for video size. A mid-size condition video often has 10-25x more density than a viral video
- **Freshness Badge**: Active (comments in last 7 days), Warm (last 30 days), Cold (30+ days)

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript, Tailwind CSS
- YouTube Data API v3
- OpenRouter API (Gemini 3 Flash)
- Deployed on Vercel

## Setup

```bash
npm install
```

Create `.env.local`:

```
YOUTUBE_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
```

```bash
npm run dev
```

## Routes

| Route | Description |
|-------|-------------|
| `/demo` | Guided tutorial walkthrough with pre-baked data (no API calls) |
| `/` | Live tool (password-protected to prevent API credit burn) |

## Project Structure

```
src/
  app/
    page.tsx          # Main tool (password-gated)
    demo/page.tsx     # Interactive tutorial demo
    api/
      channel/        # YouTube channel resolution
      videos/         # Video fetching + sorting
      comments/       # Comment fetching (relevance + time)
      analyze/        # AI classification + scoring
      generate-comment/ # Pinned comment generation
      balance/        # API quota tracking
  components/
    VideoCard.tsx     # Video display + analysis results
    IntentBreakdown.tsx # Stacked bar chart of categories
    HighIntentComments.tsx # Filterable classified comment list
    ConversionScore.tsx # Score badge
    FreshnessBadge.tsx  # Activity indicator
    GeoMentions.tsx   # Geographic location tags
    PinnedCommentDraft.tsx # AI-generated pinned comment
    PasswordGate.tsx  # Client-side access gate
  lib/
    youtube.ts        # YouTube API wrapper
    ai.ts             # OpenRouter/Gemini integration
    scoring.ts        # Score computation
    types.ts          # TypeScript interfaces
    url-parser.ts     # YouTube URL parsing
    demo-data.ts      # Pre-baked data for tutorial
```
