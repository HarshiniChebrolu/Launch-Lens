import { NextResponse } from "next/server";
import { computeMarketPositioning } from "@/lib/positioning";
import { CompetitorInput, StartupIdeaInput } from "@/types/positioning";

export const maxDuration = 45;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const startup: StartupIdeaInput = body.startup;
    const competitors: CompetitorInput[] = body.competitors || [];

    if (!startup || !startup.name) {
      return NextResponse.json(
        { success: false, error: "Startup name and details are required." },
        { status: 400 }
      );
    }

    if (competitors.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one competitor is required to map positioning." },
        { status: 400 }
      );
    }

    const sanitizedCompetitors = competitors.map((c) => ({
      name: c.name || "Competitor",
      description: c.description || c.strength || c.gap || "Market competitor",
      strength: c.strength,
      weakness: c.weakness,
      gap: c.gap,
    }));

    const result = await computeMarketPositioning(startup, sanitizedCompetitors);

    return NextResponse.json({
      success: true,
      positioning: result,
    });
  } catch (error) {
    console.error("[api/positioning] Error analyzing market positioning:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to calculate market positioning.",
      },
      { status: 500 }
    );
  }
}
