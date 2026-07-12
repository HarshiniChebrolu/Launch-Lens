import { IdeaInput, StartupReport } from "@/types/report";

export function buildFallbackReport(input: IdeaInput): StartupReport {
  const industry = input.industry || "startup";
  const users = input.users || "early users";

  return {
    title: input.idea || "Untitled Startup Idea",
    summary: `${input.idea || "This startup idea"} targets ${users} in the ${industry} space. This fallback report is domain-aware and should be replaced by Gemini + Tavily when API keys are available.`,
    validation: {
  overallScore: 72,
  readiness: "Ready for MVP validation",
  confidence: "Medium",
  factors: [
    {
      factor: "Problem Clarity",
      score: 75,
      reason: "The problem direction is visible but still needs real user evidence.",
      improvement: "Interview target users and define one sharp pain point.",
    },
    {
      factor: "Target Audience",
      score: 70,
      reason: "The audience is mentioned but can be narrowed further.",
      improvement: "Focus on one first user segment instead of many users.",
    },
    {
      factor: "Market Potential",
      score: 72,
      reason: "The market may be promising but requires stronger research signals.",
      improvement: "Use live market research and competitor benchmarking.",
    },
    {
      factor: "Business Model",
      score: 68,
      reason: "Revenue streams are possible but pricing needs validation.",
      improvement: "Test willingness to pay with early users.",
    },
    {
      factor: "Technical Feasibility",
      score: 78,
      reason: "The MVP appears buildable with common web and AI tools.",
      improvement: "Reduce scope to the smallest usable workflow.",
    },
    {
      factor: "Innovation",
      score: 70,
      reason: "The idea has potential but needs a clearer differentiator.",
      improvement: "Define what makes it better than generic alternatives.",
    },
    {
      factor: "Security & Privacy",
      score: 74,
      reason: "Basic security needs are understood.",
      improvement: "Add authentication, access control and deletion options.",
    },
    {
      factor: "Scalability",
      score: 68,
      reason: "The concept can scale but architecture planning is still early.",
      improvement: "Design the system with modular APIs and database structure.",
    },
  ],
},
    market: {
      insight: `${industry} shows opportunity if the product solves a clear pain point for ${users}.`,
      trends: [
        { label: "Awareness", value: 45 },
        { label: "Demand", value: 60 },
        { label: "Adoption", value: 52 },
        { label: "Growth", value: 68 },
      ],
      opportunities: [
        `Narrow the target segment inside ${users}.`,
        `Create a focused MVP for ${industry}.`,
        "Validate demand with 20–30 real user interviews.",
      ],
    },
    competitors: [
      {
        name: "Existing manual alternatives",
        strength: "Users already understand the workflow.",
        weakness: "Slow, fragmented and not personalized.",
        gap: "Launch with automation and better user experience.",
      },
      {
        name: "Generic AI tools",
        strength: "Flexible and familiar.",
        weakness: "Not specialized for this exact user problem.",
        gap: "Provide structured domain-specific guidance.",
      },
    ],
    business: {
      primaryModel: `Domain-specific service model for ${industry}`,
      revenueStreams: [
        `Paid plan for high-intent ${users}`,
        "Usage-based advanced analysis",
        "Team or organization plans where collaboration matters",
      ],
      pricingStrategy: [
        "Start with a low-friction trial",
        "Charge for advanced reports or repeated usage",
        "Test willingness to pay before scaling pricing",
      ],
      profitOutlook: "Medium",
      costRisk: "Moderate",
      breakEven: "Depends on acquisition cost and repeat usage",
      researchBasis:
        "Fallback estimate based on industry, users and product type. Live Tavily research will improve this.",
      chart: [
        { label: "Revenue", value: 65 },
        { label: "Cost Control", value: 55 },
        { label: "Retention", value: 60 },
        { label: "Pricing Power", value: 50 },
      ],
    },
    mvp: {
      mustHave: [
        "User onboarding",
        "Core problem-solving workflow",
        "Basic dashboard",
      ],
      shouldHave: [
        "Saved history",
        "Export option",
        "Feedback collection",
      ],
      later: [
        "Team collaboration",
        "Advanced analytics",
        "Integrations",
      ],
    },
    security: {
      riskLevel: "Medium",
      privacyConcerns: [
        "User profile data",
        "Submitted idea details",
        "Saved reports",
      ],
      recommendations: [
        "Use authentication",
        "Store API keys server-side only",
        "Apply role-based access if teams are added",
      ],
      compliance: ["Basic privacy policy", "Data deletion option"],
    },
    swot: {
      strengths: ["Clear product direction", "AI-assisted workflow"],
      weaknesses: ["Needs real user validation", "Market proof is still limited"],
      opportunities: ["Growing demand for faster product planning"],
      threats: ["Generic AI tools", "Low switching cost"],
    },
    roadmap: [
      {
        phase: "Phase 1",
        title: "MVP",
        items: ["Build core workflow", "Test with first users", "Collect feedback"],
      },
      {
        phase: "Phase 2",
        title: "Beta",
        items: ["Improve dashboard", "Add saving/export", "Refine pricing"],
      },
      {
        phase: "Phase 3",
        title: "Launch",
        items: ["Public launch", "Marketing experiments", "Partnerships"],
      },
    ],
    pitch: {
      short: `${input.idea || "This startup"} helps ${users} solve a real problem in ${industry} through a focused, AI-assisted product experience.`,
      investor:
        "We are building a focused startup solution that turns a clear user pain point into a scalable product opportunity.",
      hackathon:
        "Our prototype demonstrates the core workflow, user value and launch path in a simple working product.",
      questions: [
        "Who is the first target user?",
        "How will you acquire users?",
        "Why is this better than existing alternatives?",
      ],
    },
    techStack:{
frontend:["Next.js","Tailwind CSS"],

backend:["FastAPI"],

database:["Supabase"],

ai:["Gemini API"],

cloud:["Vercel"],

integrations:["Tavily","Stripe"],

devops:["Docker","GitHub Actions"],

reason:"Recommended for rapid MVP development and future scalability."
},
costEstimator: {
  developmentCost: "₹10,000–₹40,000 for MVP",
  monthlyOperatingCost: "₹1,000–₹5,000/month",
  aiApiCost: "₹500–₹2,000/month depending on usage",
  cloudCost: "₹500–₹3,000/month",
  teamNeeded: ["Frontend developer", "Backend developer", "AI/API integrator"],
  timeToMvp: "2–4 weeks",
  breakEvenEstimate: "6–12 months depending on pricing and user acquisition",
  costRisks: [
    "AI API usage may increase with active users",
    "Cloud cost may grow with file storage or real-time features",
    "Feature creep can increase development cost"
  ],
  savingSuggestions: [
    "Use managed backend services like Supabase",
    "Start with one core workflow instead of many features",
    "Use serverless hosting for early MVP",
    "Avoid building custom AI models initially"
  ],
  chart: [
    { label: "Development", value: 45 },
    { label: "AI APIs", value: 20 },
    { label: "Cloud", value: 15 },
    { label: "Design", value: 10 },
    { label: "Testing", value: 10 }
  ]
},
investorReadiness: {
  score: 68,
  stage: "MVP validation stage",
  strengths: [
    "Clear startup direction",
    "Can be built as an MVP",
    "Has potential user value"
  ],
  weaknesses: [
    "Needs real user validation",
    "Revenue model still requires testing",
    "Market size evidence is limited"
  ],
  investorConcerns: [
    "Customer acquisition strategy is not proven",
    "Competitive differentiation needs more clarity",
    "Early traction is not available yet"
  ],
  recommendations: [
    "Validate with 20–30 target users",
    "Build a focused MVP before pitching",
    "Collect usage metrics and testimonials",
    "Prepare competitor comparison"
  ],
  fundingFit: "Better suited for grants, hackathons or angel validation before VC funding"
},
startupCanvas: {
  problem: [
    "Users lack a focused solution for the stated problem",
    "Existing alternatives are fragmented or generic",
    "Early users need a faster way to achieve the outcome"
  ],
  solution: [
    "Build a focused MVP around the core workflow",
    "Use AI-assisted automation where it reduces user effort",
    "Provide a simple dashboard for tracking outcomes"
  ],
  uniqueValue: "A focused, fast, and user-friendly startup solution designed for the target segment.",
  unfairAdvantage: "Early focus on a specific niche and rapid iteration with user feedback.",
  customerSegments: ["Early adopters", "Target user niche", "Small teams or individuals"],
  channels: ["LinkedIn", "College communities", "Founder groups", "Direct outreach"],
  revenueStreams: ["Paid plans", "Premium reports/features", "Team workspace"],
  costStructure: ["Development", "Hosting", "AI/API usage", "Marketing"],
  keyMetrics: ["Activation rate", "Retention", "Conversion rate", "Report generation count"]
},
competitorMatrix: {
  features: ["Core Workflow", "AI Assistance", "Analytics", "Export", "Customization"],
  competitors: [
    {
      name: "Your Startup",
      values: ["Focused", "Yes", "Basic", "Yes", "Medium"]
    },
    {
      name: "Generic AI Tools",
      values: ["Broad", "Yes", "Limited", "Limited", "Low"]
    },
    {
      name: "Manual Workflow",
      values: ["Slow", "No", "No", "Manual", "High effort"]
    }
  ]
},
opportunityRadar:{

market:82,

innovation:77,

scalability:75,

competition:61,

execution:72,

revenue:79,

technology:81

},
branding:{

startupName:"LaunchFlow",

tagline:"Build smarter. Grow faster.",

brandPersonality:"Modern, trustworthy and AI-first.",

colorPalette:{
primary:"#4F46E5",
secondary:"#06B6D4",
accent:"#10B981"
},

typography:{
heading:"Poppins",
body:"Inter"
},

logoPrompt:"Minimal futuristic logo using abstract upward arrows and AI-inspired geometry with a blue-purple gradient.",

domainSuggestions:[
"launchflow.ai",
"launchflowapp.com",
"getlaunchflow.com"
],

socialHandles:[
"launchflow",
"launchflowhq",
"launchflow_ai"
]

},
pitchDeck: {
  slides: [
    {
      title: "Startup Overview",
      subtitle: "A focused startup idea built for a clear user segment.",
      bullets: ["Problem identified", "Target users defined", "MVP possible"]
    },
    {
      title: "Problem",
      subtitle: "Users face a painful and repeated challenge.",
      bullets: ["Current solutions are generic", "Manual work is slow", "Users need clarity"]
    },
    {
      title: "Solution",
      subtitle: "A simple product that solves the core workflow.",
      bullets: ["Focused MVP", "Better user experience", "AI-assisted recommendations"]
    },
    {
      title: "Market",
      subtitle: "The target market shows early opportunity.",
      bullets: ["Growing digital adoption", "Niche entry possible", "User validation needed"]
    },
    {
      title: "Business Model",
      subtitle: "Revenue can start simple and grow later.",
      bullets: ["Starter plan", "Premium features", "Team or organization pricing"]
    }
  ]
},
goToMarket: {
  targetBeachhead: "Start with one narrow user segment before expanding.",
  launchChannels: ["LinkedIn outreach", "College/startup communities", "Founder groups"],
  first100Users: [
    "Interview 20 target users",
    "Offer free beta access to early adopters",
    "Collect testimonials from first users"
  ],
  marketingAngles: [
    "Save time before building",
    "Avoid building the wrong product",
    "Get market clarity faster"
  ],
  partnerships: ["College clubs", "Startup communities", "Incubation cells"],
  growthLoops: [
    "Users share generated reports",
    "Reports create referrals",
    "Case studies attract similar users"
  ]
},
executiveSummary:{

oneLineSummary:
"A focused AI startup with promising market potential but requiring user validation.",

startupStage:
"MVP Validation",

biggestStrength:
"Clear problem-solution fit for a defined audience.",

biggestRisk:
"Lack of real-world customer validation.",

next30Days:[
"Interview 20 users",
"Build MVP",
"Launch beta"
],

next90Days:[
"Acquire first 100 users",
"Improve retention",
"Validate pricing"
],

founderChecklist:[
"Validate assumptions",
"Measure KPIs",
"Track user feedback",
"Prepare investor deck"
]

},
  };
}