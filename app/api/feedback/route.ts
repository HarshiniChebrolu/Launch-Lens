import { NextResponse } from "next/server";
import { FeedbackInputSchema } from "@/lib/schemas";
import { telemetry } from "@/lib/telemetry";
import { getClientIp, checkRateLimit, getRateLimitHeaders } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

interface StoredFeedback {
  id: string;
  reportId?: string;
  usefulnessScore: number;
  competitorsRelevant: boolean;
  positioningReasonable: boolean;
  containsUnsupportedClaims: boolean;
  confusingOrMissingFeatures?: string;
  createdAt: string;
}

// In-memory feedback store (also persisted in telemetry)
const feedbackRecords: StoredFeedback[] = [];

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimitResult = checkRateLimit(`fb_${clientIp}`, 10, 60_000);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: "Too many feedback submissions. Please wait." },
      { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON format" },
      { status: 400 }
    );
  }

  const validation = FeedbackInputSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: validation.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const feedbackData = validation.data;
  const newRecord: StoredFeedback = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ...feedbackData,
    createdAt: new Date().toISOString(),
  };

  feedbackRecords.push(newRecord);
  if (feedbackRecords.length > 500) {
    feedbackRecords.shift();
  }

  return NextResponse.json({
    success: true,
    feedbackId: newRecord.id,
    message: "Feedback recorded successfully. Thank you for helping evaluate LaunchLens!",
  });
}

export async function GET() {
  const metrics = telemetry.getMetrics();
  const totalFeedback = feedbackRecords.length;

  const relevantPercent = totalFeedback > 0
    ? (feedbackRecords.filter((f) => f.competitorsRelevant).length / totalFeedback) * 100
    : 0;

  const reasonablePercent = totalFeedback > 0
    ? (feedbackRecords.filter((f) => f.positioningReasonable).length / totalFeedback) * 100
    : 0;

  const avgScore = totalFeedback > 0
    ? feedbackRecords.reduce((sum, f) => sum + f.usefulnessScore, 0) / totalFeedback
    : 0;

  return NextResponse.json({
    success: true,
    telemetry: metrics,
    feedbackSummary: {
      totalResponses: totalFeedback,
      averageUsefulnessScore: Number(avgScore.toFixed(2)),
      competitorsRelevantPercentage: Number(relevantPercent.toFixed(1)),
      positioningReasonablePercentage: Number(reasonablePercent.toFixed(1)),
      recentFeedback: feedbackRecords.slice(-10),
    },
  });
}
