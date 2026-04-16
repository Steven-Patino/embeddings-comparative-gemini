import { AppError } from '../utils/AppError.js';

export function validateCreateEmbeddingPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('El cuerpo de la petición es inválido.', 400);
  }

  const text = typeof payload.text === 'string' ? payload.text.trim() : '';

  if (!text) {
    throw new AppError('El campo "text" es obligatorio.', 400);
  }

  return { text };
}

export function validateComparisonPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('El cuerpo de la petición es inválido.', 400);
  }

  const requestId = typeof payload.requestId === 'string' ? payload.requestId.trim() : '';

  if (!requestId) {
    throw new AppError('El campo "requestId" es obligatorio.', 400);
  }

  return { requestId };
}
