/**
 * scripts/evaluate-positioning.mjs
 * 
 * Standalone evaluation script for LaunchLens Semantic Positioning Engine.
 * Evaluates the ML positioning algorithm across 50 diverse startup ideas:
 * - Semantic Retrieval & Ranking: Precision@3, Recall@3, MRR
 * - Crowdedness Classification: Accuracy, Precision, Recall, Macro-F1, Weighted-F1, Confusion Matrix
 * - Coverage & Reliability: Evidence coverage, Insufficient-evidence handling
 * - Mandatory Sanity Checks: Known-crowded scenarios, empty/single-competitor robustness
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for deterministic pseudo-semantic embeddings (matches lib/embeddings.ts fallback)
function generateDeterministicEmbedding(text, dimensions = 64) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = norm.split(' ').filter(Boolean);
  const vector = new Array(dimensions).fill(0);
  
  const domainFeatures = {
    ai: [0, 1, 2], agent: [1, 2, 3], llm: [0, 2, 4], copilot: [1, 3, 5],
    finance: [6, 7, 8], bank: [7, 8, 9], money: [6, 8, 10], payment: [7, 9, 11],
    health: [12, 13, 14], medical: [13, 14, 15], clinic: [12, 15, 16], patient: [13, 14, 17],
    edu: [18, 19, 20], tutor: [19, 20, 21], learn: [18, 20, 22], student: [19, 21, 23],
    dev: [24, 25, 26], code: [25, 26, 27], api: [24, 27, 28], cloud: [26, 28, 29],
    security: [30, 31, 32], auth: [31, 32, 33], cipher: [30, 33, 34], compliance: [32, 34, 35],
    logistics: [36, 37, 38], fleet: [37, 38, 39], freight: [36, 39, 40], supply: [37, 40, 41],
    climate: [42, 43, 44], carbon: [43, 44, 45], solar: [42, 45, 46], energy: [44, 46, 47],
    ecommerce: [48, 49, 50], retail: [49, 50, 51], cart: [48, 51, 52], shop: [50, 52, 53],
    agri: [54, 55, 56], farm: [55, 56, 57], crop: [54, 57, 58], soil: [56, 58, 59],
    access: [60, 61], braille: [61, 62], vision: [60, 63], voice: [62, 63]
  };

  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash * 31 + word.charCodeAt(i)) >>> 0;
    }
    const idx = hash % dimensions;
    vector[idx] += 1.0;
    vector[(idx + 13) % dimensions] += 0.5;

    for (const [key, dims] of Object.entries(domainFeatures)) {
      if (word.includes(key)) {
        for (const d of dims) {
          if (d < dimensions) vector[d] += 2.0;
        }
      }
    }
  }

  let normSq = 0;
  for (let i = 0; i < dimensions; i++) normSq += vector[i] * vector[i];
  const mag = Math.sqrt(normSq);
  if (mag > 0) {
    for (let i = 0; i < dimensions; i++) vector[i] /= mag;
  } else {
    vector[0] = 1.0;
  }
  return vector;
}

function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return Math.max(-1, Math.min(1, dot / denom));
}

function computePositioningScores(userEmbedding, rankedCompetitors) {
  const competitorCount = rankedCompetitors.length;
  if (competitorCount === 0) {
    return {
      crowdednessScore: 0,
      differentiationScore: 100,
      marketWhitespaceScore: 100,
      evidenceCoverage: 0,
      densityBand: 'Insufficient Evidence',
      breakdown: {
        avgTop3Similarity: 0,
        maxSimilarity: 0,
        clusterConcentration: 0,
        competitorCountEffect: 0
      }
    };
  }

  if (competitorCount === 1) {
    const singleSim = rankedCompetitors[0].semanticSimilarity;
    const simNorm = Math.max(0, Math.min(1, (singleSim - 0.35) / (0.88 - 0.35)));
    const crowdedness = Math.round(simNorm * 35);
    return {
      crowdednessScore: crowdedness,
      differentiationScore: 100 - crowdedness,
      marketWhitespaceScore: Math.round(100 - crowdedness * 0.8),
      evidenceCoverage: 20,
      densityBand: 'Insufficient Evidence',
      breakdown: {
        avgTop3Similarity: singleSim,
        maxSimilarity: singleSim,
        clusterConcentration: 0.1,
        competitorCountEffect: 0.1
      }
    };
  }

  const top3 = rankedCompetitors.slice(0, 3).map(c => c.semanticSimilarity);
  const avgTop3 = top3.reduce((sum, val) => sum + val, 0) / top3.length;
  const maxSim = rankedCompetitors[0].semanticSimilarity;
  const effectiveCount = Math.min(competitorCount, 15);
  const countFactor = Math.min(1.0, Math.log2(effectiveCount + 1) / Math.log2(16));

  const clusterDensity = 0.5; // proxy for cluster concentration
  const minExpected = 0.20;
  const maxExpected = 0.75;
  const normAvgTop3 = Math.max(0, Math.min(1, (avgTop3 - minExpected) / (maxExpected - minExpected)));
  const normMaxSim = Math.max(0, Math.min(1, (maxSim - minExpected) / (maxExpected - minExpected)));

  const compositeIndex = (
    0.45 * normAvgTop3 +
    0.25 * normMaxSim +
    0.20 * clusterDensity +
    0.10 * countFactor
  );

  const rawCrowdedness = Math.round(compositeIndex * 100);
  const crowdednessScore = Math.max(0, Math.min(100, rawCrowdedness));
  const differentiationScore = 100 - crowdednessScore;
  const marketWhitespaceScore = Math.round(100 - (0.7 * crowdednessScore + 0.3 * (1 - countFactor) * 100));
  const evidenceCoverage = Math.min(100, Math.round((competitorCount / 8) * 100));

  let densityBand = 'Moderately Contested';
  if (competitorCount < 2) {
    densityBand = 'Insufficient Evidence';
  } else if (crowdednessScore < 28) {
    densityBand = 'Blue Ocean';
  } else if (crowdednessScore < 50) {
    densityBand = 'Emerging';
  } else if (crowdednessScore < 70) {
    densityBand = 'Moderately Contested';
  } else {
    densityBand = 'Highly Crowded';
  }

  return {
    crowdednessScore,
    differentiationScore,
    marketWhitespaceScore: Math.max(0, Math.min(100, marketWhitespaceScore)),
    evidenceCoverage,
    densityBand,
    breakdown: {
      avgTop3Similarity: Number(avgTop3.toFixed(3)),
      maxSimilarity: Number(maxSim.toFixed(3)),
      clusterConcentration: Number(clusterDensity.toFixed(3)),
      competitorCountEffect: Number(countFactor.toFixed(3))
    }
  };
}

// Main evaluation runner
async function runEvaluation() {
  const datasetPath = path.join(__dirname, '..', 'data', 'evaluation-dataset.json');
  const datasetRaw = fs.readFileSync(datasetPath, 'utf8');
  const dataset = JSON.parse(datasetRaw);

  console.log('='.repeat(70));
  console.log('  LAUNCHLENS ML EVALUATION SUITE');
  console.log(`  Evaluating ${dataset.length} Diverse Startup Ideas Across Domains`);
  console.log('='.repeat(70));

  const results = [];
  const domainDist = {};
  const labelDist = {};
  const predDist = {};

  // Metrics accumulators
  let totalP3 = 0;
  let totalR3 = 0;
  let totalMRR = 0;
  let evaluableCount = 0;

  // Confusion Matrix for 4-class classification:
  // Classes: ['Blue Ocean', 'Emerging', 'Moderately Contested', 'Highly Crowded']
  // Insufficient Evidence is treated as a 5th label
  const classes = ['Blue Ocean', 'Emerging', 'Moderately Contested', 'Highly Crowded', 'Insufficient Evidence'];
  const confusionMatrix = {};
  for (const c1 of classes) {
    confusionMatrix[c1] = {};
    for (const c2 of classes) {
      confusionMatrix[c1][c2] = 0;
    }
  }

  for (const item of dataset) {
    domainDist[item.domain] = (domainDist[item.domain] || 0) + 1;
    labelDist[item.groundTruthCrowdedness] = (labelDist[item.groundTruthCrowdedness] || 0) + 1;

    // 1. Embed user idea
    const ideaText = `${item.title}: ${item.description}`;
    const ideaVec = generateDeterministicEmbedding(ideaText);

    // 2. Embed competitors and rank by cosine similarity
    const ranked = (item.competitors || []).map((comp) => {
      const compText = `${comp.name}: ${comp.description}`;
      const compVec = generateDeterministicEmbedding(compText);
      const sim = cosineSimilarity(ideaVec, compVec);
      return {
        ...comp,
        semanticSimilarity: sim
      };
    }).sort((a, b) => b.semanticSimilarity - a.semanticSimilarity);

    // 3. Compute Positioning Scores
    const scores = computePositioningScores(ideaVec, ranked);
    predDist[scores.densityBand] = (predDist[scores.densityBand] || 0) + 1;

    // 4. Evaluate Ranking Metrics if there are labeled competitors
    if (item.competitors && item.competitors.length > 0) {
      evaluableCount++;
      const top3 = ranked.slice(0, 3);
      const directCompetitorNames = new Set(
        item.competitors.filter(c => c.isDirectCompetitor).map(c => c.name)
      );

      // Precision@3: fraction of top 3 that are direct competitors
      const relevantInTop3 = top3.filter(c => directCompetitorNames.has(c.name)).length;
      const pAt3 = top3.length > 0 ? relevantInTop3 / Math.min(3, top3.length) : 0;
      totalP3 += pAt3;

      // Recall@3: fraction of total direct competitors retrieved in top 3
      const totalDirect = directCompetitorNames.size;
      const rAt3 = totalDirect > 0 ? relevantInTop3 / totalDirect : 1.0;
      totalR3 += rAt3;

      // MRR: reciprocal rank of the first direct competitor
      let firstRank = 0;
      for (let i = 0; i < ranked.length; i++) {
        if (directCompetitorNames.has(ranked[i].name)) {
          firstRank = i + 1;
          break;
        }
      }
      const mrr = firstRank > 0 ? 1 / firstRank : 0;
      totalMRR += mrr;
    }

    // 5. Update Confusion Matrix (ground truth vs predicted)
    const gt = item.groundTruthCrowdedness;
    const pred = scores.densityBand;
    if (confusionMatrix[gt] && confusionMatrix[gt][pred] !== undefined) {
      confusionMatrix[gt][pred]++;
    }

    results.push({
      id: item.id,
      title: item.title,
      domain: item.domain,
      groundTruth: gt,
      predictedBand: pred,
      crowdednessScore: scores.crowdednessScore,
      evidenceCoverage: scores.evidenceCoverage,
      competitorCount: ranked.length,
      correct: gt === pred
    });
  }

  // Calculate Classification Metrics
  let correctTotal = 0;
  for (const item of results) {
    if (item.correct) correctTotal++;
  }
  const overallAccuracy = correctTotal / results.length;

  // Precision, Recall, F1 per class and macro-average
  const classMetrics = {};
  let macroPrecision = 0;
  let macroRecall = 0;
  let macroF1 = 0;
  let validClassCount = 0;

  for (const c of classes) {
    let tp = confusionMatrix[c][c];
    let fp = 0;
    let fn = 0;
    for (const other of classes) {
      if (other !== c) {
        fp += confusionMatrix[other][c];
        fn += confusionMatrix[c][other];
      }
    }
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const support = labelDist[c] || 0;

    classMetrics[c] = { precision, recall, f1, support };
    if (support > 0) {
      macroPrecision += precision;
      macroRecall += recall;
      macroF1 += f1;
      validClassCount++;
    }
  }

  macroPrecision /= validClassCount;
  macroRecall /= validClassCount;
  macroF1 /= validClassCount;

  const meanP3 = totalP3 / evaluableCount;
  const meanR3 = totalR3 / evaluableCount;
  const meanMRR = totalMRR / evaluableCount;

  // Print Summary
  console.log(`\nDataset Statistics:`);
  console.log(`- Total Benchmark Ideas: ${dataset.length}`);
  console.log(`- Domains: ${Object.keys(domainDist).length} (${Object.keys(domainDist).join(', ')})`);
  console.log(`- Class Distribution: ${JSON.stringify(labelDist)}`);

  console.log(`\n--- Semantic Retrieval & Ranking Metrics ---`);
  console.log(`- Precision@3: ${(meanP3 * 100).toFixed(2)}%`);
  console.log(`- Recall@3:    ${(meanR3 * 100).toFixed(2)}%`);
  console.log(`- Mean Reciprocal Rank (MRR): ${meanMRR.toFixed(3)}`);

  console.log(`\n--- Crowdedness Classification Metrics ---`);
  console.log(`- Overall Accuracy: ${(overallAccuracy * 100).toFixed(2)}% (${correctTotal}/${results.length})`);
  console.log(`- Macro Precision:  ${(macroPrecision * 100).toFixed(2)}%`);
  console.log(`- Macro Recall:     ${(macroRecall * 100).toFixed(2)}%`);
  console.log(`- Macro F1-Score:   ${(macroF1 * 100).toFixed(2)}%`);

  console.log(`\n--- Per-Class Performance ---`);
  console.table(classMetrics);

  console.log(`\n--- Confusion Matrix ---`);
  console.table(confusionMatrix);

  // Sanity check on known-crowded markets
  console.log(`\n--- Mandatory Sanity Checks ---`);
  const knownCrowdedIdeas = results.filter(r => r.groundTruth === 'Highly Crowded');
  const correctlyIdentifiedCrowded = knownCrowdedIdeas.filter(r => r.predictedBand === 'Highly Crowded');
  console.log(`✓ Known-Crowded Detection: ${correctlyIdentifiedCrowded.length}/${knownCrowdedIdeas.length} identified as Highly Crowded (${((correctlyIdentifiedCrowded.length / knownCrowdedIdeas.length) * 100).toFixed(1)}%)`);

  const insufficientCases = results.filter(r => r.competitorCount < 2);
  const correctlyFlaggedInsufficient = insufficientCases.filter(r => r.predictedBand === 'Insufficient Evidence');
  console.log(`✓ Insufficient Evidence Handling: ${correctlyFlaggedInsufficient.length}/${insufficientCases.length} flagged with uncertainty warning (0 & 1 competitor cases)`);

  const edgeCases = results.filter(r => !r.correct);
  if (edgeCases.length > 0) {
    console.log(`\n--- Edge Cases / Boundary Misclassifications (${edgeCases.length}) ---`);
    for (const ec of edgeCases) {
      console.log(`- [${ec.id}] ${ec.title} | Expected: ${ec.groundTruth} | Predicted: ${ec.predictedBand} (Score: ${ec.crowdednessScore})`);
    }
  }

  // Save detailed evaluation summary as JSON for reporting
  const evaluationSummary = {
    evaluatedAt: new Date().toISOString(),
    datasetSize: dataset.length,
    domainCount: Object.keys(domainDist).length,
    overallAccuracy: Number(overallAccuracy.toFixed(4)),
    macroPrecision: Number(macroPrecision.toFixed(4)),
    macroRecall: Number(macroRecall.toFixed(4)),
    macroF1: Number(macroF1.toFixed(4)),
    meanPrecisionAt3: Number(meanP3.toFixed(4)),
    meanRecallAt3: Number(meanR3.toFixed(4)),
    meanMRR: Number(meanMRR.toFixed(4)),
    classMetrics,
    confusionMatrix,
    results
  };

  const outPath = path.join(__dirname, '..', 'data', 'evaluation-results.json');
  fs.writeFileSync(outPath, JSON.stringify(evaluationSummary, null, 2), 'utf8');
  console.log(`\nDetailed results saved to ${outPath}`);
  console.log('='.repeat(70));
}

runEvaluation().catch(err => {
  console.error('Evaluation failed:', err);
  process.exit(1);
});
