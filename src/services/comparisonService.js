import { EmbeddingRepository } from '../repositories/embeddingRepository.js';
import { AppError } from '../utils/AppError.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';

export class ComparisonService {
  constructor(repository = new EmbeddingRepository()) {
    this.repository = repository;
  }

  async compareStoredEmbeddings(requestId) {
    const { request, results } = await this.repository.findRequestById(requestId);

    if (!request) {
      throw new AppError('No se encontró el registro solicitado.', 404);
    }

    const primary = results.find((item) => item.provider === 'gemini_primary');
    const secondary = results.find((item) => item.provider === 'gemini_secondary');

    if (!primary || !secondary) {
      throw new AppError('No existen ambos embeddings para realizar la comparación.', 400);
    }

    const similarity = cosineSimilarity(primary.embedding, secondary.embedding);

    return {
      request,
      comparison: {
        metric: 'cosine_similarity',
        similarity,
        left: {
          provider: primary.provider,
          model: primary.model,
          dimensions: primary.dimensions,
        },
        right: {
          provider: secondary.provider,
          model: secondary.model,
          dimensions: secondary.dimensions,
        },
      },
    };
  }
}
