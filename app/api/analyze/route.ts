import { NextResponse } from "next/server";
import { buildStartupReport } from "@/lib/report-builder";
import { IdeaInputSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp, getRateLimitHeaders } from "@/lib/rate-limiter";
import { telemetry } from "@/lib/telemetry";
import { supabase } from "@/lib/supabase";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Hardened /api/analyze endpoint:
 * 1. Dual-Tier Authentication & Access Policy (Verified Supabase Session vs Guest Policy).
 * 2. Sliding-Window Rate Limiting (HTTP 429 + Retry-After).
 * 3. Strict Zod Schema Validation before expensive downstream ML/LLM calls.
 * 4. Observability and Privacy-Conscious Telemetry.
 */
export async function POST(req: Request) {
  const requestStartTime = Date.now();
  const clientIp = getClientIp(req);

  // 1. Authenticate Request
  // Check Authorization: Bearer <jwt> header
  let verifiedUserId: string | null = null;
  let userType: "authenticated" | "guest" = "guest";

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user?.id) {
        verifiedUserId = data.user.id;
        userType = "authenticated";
      }
    } catch {
      // Token verification failed; treated as unverified guest
    }
  }

  // 2. Rate Limiting Enforced by User / IP
  // Authenticated users: 30 req/min; Guests: 6 req/min
  const rateLimitKey = verifiedUserId ? `usr_${verifiedUserId}` : `ip_${clientIp}`;
  const maxQuota = userType === "authenticated" ? 30 : 6;
  const rateLimitResult = checkRateLimit(rateLimitKey, maxQuota, 60_000);

  if (!rateLimitResult.success) {
    telemetry.logEvent({
      type: "rate_limit_triggered",
      userType,
      userIdHash: rateLimitKey,
      metadata: { limit: maxQuota, retryAfter: rateLimitResult.retryAfter },
    });

    return NextResponse.json(
      {
        success: false,
        error: `Rate limit exceeded. Please try again in ${rateLimitResult.retryAfter} seconds.`,
        retryAfter: rateLimitResult.retryAfter,
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  // 3. Input Schema Validation
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON request payload.",
      },
      { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  // Support either raw IdeaInput or { idea: IdeaInput }
  const candidateInput =
    rawBody && typeof rawBody === "object" && "idea" in (rawBody as Record<string, unknown>) && typeof (rawBody as Record<string, unknown>).idea === "object"
      ? (rawBody as Record<string, unknown>).idea
      : rawBody;

  const parseResult = IdeaInputSchema.safeParse(candidateInput);
  if (!parseResult.success) {
    const errorDetails = parseResult.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed. Please verify all required startup idea fields.",
        details: errorDetails,
      },
      { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  const validatedInput = parseResult.data;

  // 4. Log Request Telemetry
  telemetry.logEvent({
    type: "analysis_requested",
    userType,
    userIdHash: rateLimitKey,
    metadata: { industry: validatedInput.industry },
  });

  // 5. Execute Analysis Pipeline (ML Positioning + Synthesis)
  try {
    const report = await buildStartupReport(validatedInput);

    const totalDuration = Date.now() - requestStartTime;

    telemetry.logEvent({
      type: "analysis_completed",
      userType,
      userIdHash: rateLimitKey,
      durationMs: totalDuration,
      metadata: {
        hasPositioning: Boolean(report.marketPositioning),
        crowdednessScore: report.marketPositioning?.scores.crowdednessScore ?? -1,
      },
    });

    return NextResponse.json(
      {
        success: true,
        report,
        source: "ai",
        authenticated: userType === "authenticated",
        durationMs: totalDuration,
      },
      {
        status: 200,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error("Critical error in /api/analyze:", error);

    telemetry.logEvent({
      type: "fallback_used",
      userType,
      userIdHash: rateLimitKey,
      durationMs: Date.now() - requestStartTime,
      metadata: { error: String((error as { message?: string })?.message || error) },
    });

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while analyzing the startup idea.",
      },
      { status: 500, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }
}