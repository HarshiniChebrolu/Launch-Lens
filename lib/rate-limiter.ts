/**
 * lib/rate-limiter.ts
 * 
 * Production-ready sliding-window rate limiter for LaunchLens API endpoints.
 * Supports dual-tier rate limiting:
 * - Authenticated Users: higher quota (e.g. 30 requests / 60 seconds)
 * - Guest / Anonymous IP: restricted quota (e.g. 10 requests / 60 seconds)
 * 
 * Provides HTTP 429 response formatting with `Retry-After` and `X-RateLimit-*` headers.
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds
  retryAfter: number; // Seconds until next slot opens
}

interface WindowRecord {
  timestamps: number[];
  lastCleanup: number;
}

// In-memory sliding window cache. Keyed by identifier (userId or hashed client IP)
const rateLimitStore = new Map<string, WindowRecord>();

// Periodic pruning of idle keys (every 5 minutes)
let lastGlobalCleanup = Date.now();
function maybePruneStore() {
  const now = Date.now();
  if (now - lastGlobalCleanup > 300_000) {
    lastGlobalCleanup = now;
    const windowMax = 3600_000; // 1 hour max retention
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMax);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }
}

/**
 * Check rate limit using a sliding window log.
 * 
 * @param identifier Unique key (e.g. "usr_123" or "ip_192.168.1.1")
 * @param maxRequests Maximum requests allowed within windowMs
 * @param windowMs Window duration in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 15,
  windowMs = 60_000
): RateLimitResult {
  maybePruneStore();
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [], lastCleanup: now };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  const currentCount = record.timestamps.length;
  const resetTimestamp = Math.ceil((now + windowMs) / 1000);

  if (currentCount >= maxRequests) {
    // Oldest timestamp in current window determines when the next slot opens
    const oldest = record.timestamps[0] || now;
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));

    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: resetTimestamp,
      retryAfter,
    };
  }

  // Allow request and record timestamp
  record.timestamps.push(now);

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - record.timestamps.length,
    reset: resetTimestamp,
    retryAfter: 0,
  };
}

/**
 * Extract sanitized client IP from Next.js request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

/**
 * Helper to generate standard rate limit headers.
 */
export function getRateLimitHeaders(res: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(res.limit),
    "X-RateLimit-Remaining": String(res.remaining),
    "X-RateLimit-Reset": String(res.reset),
  };

  if (!res.success) {
    headers["Retry-After"] = String(res.retryAfter);
  }

  return headers;
}
