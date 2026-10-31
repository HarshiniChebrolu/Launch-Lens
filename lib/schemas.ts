import { z } from "zod";

/**
 * lib/schemas.ts
 * 
 * Strict Zod validation schemas for LaunchLens.
 * Validates API request boundaries, external AI model outputs,
 * and semantic positioning engine data structures.
 */

// 1. Startup Idea Input Schema
export const IdeaInputSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(10, "Startup idea must be at least 10 characters long")
    .max(2000, "Startup idea cannot exceed 2000 characters"),
  users: z
    .string()
    .trim()
    .min(3, "Target users must be at least 3 characters")
    .max(500, "Target users cannot exceed 500 characters"),
  problem: z
    .string()
    .trim()
    .min(10, "Problem statement must be at least 10 characters")
    .max(2000, "Problem statement cannot exceed 2000 characters"),
  industry: z
    .string()
    .trim()
    .min(2, "Industry must be at least 2 characters")
    .max(100, "Industry cannot exceed 100 characters"),
  budget: z
    .string()
    .trim()
    .min(1, "Budget is required")
    .max(100, "Budget cannot exceed 100 characters"),
  goal: z
    .string()
    .trim()
    .min(3, "Goal must be at least 3 characters")
    .max(500, "Goal cannot exceed 500 characters"),
});

export type ValidatedIdeaInput = z.infer<typeof IdeaInputSchema>;

// 2. Request Envelope Schema (with optional user context)
export const AnalysisRequestSchema = z.object({
  idea: IdeaInputSchema,
  userId: z.string().uuid("Invalid user ID format").optional(),
  authToken: z.string().min(10).optional(),
});

// 3. Semantic Competitor Record Schema
export const CompetitorItemSchema = z.object({
  name: z.string().trim().min(1, "Competitor name required").max(120),
  strength: z.string().trim().min(1).max(1000),
  weakness: z.string().trim().min(1).max(1000),
  gap: z.string().trim().min(1).max(1000),
  description: z.string().trim().max(1500).optional(),
  category: z.string().trim().max(100).optional(),
  semanticSimilarity: z.number().min(-1).max(1).optional(),
  quadrant: z.string().optional(),
  clusterId: z.number().int().nonnegative().optional(),
  coordinates: z
    .object({
      x: z.number().finite(),
      y: z.number().finite(),
    })
    .optional(),
});

// 4. Cluster & PCA Result Schema
export const ClusterInfoSchema = z.object({
  clusterId: z.number().int().nonnegative(),
  label: z.string().min(1),
  size: z.number().int().nonnegative(),
  centroidCoordinates: z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
  memberNames: z.array(z.string()),
  intraClusterSimilarity: z.number().finite(),
});

export const ExplainedVarianceSchema = z.object({
  pc1Ratio: z.number().min(0).max(1),
  pc2Ratio: z.number().min(0).max(1),
  cumulativeRatio: z.number().min(0).max(1),
});

// 5. Positioning Scores Schema
export const PositioningScoresSchema = z.object({
  crowdednessScore: z.number().min(0).max(100),
  differentiationScore: z.number().min(0).max(100),
  whitespaceOpportunityScore: z.number().min(0).max(100),
  topCompetitorSimilarity: z.number().min(0).max(100),
  averageCompetitorSimilarity: z.number().min(0).max(100),
  marketDensity: z.enum([
    "Blue Ocean",
    "Emerging",
    "Moderately Contested",
    "Highly Crowded",
    "Insufficient Evidence",
  ]),
  evidenceCoverage: z.number().min(0).max(100),
  insufficientEvidence: z.boolean(),
  scoreBreakdown: z.object({
    top3MeanSimilarity: z.number().finite(),
    highestSimilarity: z.number().finite(),
    clusterDensity: z.number().finite(),
    competitorCountPenalty: z.number().finite(),
  }),
});

// 6. Complete Market Positioning Result Schema
export const MarketPositioningResultSchema = z.object({
  ideaCoordinates: z.object({
    x: z.number().finite(),
    y: z.number().finite(),
  }),
  competitors: z.array(CompetitorItemSchema),
  clusters: z.array(ClusterInfoSchema),
  explainedVariance: ExplainedVarianceSchema,
  scores: PositioningScoresSchema,
  quadrants: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      competitorCount: z.number().int().nonnegative(),
    })
  ),
  methodologyNotes: z.string().min(10),
});

// 7. Validation Factor Schema
export const ValidationFactorSchema = z.object({
  factor: z.string().min(1),
  score: z.number().min(0).max(100),
  reason: z.string().min(1),
  improvement: z.string().min(1),
});

// 8. Full Startup Report Schema
export const StartupReportSchema = z.object({
  title: z.string().min(1, "Report title is required"),
  summary: z.string().min(10, "Summary must be substantive"),
  executiveSummary: z.object({
    oneLineSummary: z.string().min(5),
    startupStage: z.string().min(1),
    biggestStrength: z.string().min(1),
    biggestRisk: z.string().min(1),
    next30Days: z.array(z.string()).min(1),
    next90Days: z.array(z.string()).min(1),
    founderChecklist: z.array(z.string()).min(1),
  }),
  validation: z
    .object({
      overallScore: z.number().min(0).max(100),
      readiness: z.string().min(1),
      confidence: z.string().min(1),
      factors: z.array(ValidationFactorSchema).min(1),
    })
    .optional(),
  market: z.object({
    insight: z.string().min(5),
    trends: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.number().finite(),
        })
      )
      .min(1),
    opportunities: z.array(z.string()).min(1),
  }),
  competitors: z.array(CompetitorItemSchema).min(1, "At least 1 competitor record is required"),
  competitorMatrix: z.object({
    features: z.array(z.string()).min(1),
    competitors: z
      .array(
        z.object({
          name: z.string().min(1),
          values: z.array(z.union([z.string(), z.number(), z.boolean()])),
        })
      )
      .min(1),
  }),
  business: z.object({
    primaryModel: z.string().min(1),
    revenueStreams: z.array(z.string()).min(1),
    pricingStrategy: z.array(z.string()).min(1),
    profitOutlook: z.string().min(1),
    costRisk: z.string().min(1),
    breakEven: z.string().min(1),
    researchBasis: z.string().min(1),
    chart: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.number().finite(),
        })
      )
      .min(1),
  }),
  costEstimator: z.object({
    developmentCost: z.string().min(1),
    monthlyOperatingCost: z.string().min(1),
    aiApiCost: z.string().min(1),
    cloudCost: z.string().min(1),
    teamNeeded: z.array(z.string()).min(1),
    timeToMvp: z.string().min(1),
    breakEvenEstimate: z.string().min(1),
  }),
  mvp: z.object({
    coreFeatures: z.array(z.string()).min(1),
    nonEssentialFeatures: z.array(z.string()).min(1),
    developmentStages: z.array(z.string()).min(1),
    architectureSuggestion: z.string().min(1),
  }),
  technicalBlueprint: z.object({
    systemOverview: z.string().min(1),
    recommendedStack: z.record(z.string(), z.string()),
    apisToBuild: z.array(
      z.object({
        endpoint: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        payload: z.string().optional(),
        auth: z.string().optional(),
      })
    ),
    databaseSchema: z.array(
      z.object({
        name: z.string().optional(),
        tableName: z.string().optional(),
        fields: z.array(z.string()).optional(),
        columns: z.array(z.string()).optional(),
      })
    ),
    securityChecklist: z.array(z.string()).min(1),
    scalabilityBottlenecks: z.array(z.string()).min(1),
  }),
  techStack: z.object({
    frontend: z.array(z.string()).min(1),
    backend: z.array(z.string()).min(1),
    database: z.array(z.string()).min(1),
    devOps: z.array(z.string()).min(1),
    aiServices: z.array(z.string()).min(1),
  }),
  security: z.object({
    score: z.number().min(0).max(100),
    posture: z.string().min(1),
    criticalRisks: z.array(z.string()).min(1),
    complianceRequirements: z.array(z.string()).min(1),
    dataProtectionPractices: z.array(z.string()).min(1),
  }),
  swot: z.object({
    strengths: z.array(z.string()).min(1),
    weaknesses: z.array(z.string()).min(1),
    opportunities: z.array(z.string()).min(1),
    threats: z.array(z.string()).min(1),
  }),
  opportunityRadar: z.object({
    marketExpansionScore: z.number().min(0).max(100),
    aiMoatStrength: z.number().min(0).max(100),
    disruptionIndex: z.number().min(0).max(100),
    regulatoryEase: z.number().min(0).max(100),
    acquisitionAppeal: z.number().min(0).max(100),
    growthMultiplier: z.number().min(0).max(100),
  }),
  roadmap: z.object({
    phases: z
      .array(
        z.object({
          name: z.string().min(1),
          duration: z.string().min(1),
          milestones: z.array(z.string()).min(1),
        })
      )
      .min(1),
  }),
  pitch: z.object({
    short: z.string().min(1),
    investor: z.string().min(1),
    hackathon: z.string().min(1),
    questions: z.array(z.string()).min(1),
  }),
  pitchDeck: z.object({
    slides: z
      .array(
        z.object({
          title: z.string().min(1),
          subtitle: z.string().min(1),
          bullets: z.array(z.string()).min(1),
        })
      )
      .min(1),
  }),
  investorReadiness: z.object({
    score: z.number().min(0).max(100),
    stage: z.string().min(1),
    strengths: z.array(z.string()).min(1),
    weaknesses: z.array(z.string()).min(1),
    investorConcerns: z.array(z.string()).min(1),
    recommendations: z.array(z.string()).min(1),
    fundingFit: z.string().min(1),
  }),
  branding: z.object({
    startupName: z.string().min(1),
    tagline: z.string().min(1),
    brandPersonality: z.string().min(1),
    colorPalette: z.object({
      primary: z.string().min(1),
      secondary: z.string().min(1),
      accent: z.string().min(1),
    }),
    typography: z.object({
      heading: z.string().min(1),
      body: z.string().min(1),
    }),
    logoPrompt: z.string().min(1),
    domainSuggestions: z.array(z.string()).min(1),
    socialHandles: z.array(z.string()).min(1),
  }),
  goToMarket: z.object({
    targetBeachhead: z.string().min(1),
    launchChannels: z.array(z.string()).min(1),
    first100Users: z.array(z.string()).min(1),
    marketingAngles: z.array(z.string()).min(1),
    partnerships: z.array(z.string()).min(1),
    growthLoops: z.array(z.string()).min(1),
  }),
  // Optional ML Semantic Positioning Result
  marketPositioning: MarketPositioningResultSchema.optional(),
});

// 9. User Feedback Schema (Privacy-Conscious)
export const FeedbackInputSchema = z.object({
  reportId: z.string().max(100).optional(),
  usefulnessScore: z.number().int().min(1).max(5),
  competitorsRelevant: z.boolean(),
  positioningReasonable: z.boolean(),
  containsUnsupportedClaims: z.boolean(),
  confusingOrMissingFeatures: z.string().trim().max(1000).optional(),
});
