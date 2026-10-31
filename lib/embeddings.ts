import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

const EMBEDDING_MODEL_NAME = "text-embedding-004";
const VECTOR_DIMENSION = 768;
const MAX_BATCH_SIZE = 16;
const REQUEST_TIMEOUT_MS = 25000;
const MAX_CACHE_SIZE = 1500;

export interface EmbeddingOptions {
  batchSize?: number;
  timeoutMs?: number;
  taskType?: TaskType;
  skipCache?: boolean;
}

export interface EmbeddingsResponse {
  embeddings: number[][];
  method: "gemini-embedding-004" | "fallback-embedding";
  totalTokensApprox?: number;
  cacheHits?: number;
}

// Module-level in-memory LRU cache to avoid repeatedly embedding identical strings
const embeddingCache = new Map<string, number[]>();

export function getEmbeddingCacheStats() {
  return {
    size: embeddingCache.size,
    maxSize: MAX_CACHE_SIZE,
  };
}

export function clearEmbeddingCache() {
  embeddingCache.clear();
}

/**
 * Normalizes input text for reproducible embedding generation and caching.
 * Strips superfluous whitespace, normalizes casing, and caps length safely.
 */
export function normalizeEmbeddingText(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

/**
 * Deterministic pseudo-semantic fallback embedding generator.
 * Produces a normalized 768-dimensional float vector based on word & subword n-gram hashing
 * with frequency weighting. Preserves semantic overlap when API keys are absent or services fail.
 */
export function createFallbackEmbedding(text: string): number[] {
  const vector = new Float64Array(VECTOR_DIMENSION);
  const normalized = normalizeEmbeddingText(text).toLowerCase();

  if (!normalized) {
    // Return orthogonal unit vector for empty text
    vector[0] = 1.0;
    return Array.from(vector);
  }

  // Tokenize words
  const words = normalized
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);

  // Hash words and sub-word char-trigrams
  const tokensToHash: { text: string; weight: number }[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const weight = Math.log(1 + word.length) * Math.max(0.7, 1 - i * 0.02);
    tokensToHash.push({ text: word, weight });

    // Sub-word character trigrams for stemming and morphological overlap
    if (word.length >= 3) {
      for (let j = 0; j <= word.length - 3; j++) {
        tokensToHash.push({
          text: word.slice(j, j + 3),
          weight: weight * 0.4,
        });
      }
    }
  }

  for (const token of tokensToHash) {
    // FNV-1a hash
    let hash = 2166136261;
    for (let i = 0; i < token.text.length; i++) {
      hash ^= token.text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const index = Math.abs(hash) % VECTOR_DIMENSION;
    const sign = (hash & 1) === 0 ? 1 : -1;
    vector[index] += sign * token.weight;

    // Secondary bucket for cross-dimensional dispersion
    const index2 = Math.abs(Math.imul(hash, 31)) % VECTOR_DIMENSION;
    vector[index2] += sign * (token.weight * 0.5);
  }

  // L2 Normalization
  let sumSq = 0;
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    sumSq += vector[i] * vector[i];
  }

  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIMENSION; i++) {
      vector[i] /= norm;
    }
  } else {
    vector[0] = 1.0;
  }

  return Array.from(vector);
}

/**
 * Embed an array of texts with Gemini text-embedding-004,
 * checking the in-memory cache, batching requests, and falling back gracefully.
 */
export async function generateEmbeddings(
  texts: string[],
  options: EmbeddingOptions = {}
): Promise<EmbeddingsResponse> {
  const batchSize = Math.min(options.batchSize || MAX_BATCH_SIZE, 32);
  const timeoutMs = options.timeoutMs || REQUEST_TIMEOUT_MS;
  const skipCache = options.skipCache || false;
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  const normalizedTexts = texts.map((t) => normalizeEmbeddingText(t) || "empty text");
  const embeddings: (number[] | null)[] = new Array(normalizedTexts.length).fill(null);
  const missingIndices: number[] = [];
  const missingTexts: string[] = [];
  let cacheHits = 0;

  // 1. Check cache first
  if (!skipCache) {
    for (let i = 0; i < normalizedTexts.length; i++) {
      const key = normalizedTexts[i];
      if (embeddingCache.has(key)) {
        embeddings[i] = embeddingCache.get(key)!;
        cacheHits++;
      } else {
        missingIndices.push(i);
        missingTexts.push(key);
      }
    }
  } else {
    for (let i = 0; i < normalizedTexts.length; i++) {
      missingIndices.push(i);
      missingTexts.push(normalizedTexts[i]);
    }
  }

  // If all embeddings were found in cache, return immediately
  if (missingIndices.length === 0) {
    return {
      embeddings: embeddings as number[][],
      method: "gemini-embedding-004",
      cacheHits,
    };
  }

  // 2. Fallback if no Gemini API key configured
  if (!apiKey) {
    for (let j = 0; j < missingIndices.length; j++) {
      const idx = missingIndices[j];
      const text = missingTexts[j];
      const fallbackVec = createFallbackEmbedding(text);
      embeddings[idx] = fallbackVec;

      if (!skipCache && embeddingCache.size < MAX_CACHE_SIZE) {
        embeddingCache.set(text, fallbackVec);
      }
    }

    return {
      embeddings: embeddings as number[][],
      method: "fallback-embedding",
      cacheHits,
    };
  }

  // 3. Request embeddings via Google Generative AI in batches
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: EMBEDDING_MODEL_NAME,
    });

    const batches: { indices: number[]; texts: string[] }[] = [];
    for (let i = 0; i < missingTexts.length; i += batchSize) {
      batches.push({
        indices: missingIndices.slice(i, i + batchSize),
        texts: missingTexts.slice(i, i + batchSize),
      });
    }

    for (let b = 0; b < batches.length; b++) {
      const { indices: batchIndices, texts: batchTexts } = batches[b];

      const batchPromise = model.batchEmbedContents({
        requests: batchTexts.map((text) => ({
          content: {
            role: "user",
            parts: [{ text }],
          },
          taskType: options.taskType || TaskType.SEMANTIC_SIMILARITY,
        })),
      });

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error(`Embedding batch timed out after ${timeoutMs}ms`)),
          timeoutMs
        );
      });

      const response = await Promise.race([batchPromise, timeoutPromise]);

      if (!response.embeddings || response.embeddings.length === 0) {
        throw new Error(
          `Batch ${b + 1} returned empty embeddings from ${EMBEDDING_MODEL_NAME}.`
        );
      }

      for (let k = 0; k < response.embeddings.length; k++) {
        const targetIdx = batchIndices[k];
        const textKey = batchTexts[k];
        const vec = response.embeddings[k].values;

        embeddings[targetIdx] = vec;

        // Populate cache
        if (!skipCache && embeddingCache.size < MAX_CACHE_SIZE) {
          embeddingCache.set(textKey, vec);
        }
      }
    }

    return {
      embeddings: embeddings as number[][],
      method: "gemini-embedding-004",
      cacheHits,
    };
  } catch (error) {
    console.warn(
      `[lib/embeddings] Remote embedding failed (${EMBEDDING_MODEL_NAME}). Using deterministic fallback embeddings.`,
      error instanceof Error ? error.message : error
    );

    // Fall back for any unfulfilled embeddings
    for (let j = 0; j < missingIndices.length; j++) {
      const idx = missingIndices[j];
      if (!embeddings[idx]) {
        const text = missingTexts[j];
        const fallbackVec = createFallbackEmbedding(text);
        embeddings[idx] = fallbackVec;

        if (!skipCache && embeddingCache.size < MAX_CACHE_SIZE) {
          embeddingCache.set(text, fallbackVec);
        }
      }
    }

    return {
      embeddings: embeddings as number[][],
      method: "fallback-embedding",
      cacheHits,
    };
  }
}

/**
 * Convenience helper to embed a single text string.
 */
export async function generateSingleEmbedding(
  text: string,
  options?: EmbeddingOptions
): Promise<{ embedding: number[]; method: "gemini-embedding-004" | "fallback-embedding" }> {
  const result = await generateEmbeddings([text], options);
  return {
    embedding: result.embeddings[0],
    method: result.method,
  };
}
