import { IdeaInput, StartupReport } from "@/types/report";
import { researchWithTavily } from "./tavily";
import { generateReportWithGemini } from "./gemini";

function missing(section: unknown) {
  if (!section) return true;
  if (Array.isArray(section)) return section.length === 0;
  if (typeof section === "object") return Object.keys(section as object).length === 0;
  return false;
}

export async function buildStartupReport(input: IdeaInput): Promise<StartupReport> {
  const research = await researchWithTavily(input);
  const aiReport = await generateReportWithGemini(input, research);

  if (!aiReport) {
    throw new Error(
      "AI report generation failed. Check GEMINI_API_KEY, Tavily key, and model access."
    );
  }

  const required = [
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
    if (missing(aiReport[key])) {
      throw new Error(`AI response missing required section: ${key}`);
    }
  }

  return aiReport;
}