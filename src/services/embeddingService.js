import { createPrimaryGeminiEmbedding, createSecondaryGeminiEmbedding } from '../clients/geminiEmbeddingClient.js';
import { EmbeddingRepository } from '../repositories/embeddingRepository.js';
import { AppError } from '../utils/AppError.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';

export class EmbeddingService {
  constructor(repository = new EmbeddingRepository()) {
    this.repository = repository;
  }

  async createAndStoreEmbeddings(text) {
    const [primaryResult, secondaryResult] = await Promise.all([
      createPrimaryGeminiEmbedding(text),
      createSecondaryGeminiEmbedding(text),
    ]);

    const invalidResult = [primaryResult, secondaryResult].find((result) => !Array.isArray(result.embedding) || result.embedding.length === 0);

    if (invalidResult) {
      throw new AppError(`No se pudo obtener un embedding válido desde ${invalidResult.provider}.`, 502);
    }

    return this.repository.createRequestWithResults({
      text,
      results: [primaryResult, secondaryResult],
    });
  }

  async createStoreAndCompareEmbeddings(text) {
    const persisted = await this.createAndStoreEmbeddings(text);
    const primary = persisted.results.find((item) => item.provider === 'gemini_primary');
    const secondary = persisted.results.find((item) => item.provider === 'gemini_secondary');

    if (!primary || !secondary) {
      throw new AppError('No existen ambos embeddings para realizar la comparación.', 400);
    }

    return {
      requestId: persisted.request.id,
      similarity: cosineSimilarity(primary.embedding, secondary.embedding),
    };
  }

  async getRequest(requestId) {
    const data = await this.repository.findRequestById(requestId);

    if (!data.request) {
      throw new AppError('No se encontró el registro solicitado.', 404);
    }

    return data;
  }

  async listRequests(limit) {
    return this.repository.listRequests(limit);
  }
}
