import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { safeSerialize } from '../utils/safeSerialize.js';

function extractGeminiValues(response) {
  if (Array.isArray(response?.embeddings) && response.embeddings[0]?.values) {
    return response.embeddings[0].values;
  }

  if (response?.embedding?.values) {
    return response.embedding.values;
  }

  return [];
}

export async function createGeminiEmbeddingByModel({ text, model, provider }) {
  const googleAi = new GoogleGenAI({ apiKey: env.geminiApiKey });
  const response = await googleAi.models.embedContent({
    model,
    contents: text,
    config: {
      outputDimensionality: env.embeddingDimensions,
    },
  });

  const embedding = extractGeminiValues(response);

  return {
    provider,
    model,
    dimensions: embedding.length,
    embedding,
    usage: null,
    rawResponse: safeSerialize(response),
  };
}
