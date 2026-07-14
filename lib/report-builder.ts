import { IdeaInput, StartupReport } from "@/types/report";
import { researchWithTavily } from "./tavily";
import { generateReportWithGemini } from "./gemini";
import { buildFallbackReport } from "./fallback";

function missing(section: unknown) {
  if (section === null || section === undefined) return true;

  if (Array.isArray(section)) {
    return section.length === 0;
  }

  if (typeof section === "object") {
    return Object.keys(section as object).length === 0;
  }

  if (typeof section === "string") {
    return section.trim().length === 0;
  }

  return false;
}

function validateReport(report: StartupReport) {
  const required: Array<keyof StartupReport> = [
    "title",
    "summary",
    "executiveSummary",
    "validation",
    "market",
    "competitors",
    "business",
    "mvp",
    "security",
    "swot",
    "roadmap",
    "pitch",
    "techStack",
    "costEstimator",
    "technicalBlueprint",
    "branding",
    "goToMarket",
    "investorReadiness",
    "competitorMatrix",
    "opportunityRadar",
    "pitchDeck",
  ];

  for (const key of required) {
    if (missing(report[key])) {
      throw new Error(`AI response missing required section: ${String(key)}`);
    }
  }
}

export async function buildStartupReport(
  input: IdeaInput
): Promise<StartupReport> {
  let research: unknown = {
    available: false,
    results: [],
  };

  try {
    research = await researchWithTavily(input);
  } catch (error) {
    console.error(
      "Tavily research failed. Continuing without live research:",
      error
    );
  }

  try {
    const aiReport = await generateReportWithGemini(input, research);

    if (!aiReport) {
      throw new Error("Gemini returned no startup report.");
    }

    validateReport(aiReport as StartupReport);

    return aiReport as StartupReport;
  } catch (error) {
    console.error(
      "AI report generation or validation failed. Using fallback report:",
      error
    );

    return buildFallbackReport(input);
  }
}