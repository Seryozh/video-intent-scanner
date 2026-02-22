const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const MODEL = 'google/gemini-3-flash-preview';

async function callOpenRouter(
  messages: { role: string; content: string }[],
  useJsonMode: boolean = false,
  temperature: number = 0.1
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
    temperature,
  };

  if (useJsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Video Intent Scanner',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error('RATE_LIMITED');
    }
    const errBody = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function extractJson(text: string): string {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  // Find first [ to last ]
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return cleaned.slice(firstBracket, lastBracket + 1);
  }
  return cleaned;
}

export interface ClassificationResult {
  comment_index: number;
  category: string;
  intent_score: number;
  location: string | null;
  key_phrase: string;
}

export async function classifyComments(
  comments: { index: number; text: string }[]
): Promise<ClassificationResult[]> {
  const numberedComments = comments
    .map((c) => `[${c.index}] "${c.text}"`)
    .join('\n');

  const systemPrompt = `You are an expert analyst identifying patient conversion potential in YouTube comments on medical doctors' videos. You work for FutureClinic, a platform where patients subscribe to doctors for $20-40/month for ongoing chat-based care.

Your job: classify each comment by how likely that commenter would pay for direct access to this doctor. Be strict and precise. Marketing decisions depend on your accuracy.`;

  const userMessage = `Classify each comment below into exactly one category. Here are the categories with precise definitions and examples:

## CATEGORIES

### 1. BOOKING_INTENT
The commenter explicitly wants to become this doctor's patient or is trying to access their care.
- "Do you take new patients?"
- "I wish you were my dermatologist"
- "Can I book a consultation with you?"
- "Where is your practice? I want to come see you"
- "How do I get an appointment with you?"
NOT booking intent: "Great doctor!" (that's gratitude), "I need a dermatologist" (that's help-seeking, not specifically wanting THIS doctor)

### 2. MEDICAL_HELP_SEEKING
The commenter describes personal symptoms, shares their medical situation, or asks for personal medical advice. They need a doctor but aren't explicitly asking to see THIS doctor.
- "I've had this rash on my arm for 3 months and nothing works"
- "Is it normal for minoxidil to cause shedding in the first month?"
- "I was diagnosed with PCOS and my doctor just put me on birth control, is that really the best option?"
- "My 2 year old has a fever of 102 and spots on her tongue, should I go to the ER?"

### 3. FRUSTRATION_WITH_SYSTEM
The commenter expresses frustration with their current healthcare — long waits, dismissive doctors, insurance issues, access problems.
- "My dermatologist spent 2 minutes with me and charged $300"
- "I've been waiting 4 months for a dermatology appointment"
- "My doctor didn't even look at my skin, just prescribed something random"
- "I can't afford a specialist visit without insurance"

### 4. GEOGRAPHIC_MENTION
The commenter mentions a specific location in the context of wanting care or asking about availability. Extract the location.
- "I'm in Florida, do you know anyone good here?"
- "Do you see patients in the UK?"
Note: If someone mentions a location AND another category applies, choose the OTHER category and still extract the location.

### 5. GRATITUDE_ENGAGEMENT
Positive engagement — thanking the doctor, sharing success stories, general praise.
- "Your retinol video changed my skin, thank you!"
- "Best dermatologist on YouTube"

### 6. GENERAL
Everything else — product questions, off-topic, spam, jokes, debates.

## INTENT SCORING (1-10)

- **10**: Explicitly trying to book AND mentions urgent/ongoing condition
- **9**: Explicitly asking to see this doctor
- **8**: Serious condition AND frustrated with current care
- **7**: Personal condition with clear emotional weight
- **6**: Asking for personal medical advice with detail
- **5**: Describing symptoms casually
- **4**: General medical question without personal context
- **3**: System frustration, no personal condition
- **2**: Positive engagement, trust-building
- **1**: Off-topic, spam, product questions

## LOCATION EXTRACTION

If a comment mentions ANY geographic location, extract it into the location field regardless of category. If none, set location to null.

## OUTPUT FORMAT

Return ONLY a valid JSON array. No markdown backticks, no explanation, no preamble. Start with [ and end with ].

Each element:
[
  {
    "comment_index": 0,
    "category": "BOOKING_INTENT",
    "intent_score": 9,
    "location": null,
    "key_phrase": "How can I book a consultation"
  }
]

The comment_index corresponds to the position in the array I'm sending you (0-indexed).

## COMMENTS TO ANALYZE

${numberedComments}`;

  let response: string;
  try {
    response = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      true,
      0.1
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'RATE_LIMITED') {
      // Retry once after 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
      response = await callOpenRouter(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        true,
        0.1
      );
    } else {
      throw err;
    }
  }

  // Parse JSON
  let parsed: ClassificationResult[];
  try {
    const jsonStr = extractJson(response);
    parsed = JSON.parse(jsonStr);
  } catch {
    // Retry once
    const retryResponse = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      true,
      0.1
    );
    const jsonStr = extractJson(retryResponse);
    parsed = JSON.parse(jsonStr);
  }

  return parsed;
}

export async function generatePinnedComment(params: {
  channelName: string;
  videoTitle: string;
  topComments: string;
  dominantCategory: string;
  helpSeekingCount: number;
  bookingIntentCount: number;
}): Promise<string> {
  const systemPrompt = `You are a medical doctor writing a pinned comment on your own YouTube video. You are genuine, clinically credible, and care about your audience. You are not a marketer.`;

  const userMessage = `Write a pinned comment for me to post on my YouTube video. Here is the context:

My channel name: ${params.channelName}
Video title: ${params.videoTitle}

The top concerns my audience is expressing in the comments on this video:
${params.topComments}

The most common category of intent: ${params.dominantCategory}
Number of people asking for personal help: ${params.helpSeekingCount}
Number of people trying to book with me: ${params.bookingIntentCount}

Write a pinned comment that:
1. References the specific concern that keeps appearing (use the actual medical topic, not vague language)
2. Acknowledges the concern with genuine clinical credibility
3. Naturally transitions to: I now offer personal consultations through FutureClinic where I can review your specific case
4. Does NOT sound like an advertisement — it should sound like me responding to my community
5. Is 3-4 sentences maximum
6. Ends with a soft CTA like "Link in my bio" or "Link below if you'd like to connect"
7. Does NOT use exclamation marks excessively, hashtags, or emoji. It should read like a doctor, not an influencer.

Write ONE comment only. No preamble, no options, no explanation. Just the comment text.`;

  let response: string;
  try {
    response = await callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      false,
      0.7
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'RATE_LIMITED') {
      await new Promise((r) => setTimeout(r, 2000));
      response = await callOpenRouter(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        false,
        0.7
      );
    } else {
      throw err;
    }
  }

  return response.trim();
}

export async function getOpenRouterBalance(): Promise<{
  totalCredits: number;
  totalUsage: number;
  remaining: number;
}> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return { totalCredits: 0, totalUsage: 0, remaining: 0 };

  try {
    const res = await fetch(`${OPENROUTER_BASE}/credits`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!res.ok) return { totalCredits: 0, totalUsage: 0, remaining: 0 };
    const data = await res.json();
    const total = data.data?.total_credits || 0;
    const usage = data.data?.total_usage || 0;
    return {
      totalCredits: total,
      totalUsage: usage,
      remaining: Math.max(0, total - usage),
    };
  } catch {
    return { totalCredits: 0, totalUsage: 0, remaining: 0 };
  }
}
