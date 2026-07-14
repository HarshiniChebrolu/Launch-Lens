import { NextResponse } from "next/server";
import { buildStartupReport } from "@/lib/report-builder";
import { buildFallbackReport } from "@/lib/fallback";
import { IdeaInput } from "@/types/report";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let input: IdeaInput | null = null;

  try {
    input = (await req.json()) as IdeaInput;

    if (
      !input.idea?.trim() ||
      !input.users?.trim() ||
      !input.problem?.trim() ||
      !input.industry?.trim() ||
      !input.budget?.trim() ||
      !input.goal?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all startup idea fields.",
        },
        { status: 400 }
      );
    }

    const report = await buildStartupReport(input);

    if (!report) {
      throw new Error("Report generation returned no data.");
    }

    return NextResponse.json({
      success: true,
      report,
      source: "ai",
    });
  } catch (error) {
    console.error("Analyze API error:", error);

    if (input) {
      try {
        const fallbackReport = buildFallbackReport(input);

        return NextResponse.json({
          success: true,
          report: fallbackReport,
          source: "fallback",
          warning:
            "Live AI analysis was temporarily unavailable. A reliable startup report was generated instead.",
        });
      } catch (fallbackError) {
        console.error("Fallback generation failed:", fallbackError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Could not process this startup idea. Please try again.",
      },
      { status: 500 }
    );
  }
}