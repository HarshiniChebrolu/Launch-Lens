import { IdeaInput, StartupReport } from "@/types/report";
import { researchWithTavily } from "./tavily";
import { generateReportWithGemini } from "./gemini";
import { buildFallbackReport } from "./fallback";
import { analyzeMarketPositioning } from "./positioning";
import { StartupReportSchema } from "./schemas";
import { withRetry } from "./retry";
import { telemetry } from "./telemetry";

/**
 * Builds a comprehensive StartupReport enriched with:
 * 1. Live web research via Tavily (with bounded exponential backoff retries).
 * 2. LLM synthesis via Gemini (with bounded retries).
 * 3. Deterministic Semantic Positioning Engine (embeddings, cosine ranking, PCA, K-Means).
 * 4. Structural validation via Zod (StartupReportSchema).
 */
export async function buildStartupReport(
  input: IdeaInput
): Promise<StartupReport> {
  const reportStartTime = Date.now();
  let research: unknown = {
    available: false,
    results: [],
  };

  // 1. Tavily Research with bounded retry (2 attempts max)
  try {
    const tavilyResult = await withRetry(
      async () => researchWithTavily(input),
      {
        maxAttempts: 2,
        initialDelayMs: 600,
        maxDelayMs: 2500,
        overallTimeoutMs: 12_000,
        operationName: "tavily_research",
      }
    );
    research = tavilyResult.data;
  } catch (error) {
    telemetry.logEvent({
      type: "tavily_failed",
      userType: "authenticated",
      metadata: { error: String((error as { message?: string })?.message || error) },
    });
    console.warn("Tavily research failed or timed out. Proceeding with synthesis:", error);
  }

  // 2. Gemini synthesis with bounded retry (2 attempts max)
  let baseReport: StartupReport;
  try {
    const geminiResult = await withRetry(
      async () => {
        const rep = await generateReportWithGemini(input, research);
        if (!rep) throw new Error("Gemini returned null report");
        return rep as StartupReport;
      },
      {
        maxAttempts: 2,
        initialDelayMs: 800,
        maxDelayMs: 3000,
        overallTimeoutMs: 25_000,
        operationName: "gemini_synthesis",
      }
    );
    baseReport = geminiResult.data;
  } catch (error) {
    telemetry.logEvent({
      type: "gemini_failed",
      userType: "authenticated",
      metadata: { error: String((error as { message?: string })?.message || error) },
    });
    console.warn("Gemini generation failed. Invoking safe fallback report:", error);
    baseReport = buildFallbackReport(input);
  }

  // 3. Run Semantic Positioning Engine
  try {
    const competitorInputs = (baseReport.competitors || []).map((comp) => ({
      name: comp.name,
      description: `${comp.strength}. ${comp.weakness}. ${comp.gap}`,
      strength: comp.strength,
      weakness: comp.weakness,
      gap: comp.gap,
    }));

    const positioning = await analyzeMarketPositioning(
      {
        name: baseReport.title || input.idea.slice(0, 50),
        description: `${input.idea}. Problem: ${input.problem}. Industry: ${input.industry}`,
      },
      competitorInputs
    );

    baseReport.marketPositioning = positioning;

    telemetry.logEvent({
      type: "positioning_completed",
      userType: "authenticated",
      metadata: {
        competitorCount: competitorInputs.length,
        crowdednessScore: positioning.scores.crowdednessScore,
        densityBand: positioning.scores.marketDensity,
      },
    });
  } catch (posError) {
    telemetry.logEvent({
      type: "positioning_failed",
      userType: "authenticated",
      metadata: { error: String((posError as { message?: string })?.message || posError) },
    });
    console.error("Semantic positioning failed:", posError);
  }

  // 4. Safe structural validation via Zod
  const validation = StartupReportSchema.safeParse(baseReport);
  if (!validation.success) {
    telemetry.logEvent({
      type: "report_validation_failed",
      userType: "authenticated",
      metadata: { errorCount: validation.error.issues.length },
    });
    console.warn("Report schema validation had issues:", validation.error.flatten().fieldErrors);
    // If partial schema issue, return baseReport safely or patch with fallback
    return baseReport;
  }

  return baseReport;
}