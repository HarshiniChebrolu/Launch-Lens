export type IdeaInput = {
  idea: string;
  users: string;
  problem: string;
  industry: string;
  budget: string;
  goal: string;
};

export type ValidationFactor = {
  factor: string;
  score: number;
  reason: string;
  improvement: string;
};

export type StartupReport = {
  title: string;
  summary: string;
  validation?: {
    overallScore: number;
    readiness: string;
    confidence: string;
    factors: ValidationFactor[];
  };
  techStack: {
  frontend: string[];
  backend: string[];
  database: string[];
  ai: string[];
  cloud: string[];
  integrations: string[];
  devops: string[];
  reason: string;
};
costEstimator: {
  developmentCost: string;
  monthlyOperatingCost: string;
  aiApiCost: string;
  cloudCost: string;
  teamNeeded: string[];
  timeToMvp: string;
  breakEvenEstimate: string;
  costRisks: string[];
  savingSuggestions: string[];
  chart: { label: string; value: number }[];
};
investorReadiness: {
  score: number;
  stage: string;
  strengths: string[];
  weaknesses: string[];
  investorConcerns: string[];
  recommendations: string[];
  fundingFit: string;
};
technicalBlueprint: {
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    authentication: string;
    aiLayer: string;
    storage: string;
    deployment: string;
  };
  folderStructure: string[];
  apis: string[];
  databaseTables: string[];
  developmentPhases: {
    phase: string;
    tasks: string[];
  }[];
  deploymentPlan: {
    frontend: string;
    backend: string;
    database: string;
    storage: string;
  };
  workflow: string[];
};
  market: {
    insight: string;
    trends: { label: string; value: number }[];
    opportunities: string[];
  };
  competitors: {
    name: string;
    strength: string;
    weakness: string;
    gap: string;
  }[];
  business: {
    primaryModel: string;
    revenueStreams: string[];
    pricingStrategy: string[];
    profitOutlook: string;
    costRisk: string;
    breakEven: string;
    researchBasis: string;
    chart: { label: string; value: number }[];
  };
  mvp: {
    mustHave: string[];
    shouldHave: string[];
    later: string[];
  };
  security: {
    riskLevel: string;
    privacyConcerns: string[];
    recommendations: string[];
    compliance: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  roadmap: {
    phase: string;
    title: string;
    items: string[];
  }[];
  pitch: {
    short: string;
    investor: string;
    hackathon: string;
    questions: string[];
  };
  opportunityRadar: {
  market: number;
  innovation: number;
  scalability: number;
  competition: number;
  execution: number;
  revenue: number;
  technology: number;
};
branding: {
  startupName: string;
  tagline: string;
  brandPersonality: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  logoPrompt: string;
  domainSuggestions: string[];
  socialHandles: string[];
};
pitchDeck: {
  slides: {
    title: string;
    subtitle: string;
    bullets: string[];
  }[];

};
goToMarket: {
  targetBeachhead: string;
  launchChannels: string[];
  first100Users: string[];
  marketingAngles: string[];
  partnerships: string[];
  growthLoops: string[];
};
executiveSummary: {
  oneLineSummary: string;
  startupStage: string;
  biggestStrength: string;
  biggestRisk: string;
  next30Days: string[];
  next90Days: string[];
  founderChecklist: string[];
};
};