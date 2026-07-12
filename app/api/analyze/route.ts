import { NextResponse } from "next/server";
import { buildStartupReport } from "@/lib/report-builder";

export async function POST(req: Request) {
  try {
    console.log("GEMINI exists:", Boolean(process.env.GEMINI_API_KEY));
    console.log("TAVILY exists:", Boolean(process.env.TAVILY_API_KEY));

    const input = await req.json();
    const report = await buildStartupReport(input);

    console.log("TECHNICAL BLUEPRINT:");
    console.log(JSON.stringify(report.technicalBlueprint, null, 2));

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate report",
      },
      { status: 500 }
    );
  }
}