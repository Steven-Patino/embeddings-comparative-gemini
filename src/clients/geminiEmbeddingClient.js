import { env } from '../config/env.js';
import { createGeminiEmbeddingByModel } from './geminiModelEmbeddingClient.js';

export async function createPrimaryGeminiEmbedding(text) {
  return createGeminiEmbeddingByModel({
    text,
    model: env.primaryEmbeddingModel,
    provider: 'gemini_primary',
  });
}

export async function createSecondaryGeminiEmbedding(text) {
  return createGeminiEmbeddingByModel({
    text,
    model: env.secondaryEmbeddingModel,
    provider: 'gemini_secondary',
  });
}
