import {
  ClusterInfo,
  CompetitorInput,
  ConfidenceLevel,
  ExplainedVariance,
  MarketDensityBand,
  MarketPositioningResult,
  MarketPositioningSummary,
  PositionedEntity,
  PositioningScores,
  StartupIdeaInput,
} from "@/types/positioning";
import { generateEmbeddings, normalizeEmbeddingText } from "@/lib/embeddings";

/**
 * Computes standard Cosine Similarity between two numerical vectors.
 * Returns a value in [0, 1] for semantic vectors, or 0 if inputs are malformed.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) {
    return 0;
  }

  const length = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA <= 0 || normB <= 0) {
    return 0;
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  // Bound to [-1, 1], and clamp negative similarities to 0 for text embedding space
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Deterministic Pseudo-Random Number Generator (PRNG) for reproducible K-Means clustering.
 */
function createDeterministicRandom(seed = 42) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Lightweight PCA using Gram matrix eigendecomposition via Power Iteration.
 * Projects N high-dimensional vectors to 2D coordinates {x, y} and computes explained variance.
 */
export function projectTo2DCoordinates(
  vectors: number[][],
  similaritiesToStartup: number[]
): { coordinates: { x: number; y: number }[]; variance: ExplainedVariance } {
  const n = vectors.length;
  if (n === 0) {
    return {
      coordinates: [],
      variance: { pc1Variance: 0, pc2Variance: 0, totalVariancePreserved: 0 },
    };
  }
  if (n === 1) {
    return {
      coordinates: [{ x: 0, y: 0 }],
      variance: { pc1Variance: 1, pc2Variance: 0, totalVariancePreserved: 1 },
    };
  }

  const dim = vectors[0].length;

  // 1. Center the vectors
  const mean = new Float64Array(dim);
  for (let i = 0; i < n; i++) {
    for (let d = 0; d < dim; d++) {
      mean[d] += vectors[i][d];
    }
  }
  for (let d = 0; d < dim; d++) {
    mean[d] /= n;
  }

  const centered: Float64Array[] = [];
  for (let i = 0; i < n; i++) {
    const v = new Float64Array(dim);
    for (let d = 0; d < dim; d++) {
      v[d] = vectors[i][d] - mean[d];
    }
    centered.push(v);
  }

  // 2. Compute the Gram matrix K of size n x n where K[i][j] = centered[i] . centered[j]
  const K: Float64Array[] = Array.from({ length: n }, () => new Float64Array(n));
  let totalTrace = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      let dot = 0;
      for (let d = 0; d < dim; d++) {
        dot += centered[i][d] * centered[j][d];
      }
      K[i][j] = dot;
      K[j][i] = dot;
      if (i === j) totalTrace += dot;
    }
  }

  // 3. Power iteration to find dominant eigenvector of Gram matrix
  function powerIteration(matrix: Float64Array[], iterations = 40): { vector: Float64Array; lambda: number } {
    let u = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      u[i] = (i % 2 === 0 ? 1 : -1) * (1 / Math.sqrt(n));
    }

    for (let iter = 0; iter < iterations; iter++) {
      const nextU = new Float64Array(n);
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          sum += matrix[i][j] * u[j];
        }
        nextU[i] = sum;
      }

      let norm = 0;
      for (let i = 0; i < n; i++) {
        norm += nextU[i] * nextU[i];
      }
      norm = Math.sqrt(norm);

      if (norm < 1e-12) {
        break;
      }

      for (let i = 0; i < n; i++) {
        u[i] = nextU[i] / norm;
      }
    }

    let lambda = 0;
    for (let i = 0; i < n; i++) {
      let Ku_i = 0;
      for (let j = 0; j < n; j++) {
        Ku_i += matrix[i][j] * u[j];
      }
      lambda += u[i] * Ku_i;
    }

    return { vector: u, lambda: Math.max(0, lambda) };
  }

  const pc1 = powerIteration(K);

  // Deflate matrix for 2nd principal component
  const K_deflated: Float64Array[] = Array.from({ length: n }, () => new Float64Array(n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      K_deflated[i][j] = K[i][j] - pc1.lambda * pc1.vector[i] * pc1.vector[j];
    }
  }

  const pc2 = powerIteration(K_deflated);

  const pc1Var = totalTrace > 1e-6 ? Math.min(1, pc1.lambda / totalTrace) : 0.5;
  const pc2Var = totalTrace > 1e-6 ? Math.min(1, pc2.lambda / totalTrace) : 0.3;
  const explainedVariance: ExplainedVariance = {
    pc1Variance: Math.round(pc1Var * 100) / 100,
    pc2Variance: Math.round(pc2Var * 100) / 100,
    totalVariancePreserved: Math.round(Math.min(1, pc1Var + pc2Var) * 100) / 100,
  };

  const rawCoords: { x: number; y: number }[] = [];
  const s1 = Math.sqrt(pc1.lambda);
  const s2 = Math.sqrt(pc2.lambda);

  const isDegenerate = s1 < 1e-4;

  if (isDegenerate || n < 3) {
    // Angular semantic dispersion fallback around startup at origin (0, 0)
    for (let i = 0; i < n; i++) {
      if (i === 0) {
        rawCoords.push({ x: 0, y: 0 });
      } else {
        const sim = similaritiesToStartup[i - 1] ?? 0.5;
        const radius = Math.max(20, Math.min(80, (1 - sim) * 110));
        const angle = ((i - 1) / (n - 1)) * 2 * Math.PI - Math.PI / 4;
        rawCoords.push({
          x: Math.round(radius * Math.cos(angle) * 10) / 10,
          y: Math.round(radius * Math.sin(angle) * 10) / 10,
        });
      }
    }
    return { coordinates: rawCoords, variance: explainedVariance };
  }

  for (let i = 0; i < n; i++) {
    rawCoords.push({
      x: pc1.vector[i] * s1,
      y: pc2.vector[i] * s2,
    });
  }

  // Scale coordinates to fit comfortable [-70, 70] box for charting
  let maxX = 0;
  let maxY = 0;
  for (const c of rawCoords) {
    maxX = Math.max(maxX, Math.abs(c.x));
    maxY = Math.max(maxY, Math.abs(c.y));
  }

  const scaleFactor = 70 / Math.max(maxX, maxY, 1e-4);

  const scaled = rawCoords.map((c) => ({
    x: Math.round(c.x * scaleFactor * 10) / 10,
    y: Math.round(c.y * scaleFactor * 10) / 10,
  }));

  return { coordinates: scaled, variance: explainedVariance };
}

/**
 * Deterministic K-Means clustering on embedding space using unit cosine distance.
 * Clusters competitors into K groups with cluster centroids and cohesion scores.
 */
export function kMeansClustering(
  competitorVectors: number[][],
  competitorNames: string[],
  coordinates: { x: number; y: number }[],
  k = 2,
  maxIterations = 20,
  seed = 42
): { clusterAssignments: number[]; clusters: ClusterInfo[] } {
  const n = competitorVectors.length;
  if (n === 0) return { clusterAssignments: [], clusters: [] };
  if (n <= k) {
    const singleClusters: ClusterInfo[] = competitorVectors.map((_, i) => ({
      clusterId: i,
      label: `Cluster ${i + 1}`,
      size: 1,
      centroidCoordinates: coordinates[i] || { x: 0, y: 0 },
      memberNames: [competitorNames[i]],
      averageIntraClusterSimilarity: 1.0,
    }));
    return {
      clusterAssignments: competitorVectors.map((_, i) => i),
      clusters: singleClusters,
    };
  }

  const dim = competitorVectors[0].length;
  const rng = createDeterministicRandom(seed);

  // 1. K-Means++ deterministic initialization
  const centroids: number[][] = [];
  const firstIdx = Math.floor(rng() * n);
  centroids.push([...competitorVectors[firstIdx]]);

  for (let c = 1; c < k; c++) {
    const distances = new Float64Array(n);
    let totalDist = 0;
    for (let i = 0; i < n; i++) {
      let minD = Infinity;
      for (const centroid of centroids) {
        const d = 1 - cosineSimilarity(competitorVectors[i], centroid);
        minD = Math.min(minD, d * d);
      }
      distances[i] = minD;
      totalDist += minD;
    }

    let target = rng() * totalDist;
    let chosenIdx = 0;
    for (let i = 0; i < n; i++) {
      target -= distances[i];
      if (target <= 0) {
        chosenIdx = i;
        break;
      }
    }
    centroids.push([...competitorVectors[chosenIdx]]);
  }

  // 2. Lloyd's algorithm iterations
  let assignments = new Int32Array(n);

  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;

    // Assign to closest centroid
    for (let i = 0; i < n; i++) {
      let bestCluster = 0;
      let highestSim = -1;
      for (let c = 0; c < k; c++) {
        const sim = cosineSimilarity(competitorVectors[i], centroids[c]);
        if (sim > highestSim) {
          highestSim = sim;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed && iter > 0) break;

    // Recompute centroids
    for (let c = 0; c < k; c++) {
      const clusterMembers = competitorVectors.filter((_, idx) => assignments[idx] === c);
      if (clusterMembers.length === 0) continue;

      const newCentroid = new Float64Array(dim);
      for (const vec of clusterMembers) {
        for (let d = 0; d < dim; d++) {
          newCentroid[d] += vec[d];
        }
      }
      // Normalize
      let sumSq = 0;
      for (let d = 0; d < dim; d++) {
        newCentroid[d] /= clusterMembers.length;
        sumSq += newCentroid[d] * newCentroid[d];
      }
      const norm = Math.sqrt(sumSq);
      if (norm > 0) {
        for (let d = 0; d < dim; d++) {
          newCentroid[d] /= norm;
        }
      }
      centroids[c] = Array.from(newCentroid);
    }
  }

  // 3. Formulate ClusterInfo results
  const clusterLabels = [
    "Direct Contenders & Feature Clones",
    "Adjacent Vertical Competitors",
    "Enterprise & Platform Incumbents",
  ];

  const clusters: ClusterInfo[] = [];
  for (let c = 0; c < k; c++) {
    const memberIndices = competitorVectors.map((_, idx) => idx).filter((idx) => assignments[idx] === c);
    if (memberIndices.length === 0) continue;

    let avgCoordX = 0;
    let avgCoordY = 0;
    let intraSimSum = 0;
    let pairCount = 0;

    for (let i = 0; i < memberIndices.length; i++) {
      const idxA = memberIndices[i];
      avgCoordX += coordinates[idxA]?.x || 0;
      avgCoordY += coordinates[idxA]?.y || 0;

      for (let j = i + 1; j < memberIndices.length; j++) {
        const idxB = memberIndices[j];
        intraSimSum += cosineSimilarity(competitorVectors[idxA], competitorVectors[idxB]);
        pairCount++;
      }
    }

    const intraSim = pairCount > 0 ? intraSimSum / pairCount : 0.85;

    clusters.push({
      clusterId: c,
      label: clusterLabels[c % clusterLabels.length],
      size: memberIndices.length,
      centroidCoordinates: {
        x: Math.round((avgCoordX / memberIndices.length) * 10) / 10,
        y: Math.round((avgCoordY / memberIndices.length) * 10) / 10,
      },
      memberNames: memberIndices.map((idx) => competitorNames[idx]),
      averageIntraClusterSimilarity: Math.round(intraSim * 100) / 100,
    });
  }

  return {
    clusterAssignments: Array.from(assignments),
    clusters,
  };
}

/**
 * Assigns descriptive quadrant label based on 2D coordinates and semantic similarity.
 */
function assignQuadrant(x: number, y: number, similarity: number): string {
  if (similarity >= 0.82) {
    return "Direct Contender";
  }
  if (x >= 0 && y >= 0) {
    return "Feature Convergence";
  }
  if (x < 0 && y >= 0) {
    return "Differentiated Challenger";
  }
  if (x < 0 && y < 0) {
    return "Niche Alternative";
  }
  return "Structural Incumbent";
}

/**
 * Computes defensible market crowdedness and differentiation scores.
 *
 * Mathematical Formula:
 *  - Top-3 Mean Similarity (45% weight)
 *  - Max Single Competitor Similarity (25% weight)
 *  - Primary Cluster Concentration / Intra-similarity (20% weight)
 *  - Logarithmic Competitor Count Factor (10% weight)
 *
 * Normalized to 0–100 scale:
 *  - 0–25: Blue Ocean / Uncontested
 *  - 26–50: Emerging / Low Density
 *  - 51–75: Moderately Contested
 *  - 76–100: Highly Saturated / Crowded Market
 *  - Insufficient Evidence flag when N < 2
 */
export function computePositioningScores(
  competitorSimilarities: number[],
  clusterInertia = 0.5,
  competitorCount = 0
): PositioningScores {
  const n = competitorSimilarities.length;

  if (n < 2) {
    return {
      crowdednessScore: 20,
      differentiationScore: 80,
      whitespaceOpportunityScore: 75,
      topCompetitorSimilarity: competitorSimilarities[0] ? Math.round(competitorSimilarities[0] * 100) : 0,
      averageCompetitorSimilarity: competitorSimilarities[0] ? Math.round(competitorSimilarities[0] * 100) : 0,
      marketDensity: "Insufficient Evidence",
      evidenceCoverage: Math.round((n / 5) * 100),
      insufficientEvidence: true,
      scoreBreakdown: {
        top3MeanSimilarity: 0,
        highestSimilarity: 0,
        clusterDensity: 0,
        competitorCountPenalty: 0,
      },
    };
  }

  // Sort descending
  const sorted = [...competitorSimilarities].sort((a, b) => b - a);
  const topCount = Math.min(3, sorted.length);
  const topSimilarities = sorted.slice(0, topCount);

  const meanTopSim = topSimilarities.reduce((sum, v) => sum + v, 0) / topCount;
  const highestSim = sorted[0];
  const allMeanSim = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;

  // Calibration range: active cosine similarity bounds [0.20, 0.75]
  const minExpected = 0.20;
  const maxExpected = 0.75;

  const normTopSim = Math.max(0, Math.min(1, (meanTopSim - minExpected) / (maxExpected - minExpected)));
  const normHighestSim = Math.max(0, Math.min(1, (highestSim - minExpected) / (maxExpected - minExpected)));

  // Logarithmic competitor count factor (reaches 1.0 at 6+ competitors)
  const countFactor = Math.min(1.0, Math.log(1 + n) / Math.log(1 + 6));
  const clusterDensity = Math.max(0, Math.min(1, clusterInertia));

  // Weighted composite formula:
  // 45% Top-3 similarity + 25% Highest similarity + 20% Cluster density + 10% Competitor count
  const compositeScore =
    0.45 * normTopSim +
    0.25 * normHighestSim +
    0.20 * clusterDensity +
    0.10 * countFactor;

  const crowdednessScore = Math.round(Math.max(0, Math.min(1, compositeScore)) * 100);
  const differentiationScore = Math.max(0, 100 - crowdednessScore);
  const evidenceCoverage = Math.min(100, Math.round((n / 5) * 100));

  // Whitespace opportunity: inverse of highest similarity scaled by evidence confidence
  const whitespaceOpportunityScore = Math.round(
    Math.max(5, Math.min(95, (1 - normHighestSim) * 100 * (evidenceCoverage / 100)))
  );

  let marketDensity: MarketDensityBand = "Moderately Contested";
  if (crowdednessScore >= 70) {
    marketDensity = "Highly Crowded";
  } else if (crowdednessScore >= 50) {
    marketDensity = "Moderately Contested";
  } else if (crowdednessScore >= 25) {
    marketDensity = "Emerging";
  } else {
    marketDensity = "Blue Ocean";
  }

  return {
    crowdednessScore,
    differentiationScore,
    whitespaceOpportunityScore,
    topCompetitorSimilarity: Math.round(highestSim * 100),
    averageCompetitorSimilarity: Math.round(allMeanSim * 100),
    marketDensity,
    evidenceCoverage,
    insufficientEvidence: false,
    scoreBreakdown: {
      top3MeanSimilarity: Math.round(normTopSim * 100),
      highestSimilarity: Math.round(normHighestSim * 100),
      clusterDensity: Math.round(clusterDensity * 100),
      competitorCountPenalty: Math.round(countFactor * 100),
    },
  };
}

/**
 * End-to-end Machine Learning Positioning Engine.
 * 1. Sanitizes inputs
 * 2. Generates semantic embeddings with caching & fallback
 * 3. Calculates pairwise cosine similarities
 * 4. Ranks competitors by semantic proximity
 * 5. Performs PCA 2D projection with variance explained
 * 6. Performs deterministic K-Means clustering
 * 7. Calculates interpretable, documented crowdedness scores
 */
export async function analyzeMarketPositioning(
  startup: StartupIdeaInput,
  competitors: CompetitorInput[]
): Promise<MarketPositioningResult> {
  const startupText = `${startup.name}. ${startup.description} ${startup.industry || ""} ${
    startup.targetUsers || ""
  }`;

  // Filter & deduplicate competitors
  const seenNames = new Set<string>();
  const validCompetitors = competitors.filter((c) => {
    if (!c.name || !c.description) return false;
    const norm = c.name.toLowerCase().trim();
    if (seenNames.has(norm)) return false;
    seenNames.add(norm);
    return true;
  });

  const competitorTexts = validCompetitors.map(
    (c) => `${c.name}. ${c.description} ${c.strength || ""} ${c.weakness || ""} ${c.gap || ""}`
  );

  const allTexts = [startupText, ...competitorTexts];
  const embeddingRes = await generateEmbeddings(allTexts);

  const startupVector = embeddingRes.embeddings[0];
  const competitorVectors = embeddingRes.embeddings.slice(1);

  // 1. Calculate Cosine Similarities against Startup
  const rawSimilarities = competitorVectors.map((v) => cosineSimilarity(startupVector, v));

  // 2. Rank Competitors by Similarity Descending
  const indexed = rawSimilarities.map((sim, idx) => ({ sim, idx }));
  indexed.sort((a, b) => b.sim - a.sim);

  // 3. Dimensionality Reduction (PCA to 2D)
  const { coordinates, variance } = projectTo2DCoordinates(
    embeddingRes.embeddings,
    rawSimilarities
  );

  const startupCoords = coordinates[0] || { x: 0, y: 0 };
  const competitorCoords = coordinates.slice(1);

  // 4. K-Means Clustering on Competitors
  const k = Math.min(3, Math.max(2, Math.floor(validCompetitors.length / 2)));
  const { clusterAssignments, clusters } = kMeansClustering(
    competitorVectors,
    validCompetitors.map((c) => c.name),
    competitorCoords,
    k
  );

  // 5. Calibrated Scores & Metrics
  const avgClusterIntraSim =
    clusters.length > 0
      ? clusters.reduce((sum, c) => sum + c.averageIntraClusterSimilarity, 0) / clusters.length
      : 0.6;

  const scores = computePositioningScores(rawSimilarities, avgClusterIntraSim, validCompetitors.length);

  // 6. Build Positioned Entities
  const startupEntity: PositionedEntity = {
    id: "startup-origin",
    name: startup.name || "Your Startup",
    description: startup.description,
    type: "startup",
    x: startupCoords.x,
    y: startupCoords.y,
    similarity: 1.0,
    similarityPercentage: 100,
    distance: 0,
    quadrant: "Core Value Proposition",
    color: "#06B6D4",
  };

  const competitorEntities: PositionedEntity[] = validCompetitors.map((c, idx) => {
    const sim = rawSimilarities[idx] ?? 0;
    const simPct = Math.round(sim * 100);
    const coords = competitorCoords[idx] || { x: 0, y: 0 };

    return {
      id: `competitor-${idx}-${c.name.toLowerCase().replace(/\s+/g, "-")}`,
      name: c.name,
      description: c.description,
      type: "competitor",
      x: coords.x,
      y: coords.y,
      similarity: Math.round(sim * 1000) / 1000,
      similarityPercentage: simPct,
      distance: Math.round((1 - sim) * 1000) / 1000,
      quadrant: assignQuadrant(coords.x, coords.y, sim),
      clusterId: clusterAssignments[idx],
      strength: c.strength,
      weakness: c.weakness,
      gap: c.gap,
      color: simPct >= 75 ? "#EF4444" : simPct >= 50 ? "#F59E0B" : "#10B981",
    };
  });

  // Sort competitor entities by similarity descending
  competitorEntities.sort((a, b) => b.similarity - a.similarity);

  // 7. Formulate Interpretive Summary
  let crowdednessLevel: MarketPositioningSummary["crowdednessLevel"] = "Moderate";
  if (scores.insufficientEvidence) {
    crowdednessLevel = "Insufficient Evidence";
  } else if (scores.crowdednessScore >= 70) {
    crowdednessLevel = "High";
  } else if (scores.crowdednessScore <= 30) {
    crowdednessLevel = "Low";
  }

  const differentiationLevel: MarketPositioningSummary["differentiationLevel"] =
    scores.differentiationScore >= 65 ? "High" : scores.differentiationScore >= 40 ? "Moderate" : "Low";

  const whitespaceLevel: MarketPositioningSummary["whitespaceLevel"] =
    scores.insufficientEvidence ? "Uncertain" : scores.whitespaceOpportunityScore >= 65 ? "Expansive" : "Moderate";

  const summary: MarketPositioningSummary = {
    crowdednessLevel,
    differentiationLevel,
    whitespaceLevel,
    verdict: scores.insufficientEvidence
      ? "Sparse competitor dataset retrieved (< 2 competitors). Results reflect low data coverage; further domain research recommended."
      : scores.crowdednessScore >= 70
      ? `High competitive density detected (${scores.crowdednessScore}/100). The market has strong incumbent convergence; sharp vertical differentiation is mandatory.`
      : scores.crowdednessScore <= 35
      ? `Blue ocean characteristics detected (${scores.crowdednessScore}/100 crowdedness). Low direct feature overlap among retrieved alternatives.`
      : `Moderate competitive space (${scores.crowdednessScore}/100 crowdedness). Market contains established alternatives but reveals identifiable whitespace gaps.`,
    recommendation:
      scores.crowdednessScore >= 70
        ? "Focus strictly on unserved sub-segments and specialized workflows to bypass direct feature parity battles with well-funded incumbents."
        : "Accelerate MVP customer interviews to claim identified whitespace before adjacent alternatives expand feature scope.",
  };

  const confidence: ConfidenceLevel =
    validCompetitors.length >= 4 ? "high" : validCompetitors.length >= 2 ? "medium" : "low";

  return {
    entities: [startupEntity, ...competitorEntities],
    startup: startupEntity,
    competitors: competitorEntities,
    clusters,
    pcaVariance: variance,
    scores,
    confidence,
    competitorCount: validCompetitors.length,
    summary,
    method: embeddingRes.method,
    timestamp: new Date().toISOString(),
  };
}

export const computeMarketPositioning = analyzeMarketPositioning;
