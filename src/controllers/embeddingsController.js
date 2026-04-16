import { EmbeddingService } from '../services/embeddingService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateCreateEmbeddingPayload } from '../validators/embeddingValidators.js';

const embeddingService = new EmbeddingService();

export const createEmbeddings = asyncHandler(async (req, res) => {
  const { text } = validateCreateEmbeddingPayload(req.body);
  const result = await embeddingService.createAndStoreEmbeddings(text);

  res.status(201).json({
    message: 'Embeddings generados y almacenados correctamente.',
    data: result,
  });
});

export const createEmbeddingsAndCompare = asyncHandler(async (req, res) => {
  const { text } = validateCreateEmbeddingPayload(req.body);
  const result = await embeddingService.createStoreAndCompareEmbeddings(text);

  res.status(201).json({
    message: 'Embeddings generados, almacenados y comparados correctamente.',
    data: result,
  });
});

export const getEmbeddingRequest = asyncHandler(async (req, res) => {
  const result = await embeddingService.getRequest(req.params.requestId);

  res.status(200).json({
    message: 'Registro obtenido correctamente.',
    data: result,
  });
});

export const listEmbeddingRequests = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit || 20);
  const result = await embeddingService.listRequests(limit);

  res.status(200).json({
    message: 'Registros obtenidos correctamente.',
    data: result,
  });
});
