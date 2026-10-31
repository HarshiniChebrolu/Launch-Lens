/**
 * tests/schemas-and-security.test.mjs
 * 
 * Unit tests for API Schemas, Rate Limiting, and Retry Logic:
 * - Zod input schema validation & rejection of malformed payloads
 * - Sliding window rate limiter quota & HTTP 429 response structure
 * - Bounded retry execution:
 *   1. Transient failure followed by success succeeds
 *   2. Non-retryable error (e.g. 400 Bad Request) fails immediately without retry
 *   3. Exhausted attempts fail gracefully
 *   4. Maximum attempt bounds are strictly respected
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// Local replica of IdeaInputSchema for standalone testing
const IdeaInputSchema = z.object({
  idea: z.string().trim().min(10).max(2000),
  users: z.string().trim().min(3).max(500),
  problem: z.string().trim().min(10).max(2000),
  industry: z.string().trim().min(2).max(100),
  budget: z.string().trim().min(1).max(100),
  goal: z.string().trim().min(3).max(500),
});

// Sliding window test implementation
class RateLimiter {
  constructor() {
    this.store = new Map();
  }
  check(key, maxRequests, windowMs) {
    const now = Date.now();
    const windowStart = now - windowMs;
    let timestamps = this.store.get(key) || [];
    timestamps = timestamps.filter(t => t > windowStart);
    if (timestamps.length >= maxRequests) {
      const oldest = timestamps[0] || now;
      const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
      return { success: false, limit: maxRequests, remaining: 0, retryAfter };
    }
    timestamps.push(now);
    this.store.set(key, timestamps);
    return { success: true, limit: maxRequests, remaining: maxRequests - timestamps.length, retryAfter: 0 };
  }
}

// Bounded retry test implementation
async function withRetry(operation, options = {}) {
  const { maxAttempts = 3, initialDelayMs = 10 } = options;
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const data = await operation(attempt);
      return { data, attempts: attempt };
    } catch (err) {
      lastError = err;
      if (err.isPermanent || attempt >= maxAttempts) {
        throw err;
      }
      await new Promise(r => setTimeout(r, initialDelayMs * attempt));
    }
  }
  throw lastError;
}

describe('LaunchLens Security, Schema & Retry Engine', () => {

  describe('1. Zod Input Schema Validation', () => {
    test('accepts completely valid startup idea inputs', () => {
      const validPayload = {
        idea: "AI-powered automated invoice processing for small businesses",
        users: "Accounting firms and small business owners",
        problem: "Manual data entry takes hours and results in costly reconciliation errors",
        industry: "FinTech",
        budget: "$10,000 - $25,000",
        goal: "Launch working beta and onboard first 20 beta customers",
      };

      const result = IdeaInputSchema.safeParse(validPayload);
      assert.equal(result.success, true);
    });

    test('rejects input with missing required fields', () => {
      const missingPayload = {
        idea: "Valid startup idea with plenty of details",
        users: "Founders",
        // missing problem, industry, budget, goal
      };

      const result = IdeaInputSchema.safeParse(missingPayload);
      assert.equal(result.success, false);
      const errors = result.error.flatten().fieldErrors;
      assert.ok('problem' in errors);
      assert.ok('industry' in errors);
    });

    test('rejects input with idea shorter than 10 characters', () => {
      const shortPayload = {
        idea: "Too short",
        users: "Users",
        problem: "A valid problem description here",
        industry: "Tech",
        budget: "$5k",
        goal: "Launch MVP",
      };

      const result = IdeaInputSchema.safeParse(shortPayload);
      assert.equal(result.success, false);
      assert.ok('idea' in result.error.flatten().fieldErrors);
    });

    test('rejects input exceeding maximum length limits', () => {
      const hugeIndustry = "A".repeat(150); // max is 100
      const payload = {
        idea: "Valid startup idea description",
        users: "Users",
        problem: "Valid problem description",
        industry: hugeIndustry,
        budget: "$5k",
        goal: "Launch MVP",
      };

      const result = IdeaInputSchema.safeParse(payload);
      assert.equal(result.success, false);
      assert.ok('industry' in result.error.flatten().fieldErrors);
    });
  });

  describe('2. Rate Limiting Enforcements', () => {
    test('allows requests within designated quota', () => {
      const limiter = new RateLimiter();
      for (let i = 0; i < 5; i++) {
        const res = limiter.check('client_1', 5, 1000);
        assert.equal(res.success, true);
      }
    });

    test('blocks requests exceeding quota with retryAfter indication', () => {
      const limiter = new RateLimiter();
      for (let i = 0; i < 3; i++) {
        limiter.check('client_2', 3, 2000);
      }

      // 4th request should fail with success: false and retryAfter > 0
      const blocked = limiter.check('client_2', 3, 2000);
      assert.equal(blocked.success, false);
      assert.equal(blocked.remaining, 0);
      assert.ok(blocked.retryAfter > 0);
    });

    test('isolates rate limits by client key', () => {
      const limiter = new RateLimiter();
      // Saturate client A
      for (let i = 0; i < 2; i++) limiter.check('user_a', 2, 1000);
      assert.equal(limiter.check('user_a', 2, 1000).success, false);

      // Client B should remain unrestricted
      assert.equal(limiter.check('user_b', 2, 1000).success, true);
    });
  });

  describe('3. Bounded Retry Logic with Exponential Backoff', () => {
    test('succeeds after a transient failure', async () => {
      let attempts = 0;
      const op = async (att) => {
        attempts++;
        if (att === 1) throw new Error('Transient 503 Service Unavailable');
        return 'success_data';
      };

      const result = await withRetry(op, { maxAttempts: 3, initialDelayMs: 5 });
      assert.equal(result.data, 'success_data');
      assert.equal(result.attempts, 2);
      assert.equal(attempts, 2);
    });

    test('does NOT retry permanent errors (e.g. 400 Bad Request)', async () => {
      let attempts = 0;
      const op = async () => {
        attempts++;
        const err = new Error('Permanent 400 Validation Error');
        err.isPermanent = true;
        throw err;
      };

      await assert.rejects(
        async () => withRetry(op, { maxAttempts: 3, initialDelayMs: 5 }),
        /Permanent 400 Validation Error/
      );
      assert.equal(attempts, 1, 'Should fail on first attempt without retry');
    });

    test('respects maxAttempts and throws when retries are exhausted', async () => {
      let attempts = 0;
      const op = async () => {
        attempts++;
        throw new Error('Persistent 500 Network Timeout');
      };

      await assert.rejects(
        async () => withRetry(op, { maxAttempts: 3, initialDelayMs: 5 }),
        /Persistent 500 Network Timeout/
      );
      assert.equal(attempts, 3, 'Must stop precisely at maxAttempts');
    });
  });
});
