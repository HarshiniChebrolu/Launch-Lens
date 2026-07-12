import { IdeaInput } from "@/types/report";
import { getGeminiModel } from "@/lib/gemini-client";

export async function generateReportWithGemini(input: IdeaInput, research: any) {
  const model = getGeminiModel("report");

if (!model) return null;
  const prompt = `
You are Launch Lens AI.

You are a startup consultant, CTO, product manager, investor analyst, brand strategist, market researcher, security advisor and pitch coach.

Create one complete Startup Intelligence Report.
Generate a technical blueprint for building this startup.

Include:

- Overall system architecture
- Frontend technology
- Backend technology
- Database
- Authentication
- AI Layer
- Storage
- Folder structure
- Required APIs & integrations
- Suggested database tables
- Development phases
- Deployment plan
- End-to-end workflow

Choose technologies according to the startup's industry, scale, budget, AI requirements and target users.

Do not recommend the same stack for every startup.
Rules:
- Return ONLY valid JSON.
- Do not use markdown.
- Do not use triple backticks.
- Do not return explanation outside JSON.
- Never leave arrays empty.
- Never return null.
- Make every section specific to the user's idea, industry, users, budget, goal, market research and competitors.
- Do NOT use fixed placeholder names like LaunchFlow.
- Do NOT always recommend Next.js, Supabase, Stripe, Poppins, Inter, or blue-purple branding.
- Use Tavily research when available.
- If research is weak, make the best practical assumption.
Business Model Rules

Generate the business section as if the startup is a real commercial product.

Ignore whether the user selected:
- College Project
- Hackathon
- MVP
- Prototype

Never say:
- Not applicable
- Future:
- Since this is a college project
- For now
- Free because it is a student project

Always generate:

- Primary Business Model
- Revenue Streams
- Pricing Strategy
- Profit Outlook
- Break-even Estimate
- Cost Risks

Revenue streams must be realistic for this specific startup.

Pricing strategy must depend on:
- Target customers
- Market
- Competitors
- Industry
- Product value

Never use generic Freemium or Subscription unless justified.
Business Chart Rules

The business chart must represent revenue contribution by revenue source.

Possible labels include:

- Subscription Revenue
- Enterprise Sales
- Marketplace Fees
- Consulting
- Advertising
- Affiliate Revenue
- Licensing

Choose labels according to the startup idea.

Do not generate labels such as:
- Free Tier
- College Project
- Future Revenue
- Premium Later
Technical Blueprint Rules

Generate a complete implementation blueprint.

Include:

- Overall Architecture
- Frontend
- Backend
- Database
- Authentication
- AI Layer
- Storage
- Deployment
- Folder Structure
- APIs
- Database Tables
- Development Phases
- End-to-End Workflow

The blueprint must be specific to this startup.

Different industries must receive different architectures.

Do not always recommend:
- Next.js
- Supabase
- Gemini
- Tailwind

Recommend technologies based on:
- Scale
- Industry
- Budget
- AI requirements
- Expected traffic
Quality Rules

Every section must be different for different startup ideas.

Do not repeat content across sections.

Business must discuss monetization only.

Technical Blueprint must discuss implementation only.

Branding must discuss identity only.

Go-To-Market must discuss customer acquisition only.

If a field is unknown, make the best practical business assumption instead of returning generic text.
User idea:
${JSON.stringify(input, null, 2)}

Live research:
${JSON.stringify(research, null, 2)}

Validation factors:
Problem Clarity, Target Audience, Market Potential, Business Model, Technical Feasibility, Innovation, Security & Privacy, Scalability.

Readiness rules:
0-39: Not ready
40-59: Needs validation
60-74: Ready for MVP
75-89: Ready for beta
90-100: Investor ready

Return this exact JSON shape:

{
  "title": "",
  "summary": "",
  "executiveSummary": {
    "oneLineSummary": "",
    "startupStage": "",
    "biggestStrength": "",
    "biggestRisk": "",
    "next30Days": [],
    "next90Days": [],
    "founderChecklist": []
  },
  "validation": {
    "overallScore": 0,
    "readiness": "",
    "confidence": "",
    "factors": [
      {
        "factor": "",
        "score": 0,
        "reason": "",
        "improvement": ""
      }
    ]
  },
  "market": {
    "insight": "",
    "trends": [
      {
        "label": "",
        "value": 0
      }
    ],
    "opportunities": []
  },
  "competitors": [
    {
      "name": "",
      "strength": "",
      "weakness": "",
      "gap": ""
    }
  ],
  "competitorMatrix": {
    "features": [],
    "competitors": [
      {
        "name": "",
        "values": []
      }
    ]
  },
  "business": {
    "primaryModel": "",
    "revenueStreams": [],
    "pricingStrategy": [],
    "profitOutlook": "",
    "costRisk": "",
    "breakEven": "",
    "researchBasis": "",
    "chart": [
      {
        "label": "",
        "value": 0
      }
    ]
  },
  "costEstimator": {
    "developmentCost": "",
    "monthlyOperatingCost": "",
    "aiApiCost": "",
    "cloudCost": "",
    "teamNeeded": [],
    "timeToMvp": "",
    "breakEvenEstimate": "",
    "costRisks": [],
    "savingSuggestions": [],
    "chart": [
      {
        "label": "",
        "value": 0
      }
    ]
  },
  "mvp": {
    "mustHave": [],
    "shouldHave": [],
    "later": []
  },
  "techStack": {
    "frontend": [],
    "backend": [],
    "database": [],
    "ai": [],
    "cloud": [],
    "integrations": [],
    "devops": [],
    "reason": ""
  },
  "security": {
    "riskLevel": "",
    "privacyConcerns": [],
    "recommendations": [],
    "compliance": []
  },
  "swot": {
    "strengths": [],
    "weaknesses": [],
    "opportunities": [],
    "threats": []
  },
  "roadmap": [
    {
      "phase": "",
      "title": "",
      "items": []
    }
  ],
  "opportunityRadar": {
    "market": 0,
    "innovation": 0,
    "scalability": 0,
    "competition": 0,
    "execution": 0,
    "revenue": 0,
    "technology": 0
  },
  "pitch": {
    "short": "",
    "investor": "",
    "hackathon": "",
    "questions": []
  },
  "pitchDeck": {
    "slides": [
      {
        "title": "",
        "subtitle": "",
        "bullets": []
      }
    ]
  },
  "investorReadiness": {
    "score": 0,
    "stage": "",
    "strengths": [],
    "weaknesses": [],
    "investorConcerns": [],
    "recommendations": [],
    "fundingFit": ""
  },
  "technicalBlueprint": {
  "architecture": {
    "frontend": "",
    "backend": "",
    "database": "",
    "authentication": "",
    "aiLayer": "",
    "storage": "",
    "deployment": ""
  },
  "folderStructure": [],
  "apis": [],
  "databaseTables": [],
  "developmentPhases": [
    {
      "phase": "",
      "tasks": []
    }
  ],
  "deploymentPlan": {
    "frontend": "",
    "backend": "",
    "database": "",
    "storage": ""
  },
  "workflow": []
},
  "branding": {
    "startupName": "",
    "tagline": "",
    "brandPersonality": "",
    "colorPalette": {
      "primary": "",
      "secondary": "",
      "accent": ""
    },
    "typography": {
      "heading": "",
      "body": ""
    },
    "logoPrompt": "",
    "domainSuggestions": [],
    "socialHandles": []
  },
  "goToMarket": {
    "targetBeachhead": "",
    "launchChannels": [],
    "first100Users": [],
    "marketingAngles": [],
    "partnerships": [],
    "growthLoops": []
  }
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}