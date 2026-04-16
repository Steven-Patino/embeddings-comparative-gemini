import { Router } from 'express';
import {
  createEmbeddings,
  createEmbeddingsAndCompare,
  getEmbeddingRequest,
  listEmbeddingRequests,
} from '../controllers/embeddingsController.js';

const router = Router();

router.post('/compare', createEmbeddingsAndCompare);
router.post('/', createEmbeddings);
router.get('/', listEmbeddingRequests);
router.get('/:requestId', getEmbeddingRequest);

export default router;
