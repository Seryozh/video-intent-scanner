# Video Intent Scanner — Research Findings

## YouTube Data API v3

### 1. Channel Resolution

**Endpoint**: `GET https://www.googleapis.com/youtube/v3/channels`

Filter parameters (exactly one required):
| Parameter | Description |
|-----------|-------------|
| `id` | Channel ID(s), comma-separated |
| `forHandle` | YouTube handle (without `@`) |
| `forUsername` | Legacy username |
| `mine` | Authenticated user's channel (OAuth) |

**Resolution strategy by URL format:**
| URL Format | Strategy |
|------------|----------|
| `/channel/UCxxxx` | Extract channelId directly (0 API calls) |
| `/@handle` | `channels.list?forHandle=handle` (1 unit) |
| `/user/Username` | `channels.list?forUsername=Username` (1 unit) |
| `/c/CustomName` | Try `forHandle`, then `forUsername` (1-2 units) |

### 2. Uploads Playlist Trick (UC → UU)

Every YouTube channel has an auto-generated "uploads" playlist. The playlist ID = channelId with `UC` replaced by `UU`.

**Confirmed reliable.** Also available via `channels.list?part=contentDetails` → `contentDetails.relatedPlaylists.uploads`.

### 3. Quota Costs

**Daily quota: 10,000 units** per project.

| Endpoint | Cost | maxResults |
|----------|------|-----------|
| `channels.list` | **1 unit** | N/A |
| `playlistItems.list` | **1 unit** | 50 |
| `videos.list` | **1 unit** | 50 IDs |
| `commentThreads.list` | **1 unit** | 100 |
| `search.list` | **100 units** | 50 |

### 4. Video Statistics in Bulk

`videos.list` accepts up to **50 video IDs** comma-separated. Cost: 1 unit per call regardless of ID count. Use `part=snippet,statistics`.

### 5. Comments

`commentThreads.list` with `order=relevance` or `order=time`. Cannot combine — need 2 separate requests. `maxResults` max is 100. Pagination via `nextPageToken`.

### 6. Efficient Data Flow

For a channel with 200 videos:
- Channel resolution: 1 unit
- Video IDs (4 pages × 50): 4 units
- Video stats (4 batches × 50): 4 units
- Per-video comments (2 requests × 1 unit): 2 units per video
- **Total for full scan + 1 video analysis: ~11 units**

---

## OpenRouter API

### Model String
**`google/gemini-3-flash-preview`** — verified via live API call to `/api/v1/models`

### Pricing
- Input: $0.50 / 1M tokens
- Output: $3.00 / 1M tokens

### Auth
```
Authorization: Bearer $OPENROUTER_API_KEY
Content-Type: application/json
```

### JSON Mode
`response_format: { type: "json_object" }` is supported.

### Balance Endpoint
```
GET https://openrouter.ai/api/v1/credits
Authorization: Bearer $KEY
→ { "data": { "total_credits": 186, "total_usage": 180.89 } }
```
Remaining = `total_credits - total_usage`

### Key Info Endpoint
```
GET https://openrouter.ai/api/v1/auth/key
→ { "data": { "usage": 0, "is_free_tier": false, ... } }
```

### Rate Limits
Per-key. 429 on rate limit with Retry-After header.

---

## URL Formats

### Channel URLs
- `youtube.com/@handle`
- `youtube.com/channel/UCxxxx`
- `youtube.com/c/CustomName`
- `youtube.com/user/Username`
- Just `@handle`

### Video URLs
- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID`
- `youtube.com/shorts/VIDEO_ID`
- `youtube.com/live/VIDEO_ID`
- With params: `?v=ID&t=123&list=PLxxx`

Video IDs are always 11 characters: `[A-Za-z0-9_-]`
