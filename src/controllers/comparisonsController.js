import { ComparisonService } from '../services/comparisonService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateComparisonPayload } from '../validators/embeddingValidators.js';

const comparisonService = new ComparisonService();

export const compareEmbeddings = asyncHandler(async (req, res) => {
  const { requestId } = validateComparisonPayload(req.body);
  const result = await comparisonService.compareStoredEmbeddings(requestId);

  res.status(200).json({
    message: 'Comparación realizada correctamente.',
    data: result,
  });
});
