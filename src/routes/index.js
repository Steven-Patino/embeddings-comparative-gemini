import { Router } from 'express';
import comparisonsRoutes from './comparisonsRoutes.js';
import embeddingsRoutes from './embeddingsRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Servidor operativo.',
    timestamp: new Date().toISOString(),
  });
});

router.use('/embeddings', embeddingsRoutes);
router.use('/comparisons', comparisonsRoutes);

export default router;
