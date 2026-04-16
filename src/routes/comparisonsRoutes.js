import { Router } from 'express';
import { compareEmbeddings } from '../controllers/comparisonsController.js';

const router = Router();

router.post('/cosine', compareEmbeddings);

export default router;
