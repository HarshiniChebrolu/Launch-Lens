import { NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini-client";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export interface ContextualSuggestionsResult {
  problemStatements: string[];
  targetCustomers: string[];
  mvpFeatures: string[];
  differentiators: string[];
  validationExperiments: string[];
}

export async function POST(req: Request) {
  try {
    const { idea, field, industry } = await req.json();

    const query = (idea || "").trim();
    if (!query || query.length < 5) {
      return NextResponse.json({
        success: true,
        suggestions: {
          problemStatements: [],
          targetCustomers: [],
          mvpFeatures: [],
          differentiators: [],
          validationExperiments: [],
        },
      });
    }

    const model = getGeminiModel("chat");

    if (model) {
      const prompt = `
Given this early startup draft: "${query}" (Industry: ${industry || "Technology"})
Generate quick, crisp hypotheses that a founder could adopt.
Respond ONLY with valid JSON:
{
  "problemStatements": [
    "Precise problem angle 1",
    "Precise problem angle 2"
  ],
  "targetCustomers": [
    "Specific customer profile 1",
    "Specific customer profile 2"
  ],
  "mvpFeatures": [
    "High-impact MVP feature 1",
    "High-impact MVP feature 2"
  ],
  "differentiators": [
    "Compelling competitive advantage 1",
    "Compelling competitive advantage 2"
  ],
  "validationExperiments": [
    "Quick 48-hour validation test 1",
    "Quick customer interview question 2"
  ]
}
`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ success: true, suggestions: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini suggestions error, fallback used:", geminiError);
      }
    }

    // Contextual heuristic fallback
    const fallback: ContextualSuggestionsResult = {
      problemStatements: [
        `High operational friction and lack of modern tooling for ${query.slice(0, 50)}`,
        `Users lose 5+ hours weekly switching between disconnected point solutions`
      ],
      targetCustomers: [
        "Time-constrained solo founders & seed-stage teams",
        "Mid-market team leads with direct software purchasing authority"
      ],
      mvpFeatures: [
        "Automated workflow pipeline with template library",
        "Instant export to Slack, Notion, and email alerts"
      ],
      differentiators: [
        "Opinionated zero-setup design vs complex legacy enterprise suites",
        "Direct webhook integrations with sub-second processing latency"
      ],
      validationExperiments: [
        "Run 5 customer interviews asking how they currently solve this manually",
        "Deploy a waitlist landing page measuring 20%+ click-to-signup conversion"
      ]
    };

    return NextResponse.json({ success: true, suggestions: fallback });
  } catch (error: any) {
    console.error("Suggestions route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch suggestions" },
      { status: 500 }
    );
  }
}
