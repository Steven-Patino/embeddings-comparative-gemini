import { AppError } from './AppError.js';

export function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new AppError('Los embeddings deben ser arreglos numéricos.', 400);
  }

  if (vectorA.length === 0 || vectorB.length === 0) {
    throw new AppError('Los embeddings no pueden estar vacíos.', 400);
  }

  if (vectorA.length !== vectorB.length) {
    throw new AppError(
      `No se puede calcular similitud coseno con dimensiones distintas (${vectorA.length} vs ${vectorB.length}).`,
      400,
    );
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let index = 0; index < vectorA.length; index += 1) {
    const valueA = Number(vectorA[index]);
    const valueB = Number(vectorB[index]);

    dotProduct += valueA * valueB;
    normA += valueA * valueA;
    normB += valueB * valueB;
  }

  if (normA === 0 || normB === 0) {
    throw new AppError('No se puede calcular similitud coseno con vectores de norma cero.', 400);
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
