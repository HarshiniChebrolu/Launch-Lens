export type ConfidenceLevel = "high" | "medium" | "low";

export type EntityType = "startup" | "competitor";

export type MarketDensityBand =
  | "Blue Ocean"
  | "Emerging"
  | "Moderately Contested"
  | "Highly Crowded"
  | "Insufficient Evidence";

export interface CompetitorInput {
  name: string;
  description: string;
  strength?: string;
  weakness?: string;
  gap?: string;
  sourceUrl?: string;
}

export interface StartupIdeaInput {
  name: string;
  description: string;
  industry?: string;
  targetUsers?: string;
}

export interface PositionedEntity {
  id: string;
  name: string;
  description: string;
  type: EntityType;
  x: number;
  y: number;
  similarity: number; // Raw cosine similarity [0, 1]
  similarityPercentage: number; // Calibrated 0-100%
  distance: number; // 1 - similarity
  quadrant: string;
  clusterId?: number;
  color?: string;
  strength?: string;
  weakness?: string;
  gap?: string;
}

export interface ClusterInfo {
  clusterId: number;
  label: string;
  size: number;
  centroidCoordinates: { x: number; y: number };
  memberNames: string[];
  averageIntraClusterSimilarity: number;
}

export interface ExplainedVariance {
  pc1Variance: number;
  pc2Variance: number;
  totalVariancePreserved: number; // (pc1 + pc2) / total
}

export interface PositioningScores {
  crowdednessScore: number; // 0-100 scale
  differentiationScore: number; // 0-100 scale
  whitespaceOpportunityScore: number; // 0-100 scale
  topCompetitorSimilarity: number; // Max similarity %
  averageCompetitorSimilarity: number; // Mean similarity %
  marketDensity: MarketDensityBand;
  evidenceCoverage: number; // 0-100% data coverage indicator
  insufficientEvidence: boolean;
  scoreBreakdown?: {
    top3MeanSimilarity: number;
    highestSimilarity: number;
    clusterDensity: number;
    competitorCountPenalty: number;
  };
}

export interface MarketPositioningSummary {
  crowdednessLevel: "Low" | "Moderate" | "High" | "Insufficient Evidence";
  differentiationLevel: "Low" | "Moderate" | "High";
  whitespaceLevel: "Constrained" | "Moderate" | "Expansive" | "Uncertain";
  verdict: string;
  recommendation: string;
}

export interface MarketPositioningResult {
  entities: PositionedEntity[];
  startup: PositionedEntity;
  competitors: PositionedEntity[];
  clusters: ClusterInfo[];
  pcaVariance: ExplainedVariance;
  scores: PositioningScores;
  confidence: ConfidenceLevel;
  competitorCount: number;
  summary: MarketPositioningSummary;
  method: "gemini-embedding-004" | "fallback-embedding";
  timestamp: string;
}
