/**
 * lib/retry.ts
 * 
 * Bounded retry utility with exponential backoff and jitter.
 * Designed for resilient network operations against external APIs (Gemini, Tavily).
 * 
 * Guarantees:
 * 1. Bounded maximum attempts (default: 3)
 * 2. Total overall operation timeout
 * 3. Exponential backoff with full jitter to prevent thundering herd
 * 4. Respects `Retry-After` header when available from HTTP 429
 * 5. Non-retryable on client permanent errors (400, 401, 403, 422)
 * 6. Detailed attempt tracking for operational observability
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  overallTimeoutMs?: number;
  operationName?: string;
  isRetryable?: (error: unknown, attempt: number) => boolean;
}

export interface RetryResult<T> {
  data: T;
  attempts: number;
  totalDurationMs: number;
  retried: boolean;
}

export class NonRetryableError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "NonRetryableError";
  }
}

/**
 * Standard retryable error classifier.
 * Transient: network drop, connection reset, timeout, HTTP 429, HTTP 500, 502, 503, 504.
 * Non-transient: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 422 Unprocessable.
 */
export function defaultIsRetryable(error: unknown): boolean {
  if (error instanceof NonRetryableError) return false;

  if (error && typeof error === "object") {
    // Check status code on fetch Response or axios/SDK errors
    const status = (error as { status?: number; statusCode?: number }).status ?? 
                   (error as { status?: number; statusCode?: number }).statusCode;

    if (typeof status === "number") {
      if (status >= 400 && status < 500 && status !== 429) {
        return false; // Permanent client error (400, 401, 403, 404, 422)
      }
      if (status === 429 || status >= 500) {
        return true; // Rate limit or transient server failure
      }
    }

    const message = String((error as { message?: string }).message || "").toLowerCase();
    if (
      message.includes("fetch failed") ||
      message.includes("network") ||
      message.includes("timeout") ||
      message.includes("econnreset") ||
      message.includes("econnrefused") ||
      message.includes("rate limit") ||
      message.includes("overloaded") ||
      message.includes("quota")
    ) {
      return true;
    }
  }

  return true; // Default fallback for unexpected errors
}

/**
 * Parse Retry-After header or string value (in seconds or HTTP date).
 */
export function parseRetryAfter(headerValue?: string | null): number | null {
  if (!headerValue) return null;
  const seconds = Number(headerValue);
  if (!isNaN(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, 30_000); // Cap at 30 seconds
  }
  const date = Date.parse(headerValue);
  if (!isNaN(date)) {
    const diff = date - Date.now();
    return Math.max(0, Math.min(diff, 30_000));
  }
  return null;
}

/**
 * Execute an async operation with bounded exponential backoff and jitter.
 */
export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    initialDelayMs = 500,
    maxDelayMs = 5000,
    backoffFactor = 2,
    overallTimeoutMs = 30_000,
    operationName = "anonymous_operation",
    isRetryable = defaultIsRetryable,
  } = options;

  const startTime = Date.now();
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Check if overall timeout exceeded
    if (Date.now() - startTime > overallTimeoutMs) {
      throw new Error(
        `[${operationName}] Operation exceeded overall timeout of ${overallTimeoutMs}ms after ${attempt - 1} attempts. Last error: ${String(lastError)}`
      );
    }

    try {
      const data = await operation(attempt);
      return {
        data,
        attempts: attempt,
        totalDurationMs: Date.now() - startTime,
        retried: attempt > 1,
      };
    } catch (error) {
      lastError = error;

      if (attempt >= maxAttempts || !isRetryable(error, attempt)) {
        throw error;
      }

      // Check for explicit Retry-After
      const retryAfterHeader = (error as { headers?: Headers | Record<string, string> })?.headers;
      let delayMs = 0;
      if (retryAfterHeader) {
        const val = typeof (retryAfterHeader as Headers).get === "function" 
          ? (retryAfterHeader as Headers).get("retry-after")
          : (retryAfterHeader as Record<string, string>)["retry-after"];
        const parsed = parseRetryAfter(val);
        if (parsed !== null) delayMs = parsed;
      }

      if (delayMs === 0) {
        // Exponential backoff: baseDelay * factor^(attempt - 1)
        const exponentialDelay = initialDelayMs * Math.pow(backoffFactor, attempt - 1);
        const cappedDelay = Math.min(exponentialDelay, maxDelayMs);
        // Full jitter: random between 0.5 * delay and 1.5 * delay
        const jitter = 0.5 + Math.random();
        delayMs = Math.round(cappedDelay * jitter);
      }

      console.warn(
        `[${operationName}] Attempt ${attempt}/${maxAttempts} failed (${String(
          (error as { message?: string })?.message || error
        )}). Retrying in ${delayMs}ms...`
      );

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}
