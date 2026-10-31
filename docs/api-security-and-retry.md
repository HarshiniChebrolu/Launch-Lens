# LaunchLens API Security, Schema Validation & Retry Engineering

## 1. Authentication & Access Control

### 1.1 Dual-Tier Access Model
LaunchLens enforces an explicit server-side access policy on `/api/analyze`:

1. **Authenticated Users:**
   - Validated via `Authorization: Bearer <JWT>` header using Supabase Server Auth (`supabase.auth.getUser(token)`).
   - User identity is **never trusted** from unverified client request bodies.
   - Analysis records are tied to the verified user ID.
   - Generous sliding quota: **30 analyses per minute**.

2. **Guest / Anonymous Access:**
   - If no valid session token is provided, requests fall back to an explicit Guest Policy.
   - Identified via client IP (`x-forwarded-for`, `x-real-ip`, or `cf-connecting-ip`).
   - Restricted quota: **6 analyses per minute**.

---

## 2. Sliding-Window Rate Limiting

Rate limiting is enforced at the API boundary using an in-memory sliding-window log with automatic memory pruning.

### 2.1 HTTP 429 Protocol
When a client exceeds their designated window quota, the server immediately halts processing before invoking expensive AI or ML pipelines, returning:

- **Status Code:** `429 Too Many Requests`
- **Standard Headers:**
  - `X-RateLimit-Limit`: Maximum requests permitted in window.
  - `X-RateLimit-Remaining`: Remaining request slots (0 when blocked).
  - `X-RateLimit-Reset`: Unix timestamp when the window resets.
  - `Retry-After`: Exact integer number of seconds until the earliest slot opens.

```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in 14 seconds.",
  "retryAfter": 14
}
```

---

## 3. Strict Schema Validation (Zod)

All inputs, model outputs, and data persistence models are validated using Zod:

1. **Request Input Validation (`IdeaInputSchema`):**
   - Idea description: `string().trim().min(10).max(2000)`
   - Target users: `string().trim().min(3).max(500)`
   - Problem statement: `string().trim().min(10).max(2000)`
   - Industry sector: `string().trim().min(2).max(100)`
   - Budget: `string().trim().min(1).max(100)`
   - Goal: `string().trim().min(3).max(500)`
2. **Safe Error Sanitization:**
   - Rejects malformed requests with `400 Bad Request` and structured field error arrays.
   - Never exposes internal stack traces, database credentials, or provider secrets in client responses.
3. **Report Structural Integrity (`StartupReportSchema`):**
   - Validates all 21 required report sections and the ML `marketPositioning` payload before returning data to the client.

---

## 4. Bounded Retry Logic with Exponential Backoff & Jitter

Network requests to external APIs (Gemini, Tavily) are wrapped with `withRetry`:

1. **Transient vs Non-Retryable Error Classification:**
   - **Retryable:** Connection resets, timeouts, HTTP 429 (rate limited), HTTP 500, 502, 503, 504.
   - **Non-Retryable:** Permanent client errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 422 Unprocessable). These fail immediately to prevent wasted compute.
2. **Exponential Backoff Formula:**
   $$\text{Delay}_t = \min\Big(\text{MaxDelay}, \text{BaseDelay} \times \text{Factor}^{t-1}\Big) \times (0.5 + \text{rand}())$$
3. **`Retry-After` Header Adherence:**
   - If an external provider returns an HTTP 429 with a `Retry-After` header, the backoff timer automatically honors the requested duration (capped at 30 seconds).
4. **Overall Timeout Guarantee:**
   - Overall request operations are bounded by a hard timeout (12s for Tavily, 25s for Gemini) to prevent hanging worker threads.
